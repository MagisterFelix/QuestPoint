from django.contrib import admin

from core.api.models.record import Record


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):

    list_display = ("quest", "worker", "status",)
    fieldsets = (
        (None, {
            "fields": (
                "quest",
            )
        }),
        ("Information", {
            "fields": (
                "worker", "status", "with_notification", "created_at",
            )
        }),
    )
    readonly_fields = ("with_notification", "created_at",)
