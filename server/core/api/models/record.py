from django.core.exceptions import ValidationError
from django.db import models

from .quest import Quest
from .user import User


class Record(models.Model):

    class Status(models.IntegerChoices):
        HAS_OFFER = 0, "Has an offer"
        IN_PROGRESS = 1, "In progress"
        WAITING_CREATOR = 2, "Waiting for the creator's response"
        WAITING_WORKER = 3, "Waiting for the worker's response"
        CANCELLED = 4, "Cancelled"
        COMPLETED = 5, "Completed"

    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    worker = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.IntegerField(choices=Status.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self) -> None:
        super().clean()

        if self.pk:
            return None

        if self.worker.pk and self.objects.filter(worker=self.worker, status=self.Status.CANCELLED).exists():
            raise ValidationError("Worker has already been cancelled.", code="invalid")

    def __str__(self) -> str:
        return self.quest.title

    class Meta:
        db_table = "records"
        ordering = ["created_at"]
