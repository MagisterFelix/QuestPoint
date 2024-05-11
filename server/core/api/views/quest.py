from django.db.models.expressions import RawSQL
from django.db.models.query import QuerySet
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Quest
from core.api.serializers import QuestSerializer


class QuestListView(ListCreateAPIView):

    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = super().get_queryset()

        latitude, longitude = self.request.GET.get("latitude"), self.request.GET.get("longitude")

        if latitude is None or longitude is None:
            return queryset.none()

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return queryset.none()

        if not ((-90 <= latitude <= 90) and (-180 <= longitude <= 180)):
            return queryset.none()

        return queryset.annotate(distance=RawSQL(
            "6371 * acos(cos(radians(%s)) * cos(radians(latitude)) * cos(radians(longitude)\
                  - radians(%s)) + sin(radians(%s)) * sin(radians(latitude)))",
            [latitude, longitude, latitude]
        )).filter(distance__lte=5)


class QuestView(RetrieveUpdateDestroyAPIView):

    queryset = Quest.objects.all()
    serializer_class = QuestSerializer
    permission_classes = (IsAuthenticated,)