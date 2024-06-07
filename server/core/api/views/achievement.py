from django.db.models.query import QuerySet
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Achievement
from core.api.serializers import AchievementSerializer


class AchievementListView(ListAPIView):

    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet:
        queryset = self.queryset.filter(user__username=self.kwargs["username"])
        return queryset
