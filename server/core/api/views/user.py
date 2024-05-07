from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated

from core.api.models import User
from core.api.serializers import ProfileSerializer, UserSerializer


class ProfileView(RetrieveUpdateAPIView):

    queryset = User.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated,)
    parser_classes = (JSONParser, MultiPartParser,)

    def get_object(self) -> User:
        queryset = self.get_queryset()

        obj = get_object_or_404(queryset, pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)

        return obj


class UserView(RetrieveAPIView):

    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
