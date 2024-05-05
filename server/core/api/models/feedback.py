from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.template.defaultfilters import truncatechars

from .base import BaseModel
from .user import User


class Feedback(BaseModel):

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipient")
    text = models.TextField(max_length=512, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def short_text(self) -> str:
        return truncatechars(self.text, 64)

    def __str__(self) -> str:
        return self.recipient.username

    class Meta:
        db_table = "feedbacks"
        ordering = ["created_at"]
