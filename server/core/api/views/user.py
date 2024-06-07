from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.api.models import User
from core.api.serializers import ProfileSerializer, UserSerializer
from core.api.utils import StripeUtils
from core.settings import STRIPE_TEST_SECRET_KEY


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

    def update(self, request: HttpRequest, *args, **kwargs) -> Response:
        user = self.get_object()

        response = super().update(request, *args, **kwargs)

        if response.status_code != status.HTTP_200_OK or response.data is None:
            return response

        if response.data["balance"] < user.balance:
            StripeUtils.pay(STRIPE_TEST_SECRET_KEY, amount=(user.balance - response.data["balance"]) * 50)

        return response


class UserView(RetrieveAPIView):

    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)
