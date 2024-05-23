from typing import Callable

from django.http import HttpRequest, HttpResponse
from rest_framework.utils.serializer_helpers import ReturnDict
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenVerifySerializer

from core.api.utils import AuthorizationUtils


class AuthorizationMiddleware:

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        auth = request.META.get("HTTP_AUTHORIZATION")

        if auth is None:
            return self.get_response(request)

        access = auth.split(" ")[1]
        refresh = request.COOKIES.get("refresh_token")

        if refresh is None:
            return self.get_response(request)

        data = {
            "token": access
        }

        try:
            TokenVerifySerializer(data=data).is_valid()
        except TokenError:
            data = {
                "refresh": refresh
            }

            serializer = TokenRefreshSerializer(data=data)

            try:
                serializer.is_valid()
            except TokenError:
                response = self.get_response(request)
                AuthorizationUtils.remove_refresh_cookie(response)

                return response

            if isinstance(serializer.data, ReturnDict):
                request.META["HTTP_AUTHORIZATION"] = f"Bearer {serializer.data["access"]}"

                response = self.get_response(request)
                AuthorizationUtils.add_access_cookie(response, token=serializer.data["access"])

                return response

        response = self.get_response(request)

        if request.COOKIES.get("access_token") is not None:
            AuthorizationUtils.remove_access_cookie(response)

        return response
