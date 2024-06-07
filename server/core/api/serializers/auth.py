from collections import OrderedDict

from django.contrib.auth.models import AbstractUser
from django.db.models import Q
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.api.models import User
from core.api.serializers.user import ProfileSerializer


class AuthorizationSerializer(TokenObtainPairSerializer):

    def validate(self, attrs: dict) -> dict:
        login = attrs["username"]
        password = attrs.get("password", "")

        self.user = User.objects.get_or_none(Q(username=login) | Q(email=login))

        if self.user is None or not self.user.check_password(password):
            raise AuthenticationFailed("No user was found with these credentials.")

        if not self.user.is_active:
            raise AuthenticationFailed("User is blocked.")

        attrs["username"] = self.user.username

        return super().validate(attrs)

    def to_representation(self, tokens: dict) -> OrderedDict:
        data = OrderedDict(tokens)

        if self.user is None:
            return data

        data["user"] = ProfileSerializer(self.user, context=self.context).data

        return data


class RegistrationSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ("username", "email", "password",)
        extra_kwargs = {
            "password": {
                "write_only": True
            },
        }

    def create(self, validated_data: dict) -> AbstractUser:
        user = User.objects.create_user(**validated_data)
        return user

    def to_representation(self, user: User) -> OrderedDict:
        data = OrderedDict(super().to_representation(user))
        return data
