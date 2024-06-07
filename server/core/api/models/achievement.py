from django.db import models

from .base import BaseModel
from .trophy import Trophy
from .user import User


class Achievement(BaseModel):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    trophy = models.ForeignKey(Trophy, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.trophy.title

    class Meta:
        db_table = "achievements"
        ordering = ["-created_at"]
