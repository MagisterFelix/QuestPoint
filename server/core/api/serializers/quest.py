from collections import OrderedDict

from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from core.api.models import Quest, Record
from core.api.serializers.category import CategorySerializer
from core.api.serializers.user import UserSerializer
from core.api.utils import QuestUtils


class QuestSerializer(ModelSerializer):

    status = SerializerMethodField(method_name="get_status")
    has_notification = SerializerMethodField(method_name="get_has_notification")

    class Meta:
        model = Quest
        exclude = ("creator",)

    def get_status(self, quest: Quest) -> str:
        user = self.context["request"].user

        if quest.creator == user:
            if Record.objects.filter(Q(quest=quest) & ~Q(status=Record.Status.CANCELLED)).exists():
                return "Created"
            return "Created [Waiting]"

        record = Record.objects.get_or_none(quest=quest, worker=user)

        if record is None:
            if Record.objects.filter(quest=quest, status=Record.Status.HAS_OFFER).exists():
                return "Pending"
            return "Available"

        return Record.Status.choices[record.status][1]

    def get_has_notification(self, quest: Quest) -> bool:
        record = Record.objects.get_or_none(
            Q(quest=quest) & ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
        )

        if record is None or record.with_notification is None:
            return False

        return record.with_notification == self.context["request"].user

    def validate(self, attrs: dict) -> dict:
        title = attrs.get("title")
        reward = attrs.get("reward")
        latitude = attrs.get("latitude")
        longitude = attrs.get("longitude")
        creator = self.context["request"].user

        if Quest.objects.filter(title=title, creator=creator).exists():
            raise ValidationError({"title": "Quest with this title already exists."})

        if reward is not None:
            if reward == 0:
                raise ValidationError("Reward cannot be the zero.")

            if reward < 5:
                raise ValidationError("Reward cannot be lower than 5 coins.", code="invalid")

            if reward % 5 != 0:
                raise ValidationError("Reward must be divisible 5.", code="invalid")

            if reward > creator.balance:
                raise ValidationError("Reward cannot be greater than creator's balance.")

        if latitude is not None and longitude is not None and \
                not ((-90 <= latitude <= 90) and (-180 <= longitude <= 180)):
            raise ValidationError("Invalid coords.")

        if Record.objects.filter(Q(quest=self.instance), ~Q(status=Record.Status.CANCELLED)).exists():
            raise ValidationError("Quest cannot be updated if its status had been changed.")

        if latitude is not None and longitude is not None:
            worker = Record.objects.filter(
                Q(worker=creator) & ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
            ).values_list("quest__pk", flat=True)

            taken = Record.objects.filter(
                ~Q(status__in=[Record.Status.HAS_OFFER, Record.Status.CANCELLED])
            ).values_list("quest__pk", flat=True)

            nearby_50_m = Quest.objects.annotate(
                distance=QuestUtils.get_distance_sql(latitude, longitude)
            ).filter(Q(distance__lte=0.05) & (Q(creator=creator) | Q(pk__in=worker) | ~Q(pk__in=taken)))

            if nearby_50_m:
                raise ValidationError("There is already a quest nearby 50 m.")

        attrs["creator"] = creator

        return super().validate(attrs)

    def to_representation(self, quest: Quest) -> OrderedDict:
        data = OrderedDict(super().to_representation(quest))

        data["category"] = CategorySerializer(quest.category, context=self.context).data
        data["creator"] = UserSerializer(quest.creator, context=self.context).data

        return data
