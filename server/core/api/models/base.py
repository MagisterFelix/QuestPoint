from typing import Generic, Type, TypeVar

from django.db import models

_T = TypeVar("_T")


class BaseManager(models.Manager, Generic[_T]):

    def get_or_none(self, *args, **kwargs) -> Type[_T] | None:
        try:
            return self.get(*args, **kwargs)
        except self.model.DoesNotExist:
            return None


class BaseModel(models.Model):

    objects: BaseManager = BaseManager()

    class Meta:
        abstract = True
