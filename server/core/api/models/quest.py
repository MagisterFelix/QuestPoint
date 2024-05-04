from django.core.exceptions import ValidationError
from django.db import models
from django.template.defaultfilters import truncatechars

from .category import Category
from .user import User


class Quest(models.Model):

    title = models.CharField(max_length=64)
    description = models.TextField(max_length=256)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    reward = models.PositiveIntegerField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def short_description(self) -> str:
        return truncatechars(self.description, 32)

    def clean(self) -> None:
        super().clean()

        if self.reward == 0:
            raise ValidationError("Reward cannot be zero.", code="invalid")

        if self.reward > self.creator.balance:
            raise ValidationError("Reward cannot be greater than creator's balance.", code="invalid")

    def __str__(self) -> str:
        return self.title

    class Meta:
        db_table = "quests"
        ordering = ["created_at"]
