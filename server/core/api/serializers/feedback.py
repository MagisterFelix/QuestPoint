from collections import OrderedDict

from rest_framework.serializers import ModelSerializer

from core.api.models import Feedback
from core.api.serializers.user import UserSerializer


class FeedbackSerializer(ModelSerializer):

    class Meta:
        model = Feedback
        fields = "__all__"

    def to_representation(self, feedback: Feedback) -> OrderedDict:
        data = OrderedDict(super().to_representation(feedback))

        data["author"] = UserSerializer(feedback.author, context=self.context).data
        data["recipient"] = UserSerializer(feedback.recipient, context=self.context).data

        return data
