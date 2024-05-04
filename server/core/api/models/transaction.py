from django.core import signing
from django.core.exceptions import ValidationError
from django.db import models

from .user import User


class Transaction(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.PositiveIntegerField()
    signature = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_signature_obj(self) -> dict:
        obj = {
            "id": self.pk,
            "user": self.user.username,
            "value": self.value,
            "created_at": self.created_at.isoformat()
        }
        return obj

    @property
    def is_valid_signature(self) -> bool:
        return self.get_signature_obj() == signing.loads(self.signature)

    def clean(self) -> None:
        super().clean()

        if self.value == 0:
            raise ValidationError("Value cannot be zero.", code="invalid")

    def save(self, *args, **kwargs) -> None:
        if self.pk:
            raise ValidationError("Transaction cannot be changed.", code="invalid")

        super().save(*args, **kwargs)

        obj = self.get_signature_obj()
        self.signature = signing.dumps(obj)

        super().save(update_fields=["signature"], *args, **kwargs)

    def __str__(self) -> str:
        return self.signature

    class Meta:
        db_table = "transactions"
        ordering = ["created_at"]
