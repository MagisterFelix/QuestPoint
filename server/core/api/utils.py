import os

import stripe
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models.expressions import RawSQL


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
