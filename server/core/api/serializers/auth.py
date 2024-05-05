from collections import OrderedDict

from django.contrib.auth.models import AbstractUser
from django.db.models import Q
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.api.models import User


class AuthorizationSerializer(TokenObtainPairSerializer):

    def validate(self, attrs: dict) -> dict:
        login = attrs["username"]
        password = attrs.get("password", "")

        user = User.objects.get_or_none(Q(username=login) | Q(email=login))

        if user is None or not user.check_password(password):
            raise AuthenticationFailed("No user was found with these credentials.")

        if not user.is_active:
            raise AuthenticationFailed("User is blocked.")

        attrs["username"] = user.username

        return super().validate(attrs)

    def to_representation(self, tokens: dict):
        data = OrderedDict()

        data["tokens"] = tokens

        data["details"] = "User has been authorized."

        return data


class RegistrationSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "password",)
        extra_kwargs = {
            "first_name": {
                "required": True
            },
            "password": {
                "write_only": True
            },
        }

    def create(self, validated_data: dict) -> AbstractUser:
        user = User.objects.create_user(**validated_data)
        return user

    def to_representation(self, user: User):
        data = OrderedDict()

        data["user"] = super().to_representation(user)

        data["details"] = "User has been registered."

        return data
