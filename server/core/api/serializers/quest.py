from collections import OrderedDict

from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer

from core.api.models import Quest, Record, User
from core.api.serializers.category import CategorySerializer
from core.api.serializers.user import UserSerializer


class QuestSerializer(ModelSerializer):

    class Meta:
        model = Quest
        exclude = ["creator"]

    def validate(self, attrs: dict) -> dict:
        reward = attrs.get("reward")
        latitude = attrs.get("latitude")
        longitude = attrs.get("longitude")
        creator: User = self.context["request"].user

        if reward == 0:
            raise ValidationError("Reward cannot be the zero.")

        if latitude is not None and longitude is not None and \
                not ((-90 <= latitude <= 90) and (-180 <= longitude <= 180)):
            raise ValidationError("Invalid coords.")

        if reward is not None and reward > creator.balance:
            raise ValidationError("Reward cannot be greater than creator's balance.")

        if Record.objects.filter(quest=self.instance).exists():
            raise ValidationError("Quest cannot be updated if its status had been changed.")

        attrs["creator"] = creator

        return super().validate(attrs)

    def to_representation(self, quest: Quest) -> OrderedDict:
        data = OrderedDict(super().to_representation(quest))

        data["category"] = CategorySerializer(quest.category, context=self.context).data
        data["creator"] = UserSerializer(quest.creator, context=self.context).data

        return data
