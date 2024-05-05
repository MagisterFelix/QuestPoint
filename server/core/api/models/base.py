from django.db import models


class BaseManager(models.Manager):

    def get_or_none(self, *args, **kwargs) -> models.Model | None:
        try:
            return self.get(*args, **kwargs)
        except self.model.DoesNotExist:
            return None


class BaseModel(models.Model):

    objects: BaseManager = BaseManager()

    class Meta:
        abstract = True
