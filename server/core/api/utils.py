import os

import jwt
import stripe
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models.expressions import RawSQL
from django.http import HttpResponse
from django.utils import timezone
from jwt.exceptions import DecodeError


class ImageUtils:

    @staticmethod
    def validate_image_file_extension(file) -> None:
        valid_extensions = [".jpg", ".jpeg", ".png"]
        extension = os.path.splitext(file.name)[1]

        if not extension.lower() in valid_extensions:
            raise ValidationError("The file uploaded either not an image or a corrupted image.")

    @staticmethod
    def upload_image_to(filename: str, name: str, folder: str, title: str) -> str:
        directory = os.path.join(settings.MEDIA_ROOT, f"{folder}")

        if not os.path.exists(directory):
            os.makedirs(directory)

        for file in os.listdir(directory):
            if file.startswith(f"{name}-"):
                os.remove(os.path.join(settings.MEDIA_ROOT, f"{folder}/{file}"))

        return f"{folder}/{title}{os.path.splitext(filename)[-1]}"

    @staticmethod
    def remove_image_from(path: str) -> None:
        if not os.path.exists(path):
            return None

        os.remove(path)


class QuestUtils:

    @staticmethod
    def get_distance_sql(latitude: float, longitude: float) -> RawSQL:
        return RawSQL(
            "6371 * acos(cos(radians(%s)) * cos(radians(latitude)) * cos(radians(longitude)\
                            - radians(%s)) + sin(radians(%s)) * sin(radians(latitude)))",
            [latitude, longitude, latitude]
        )


class StripeUtils:

    @staticmethod
    def pay(api_key: str, amount: int) -> None:
        stripe.api_key = api_key

        # ! Just a simulation of payment !

        stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            payment_method="pm_card_visa",
            automatic_payment_methods={
                "enabled": True,
                "allow_redirects": "never"
            },
            confirm=True
        )


class AuthorizationUtils:

    @staticmethod
    def get_user_id(token: str) -> int | None:
        if token is None:
            return None

        try:
            user_id = jwt.decode(
                jwt=token,
                key=settings.SIMPLE_JWT["SIGNING_KEY"],
                algorithms=[settings.SIMPLE_JWT["ALGORITHM"]],
            )["user_id"]
        except DecodeError:
            return None

        return user_id

    @staticmethod
    def set_access_cookie(response: HttpResponse, token: str, httponly: bool) -> None:
        cookie = {
            "key": "access_token",
            "value": token,
            "expires": timezone.now() + settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            "httponly": httponly,
        }

        response.set_cookie(**cookie)

    @staticmethod
    def remove_access_cookie(response: HttpResponse) -> None:
        response.delete_cookie("access_token")

    @staticmethod
    def set_refresh_cookie(response: HttpResponse, token: str, httponly: bool) -> None:
        cookie = {
            "key": "refresh_token",
            "value": token,
            "expires": timezone.now() + settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
            "httponly": httponly,
        }

        response.set_cookie(**cookie)

    @staticmethod
    def remove_refresh_cookie(response: HttpResponse) -> None:
        response.delete_cookie("refresh_token")


class WebSocketUtils:

    @staticmethod
    def _send_to_group(group: str, event: dict) -> None:
        channel_layer = get_channel_layer()

        if channel_layer is None:
            return None

        async_to_sync(channel_layer.group_send)(group, event)

    @staticmethod
    def update(user_id: int, to_update: str) -> None:
        WebSocketUtils._send_to_group(
            f"updater-{user_id}",
            {
                "type": "update",
                "toUpdate": to_update
            }
        )
