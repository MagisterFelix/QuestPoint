from django.db.models import Q
from django.db.models.expressions import RawSQL
from django.db.models.query import QuerySet
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Quest, Record
from core.api.serializers import QuestSerializer


class QuestListView(ListCreateAPIView):

    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset

        records = Record.objects.filter(worker=self.request.user)

        latitude, longitude = self.request.GET.get("latitude"), self.request.GET.get("longitude")

        if latitude is None and longitude is None:
            records = records.filter(
                ~Q(status__in=[Record.Status.CANCELLED, Record.Status.COMPLETED])
            ).values_list("quest__pk", flat=True)
            return queryset.filter(Q(creator=self.request.user) | Q(pk__in=records))

        if latitude is None or longitude is None:
            return queryset.none()

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return queryset.none()

        if not ((-90 <= latitude <= 90) and (-180 <= longitude <= 180)):
            return queryset.none()

        records = records.values_list("quest__pk", flat=True)

        return queryset.annotate(distance=RawSQL(
            "6371 * acos(cos(radians(%s)) * cos(radians(latitude)) * cos(radians(longitude)\
                  - radians(%s)) + sin(radians(%s)) * sin(radians(latitude)))",
            [latitude, longitude, latitude]
        )).filter(Q(distance__lte=5) & ~Q(creator=self.request.user) & ~Q(pk__in=records))


class QuestView(RetrieveUpdateDestroyAPIView):

    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = (IsAuthenticated,)
