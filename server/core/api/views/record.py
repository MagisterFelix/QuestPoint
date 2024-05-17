from django.db.models import Q
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

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
