from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from core.api.models import Feedback
from core.api.serializers import FeedbackSerializer


class FeedbackView(ListAPIView):

    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(recipient__username=self.kwargs["username"])
