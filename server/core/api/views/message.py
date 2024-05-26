from django.db.models import Q
from django.db.models.query import QuerySet
from django.http import HttpRequest
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.api.models import Message, Record
from core.api.serializers import MessageSerializer
from core.api.utils import WebSocketUtils


class MessageListView(ListCreateAPIView):

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset.filter(quest__pk=self.kwargs["quest"])
        return queryset

    def list(self, request: HttpRequest, *args, **kwargs) -> Response:
        response = super().list(request, *args, **kwargs)

        if response.status_code != status.HTTP_200_OK:
            return response

        record = Record.objects.get_or_none(
            Q(quest__pk=self.kwargs["quest"]),
            ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
        )

        if record is None:
            return response

        if record.with_notification == request.user:
            record.with_notification = None
            record.save()

        return response

    def create(self, request: HttpRequest, *args, **kwargs) -> Response:
        response = super().create(request, *args, **kwargs)

        if response.status_code != status.HTTP_201_CREATED:
            return response

        record = Record.objects.get_or_none(
            Q(quest__pk=self.kwargs["quest"]),
            ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
        )

        if record is None:
            return response

        record.with_notification = record.quest.creator if request.user == record.worker else record.worker
        record.save()

        if request.user == record.worker:
            WebSocketUtils.update(user_id=record.quest.creator.pk, to_update=f"Messages-{self.kwargs["quest"]}")
            WebSocketUtils.update(user_id=record.quest.creator.pk, to_update="QuestList")
        else:
            WebSocketUtils.update(user_id=record.worker.pk, to_update=f"Messages-{self.kwargs["quest"]}")
            WebSocketUtils.update(user_id=record.worker.pk, to_update="QuestList")

        return response
