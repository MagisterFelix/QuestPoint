from collections import OrderedDict

from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from core.api.models import Quest, Record
from core.api.serializers.category import CategorySerializer
from core.api.serializers.user import UserSerializer


class QuestSerializer(ModelSerializer):

    status = SerializerMethodField(method_name="get_status")

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
            return "Available"

        return Record.Status.choices[record.status][1]

    def validate(self, attrs: dict) -> dict:
        title = attrs.get("title")
        reward = attrs.get("reward")
        latitude = attrs.get("latitude")
        longitude = attrs.get("longitude")
        creator = self.context["request"].user

        if Quest.objects.filter(title=title, creator=creator).exists():
            raise ValidationError({"title": "Quest with this title already exists."})

        if reward == 0:
            raise ValidationError("Reward cannot be the zero.")

        if latitude is not None and longitude is not None and \
                not ((-90 <= latitude <= 90) and (-180 <= longitude <= 180)):
            raise ValidationError("Invalid coords.")

        if reward is not None and reward > creator.balance:
            raise ValidationError("Reward cannot be greater than creator's balance.")

        if Record.objects.filter(Q(quest=self.instance), ~Q(status=Record.Status.CANCELLED)).exists():
            raise ValidationError("Quest cannot be updated if its status had been changed.")

        attrs["creator"] = creator

        return super().validate(attrs)

    def to_representation(self, quest: Quest) -> OrderedDict:
        data = OrderedDict(super().to_representation(quest))

        data["category"] = CategorySerializer(quest.category, context=self.context).data
        data["creator"] = UserSerializer(quest.creator, context=self.context).data

        return data
