from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Trophy
from core.api.serializers import TrophySerializer


class TrophyListView(ListAPIView):

    queryset = Trophy.objects.all()
    serializer_class = TrophySerializer
    permission_classes = (IsAuthenticated,)
