from django.contrib import admin
from django.http import HttpRequest

from core.api.models.transaction import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):

    list_display = ("signature", "user", "is_valid_signature",)
    fieldsets = (
        (None, {
            "fields": (
                "signature",
            )
        }),
        ("Information", {
            "fields": (
                "user", "value", "is_valid_signature", "created_at",
            )
        }),
    )
    readonly_fields = ("signature", "is_valid_signature", "created_at",)

    def has_add_permission(self, request: HttpRequest, obj: Transaction | None = None) -> bool:
        return False

    def has_change_permission(self, request: HttpRequest, obj: Transaction | None = None) -> bool:
        return False

    def has_delete_permission(self, request: HttpRequest, obj: Transaction | None = None) -> bool:
        return False
