from django.db import models

from .base import BaseModel
from .quest import Quest
from .user import User


class Message(BaseModel):

    class ContentType(models.IntegerChoices):
        TEXT = 0, "Text"
        IMAGE = 1, "Image"

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.BinaryField()
    content_type = models.IntegerField(choices=ContentType.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.ContentType.choices[self.content_type][1]

    class Meta:
        db_table = "messages"
        ordering = ["created_at"]
