import math

from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.api.models import Record
from core.api.serializers import RecordSerializer


class RecordListView(CreateAPIView):

    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = (IsAuthenticated,)


class RecordView(RetrieveUpdateAPIView):

    lookup_field = "quest"
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self) -> Record:
        return self.queryset.get(
            Q(quest__pk=self.kwargs["quest"]),
            ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
        )

    def update(self, request: HttpRequest, *args, **kwargs) -> Response:
        record = self.get_object()

        response = super().update(request, *args, **kwargs)

        if response.status_code != status.HTTP_200_OK:
            return response

        if response.data and response.data["status"] == Record.Status.choices[Record.Status.COMPLETED][1]:
            creator = record.quest.creator
            creator.xp += math.ceil(record.quest.reward / 10) * 10
            creator.save()

            worker = record.worker
            worker.balance += record.quest.reward
            worker.xp += math.ceil(record.quest.reward / 10) * 10
            worker.save()

        return response
