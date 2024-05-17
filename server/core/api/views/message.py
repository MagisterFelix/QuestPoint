from django.db.models.query import QuerySet
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Message
from core.api.serializers import MessageSerializer


class MessageListView(ListCreateAPIView):

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset.filter(quest__pk=self.kwargs["quest"])
        return queryset
