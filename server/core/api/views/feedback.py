from django.db.models.query import QuerySet
from django.http import HttpRequest
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.api.models import Feedback
from core.api.serializers import FeedbackSerializer
from core.api.utils import WebSocketUtils


class FeedbackView(ListCreateAPIView):

    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset.filter(recipient__username=self.kwargs["username"])
        return queryset

    def create(self, request: HttpRequest, *args, **kwargs) -> Response:
        response = super().create(request, *args, **kwargs)

        if response.status_code != status.HTTP_201_CREATED or response.data is None:
            return response

        author = response.data["author"]["id"]
        recipient = response.data["recipient"]["id"]

        WebSocketUtils.update(user_id=author, to_update=f"Feedback-{recipient}")
        WebSocketUtils.update(user_id=recipient, to_update=f"Feedback-{recipient}")

        return response
