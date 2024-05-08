from django.middleware.csrf import rotate_token
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from core.api.serializers import AuthorizationSerializer, RegistrationSerializer


class AuthorizationView(APIView):

    serializer_class = AuthorizationSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data, context={"request": self.request})
        serializer.is_valid(raise_exception=True)

        rotate_token(request._request)

        response = Response(data=serializer.data, status=status.HTTP_200_OK)

        return response


class RegistrationView(APIView):

    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response = Response(data=serializer.data, status=status.HTTP_201_CREATED)

        return response
