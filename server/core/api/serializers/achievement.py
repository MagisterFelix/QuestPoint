from collections import OrderedDict

from rest_framework.serializers import ModelSerializer

from core.api.models import Achievement
from core.api.serializers.trophy import TrophySerializer
from core.api.serializers.user import UserSerializer


class AchievementSerializer(ModelSerializer):

    class Meta:
        model = Achievement
        fields = "__all__"

    def to_representation(self, achievement: Achievement) -> OrderedDict:
        data = OrderedDict(super().to_representation(achievement))

        data["user"] = UserSerializer(achievement.user, context=self.context).data
        data["trophy"] = TrophySerializer(achievement.trophy, context=self.context).data

        return data
