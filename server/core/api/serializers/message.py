from collections import OrderedDict

from rest_framework.serializers import ModelSerializer

from core.api.models import Message, Quest
from core.api.serializers.quest import QuestSerializer
from core.api.serializers.user import UserSerializer


class MessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        exclude = ("quest", "author",)

    def validate(self, attrs: dict) -> dict:
        attrs["quest"] = Quest.objects.get(pk=self.context["view"].kwargs["quest"])
        attrs["author"] = self.context["request"].user

        return super().validate(attrs)

    def to_representation(self, message: Message) -> OrderedDict:
        data = OrderedDict(super().to_representation(message))

        data["content_type"] = Message.ContentType.choices[message.content_type][1]
        data["quest"] = QuestSerializer(message.quest, context=self.context).data
        data["author"] = UserSerializer(message.author, context=self.context).data

        return data
