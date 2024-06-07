from django.db import models
from django.template.defaultfilters import truncatechars
from django.utils import timezone

from core.api.utils import ImageUtils

from .base import BaseModel


class Trophy(BaseModel):

    def upload_image_to(self, filename: str) -> str:
        name = self.title.lower().replace(" ", "_").replace("-", "_")
        folder, title = "trophies", f"{name}-{int(timezone.now().timestamp())}"

        return ImageUtils.upload_image_to(filename, name, folder, title)

    def remove_image(self) -> None:
        name = self.image.name

        if "static" in name:
            return None

        path = self.image.path

        ImageUtils.remove_image_from(path)

    title = models.CharField(max_length=64, unique=True)
    description = models.TextField(max_length=256)
    image = models.FileField(
        upload_to=upload_image_to,
        validators=[ImageUtils.validate_image_file_extension]
    )
    activation = models.TextField()

    @property
    def short_description(self) -> str:
        return truncatechars(self.description, 32)

    def delete(self, *args, **kwargs) -> tuple[int, dict]:
        self.remove_image()
        return super().delete(*args, **kwargs)

    def __str__(self) -> str:
        return self.title

    class Meta:
        db_table = "trophies"
        ordering = ["-title"]
