from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from core.api.utils import ImageUtils

from .base import BaseManager


class UserManager(BaseUserManager, BaseManager):

    def get_or_none(self, *args, **kwargs) -> AbstractUser | None:
        try:
            return self.get(*args, **kwargs)
        except self.model.DoesNotExist:
            return None

    def create_user(self, username: str, email: str, password: str, **extra_fields) -> models.Model:
        if username is None or username == "":
            raise ValueError("User must have an username.")

        if email is None or email == "":
            raise ValueError("User must have an email.")

        if password is None or password == "":
            raise ValueError("User must have a password.")

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            **extra_fields
        )
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username: str, email: str, password: str, **extra_fields) -> models.Model:
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):

    DEFAULT_AVATAR_PATH = "../static/avatar-default.svg"

    def upload_image_to(self, filename: str) -> str:
        name = self.username
        folder, title = "users", f"{name}-{int(timezone.now().timestamp())}"

        return ImageUtils.upload_image_to(filename, name, folder, title)

    def remove_image(self) -> None:
        name = self.image.name

        if "static" in name:
            return None

        path = self.image.path

        ImageUtils.remove_image_from(path)

    email = models.EmailField(max_length=150, unique=True, blank=False, null=False)
    image = models.FileField(
        default=DEFAULT_AVATAR_PATH,
        upload_to=upload_image_to,
        validators=[ImageUtils.validate_image_file_extension]
    )
    balance = models.PositiveIntegerField(default=0)
    xp = models.FloatField(default=0.0)

    objects: UserManager = UserManager()

    def delete(self, *args, **kwargs) -> tuple[int, dict]:
        self.remove_image()
        return super().delete(*args, **kwargs)

    def __str__(self) -> str:
        return self.username

    class Meta:
        db_table = "users"
