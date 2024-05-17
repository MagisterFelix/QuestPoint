from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q

from .base import BaseModel
from .quest import Quest
from .user import User


class Record(BaseModel):

    class Status(models.IntegerChoices):
        HAS_OFFER = 0, "Has an offer"
        IN_PROGRESS = 1, "In progress"
        WAITING_CREATOR = 2, "Waiting for the creator's response"
        WAITING_WORKER = 3, "Waiting for the worker's response"
        CANCELLED = 4, "Cancelled"
        COMPLETED = 5, "Completed"

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    worker = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.IntegerField(choices=Status.choices, default=Status.HAS_OFFER)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self) -> None:
        super().clean()

        if hasattr(self, "quest") and hasattr(self, "worker") and self.quest.creator == self.worker:
            raise ValidationError("Creator cannot be the worker.", code="invalid")

        if hasattr(self, "quest") and hasattr(self, "worker") and \
                self.__class__.objects.filter(
                    Q(quest=self.quest) &
                    ~Q(worker=self.worker) &
                    ~Q(status=self.Status.CANCELLED)).exists():
            raise ValidationError("Quest already taken or completed.", code="invalid")

    def __str__(self) -> str:
        return self.quest.title

    class Meta:
        db_table = "records"
        unique_together = (("quest", "worker",))
        ordering = ["created_at"]
