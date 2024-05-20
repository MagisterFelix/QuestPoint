from collections import OrderedDict

from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer

from core.api.models import Quest, Record
from core.api.serializers.quest import QuestSerializer
from core.api.serializers.user import UserSerializer


class RecordSerializer(ModelSerializer):

    class Meta:
        model = Record
        exclude = ("worker",)

    def validate(self, attrs: dict) -> dict:
        if self.instance is None:
            quest = attrs["quest"]
            worker = self.context["request"].user
        else:
            quest = Quest.objects.get(pk=self.context["view"].kwargs["quest"])
            worker = self.instance.worker

        if quest.creator == worker:
            raise ValidationError("Creator cannot be the worker.")

        if Record.objects.filter(Q(quest=quest) & ~Q(worker=worker) & ~Q(status=Record.Status.CANCELLED)).exists():
            raise ValidationError("Quest already taken or completed.", code="invalid")

        attrs["worker"] = worker

        return super().validate(attrs)

    def to_representation(self, record: Record) -> OrderedDict:
        data = OrderedDict(super().to_representation(record))

        data["status"] = Record.Status.choices[record.status][1]
        data["quest"] = QuestSerializer(record.quest, context=self.context).data
        data["worker"] = UserSerializer(record.worker, context=self.context).data

        return data
