from django.db.models import Count, Q
from django.db.models.query import QuerySet
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Quest, Record
from core.api.serializers import QuestSerializer
from core.api.utils import QuestUtils


class QuestListView(ListCreateAPIView):

    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset

        latitude, longitude = self.request.GET.get("latitude"), self.request.GET.get("longitude")

        if latitude is None and longitude is None:
            creator_with_records = Record.objects.filter(
                Q(quest__creator=self.request.user) & ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
            ).values_list("quest__pk", flat=True)

            creator_without_records = Quest.objects.filter(
                creator=self.request.user
            ).annotate(
                record_count=Count("record")
            ).filter(
                record_count=0
            ).values_list("pk", flat=True)

            creator = Quest.objects.filter(
                Q(pk__in=creator_with_records) | Q(pk__in=creator_without_records)
            ).values_list("pk", flat=True)

            worker = Record.objects.filter(
                Q(worker=self.request.user) & ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
            ).values_list("quest__pk", flat=True)

            return queryset.filter(Q(pk__in=creator) | Q(pk__in=worker))

        if latitude is None or longitude is None:
            return queryset.none()

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return queryset.none()

        if not ((-90 <= latitude <= 90) and (-180 <= longitude <= 180)):
            return queryset.none()

        worker = Record.objects.filter(
            Q(worker=self.request.user) & ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
        ).values_list("quest__pk", flat=True)

        taken = Record.objects.filter(
            ~Q(status__in=[Record.Status.HAS_OFFER, Record.Status.CANCELLED])
        ).values_list("quest__pk", flat=True)

        return queryset.annotate(
            distance=QuestUtils.get_distance_sql(latitude, longitude)
        ).filter(Q(distance__lte=5) & (~Q(creator=self.request.user) & ~Q(pk__in=taken) | Q(pk__in=worker)))


class QuestView(RetrieveUpdateDestroyAPIView):

    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = (IsAuthenticated,)
