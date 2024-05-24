from collections import OrderedDict

from rest_framework.serializers import ModelSerializer

from core.api.models import Trophy


class TrophySerializer(ModelSerializer):

    class Meta:
        model = Trophy
        exclude = ("activation",)

    def to_representation(self, trophy: Trophy) -> OrderedDict:
        data = OrderedDict(super().to_representation(trophy))
        return data
