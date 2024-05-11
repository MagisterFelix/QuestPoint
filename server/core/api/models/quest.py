from django.core.exceptions import ValidationError
from django.db import models
from django.template.defaultfilters import truncatechars

from .base import BaseModel
from .category import Category
from .user import User


class Quest(BaseModel):

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

        if self.latitude and self.longitude and not ((-90 <= self.latitude <= 90) and (-180 <= self.longitude <= 180)):
            raise ValidationError("Invalid coords.", code="invalid")

        if hasattr(self, "creator") and self.reward > self.creator.balance:
            raise ValidationError("Reward cannot be greater than creator's balance.", code="invalid")

    def save(self, *args, **kwargs) -> None:
        reward = 0

        if self.pk:
            prev = self.__class__.objects.get(pk=self.pk)

            if prev.reward != self.reward:
                reward = self.reward - prev.reward
        else:
            reward = self.reward

        self.creator.balance -= reward
        self.creator.save()

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs) -> tuple[int, dict]:
        self.creator.balance += self.reward
        self.creator.save()

        return super().delete(*args, **kwargs)

    def __str__(self) -> str:
        return self.title

    class Meta:
        db_table = "quests"
        unique_together = (("title", "creator",))
        ordering = ["created_at"]
