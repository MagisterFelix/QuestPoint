import math

from django.db.models import Q
from django.http import HttpRequest
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.api.models import Record
from core.api.serializers import RecordSerializer
from core.api.utils import StripeUtils, WebSocketUtils
from core.settings import STRIPE_MAIN_SECRET_KEY


class RecordListView(CreateAPIView):

    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request: HttpRequest, *args, **kwargs) -> Response:
        response = super().create(request, *args, **kwargs)

        if response.status_code != status.HTTP_201_CREATED or response.data is None:
            return response

        creator = response.data["quest"]["creator"]["id"]

        WebSocketUtils.update(user_id=creator, to_update="QuestList")

        return response


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

    def retrieve(self, request: HttpRequest, *args, **kwargs) -> Response:
        record = self.get_object()

        response = super().retrieve(request, *args, **kwargs)

        if response.status_code != status.HTTP_200_OK or response.data is None:
            return response

        if response.data["with_notification"] and response.data["with_notification"]["id"] == request.user.pk:
            response.data["with_notification"] = None
            record.with_notification = None
            record.save()

        return response

    def update(self, request: HttpRequest, *args, **kwargs) -> Response:
        record = self.get_object()

        response = super().update(request, *args, **kwargs)

        if response.status_code != status.HTTP_200_OK or response.data is None:
            return response

        if response.data["status"] == Record.Status.choices[Record.Status.COMPLETED][1]:
            creator = record.quest.creator
            creator.xp += math.ceil(record.quest.reward / 10) * 10
            creator.save()

            worker = record.worker
            worker.balance += record.quest.reward
            worker.xp += math.ceil(record.quest.reward / 10) * 10
            worker.save()

            StripeUtils.pay(STRIPE_MAIN_SECRET_KEY, amount=record.quest.reward * 10)

            if request.user == record.worker:
                WebSocketUtils.update(user_id=record.quest.creator.pk, to_update="Profile")
            else:
                WebSocketUtils.update(user_id=record.worker.pk, to_update="Profile")
        elif response.data["status"] != Record.Status.choices[Record.Status.CANCELLED][1]:
            record = self.get_object()
            record.with_notification = record.quest.creator if request.user == record.worker else record.worker
            record.save()

        if request.user == record.worker:
            WebSocketUtils.update(user_id=record.quest.creator.pk, to_update=f"Record-{record.quest.pk}")
            WebSocketUtils.update(user_id=record.quest.creator.pk, to_update="QuestList")
        else:
            WebSocketUtils.update(user_id=record.worker.pk, to_update=f"Record-{record.quest.pk}")
            WebSocketUtils.update(user_id=record.worker.pk, to_update="QuestList")

        return response
