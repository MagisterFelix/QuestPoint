from django.contrib import admin

from core.api.models.message import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = ("content_type", "quest", "author", "created_at",)
    fieldsets = (
        (None, {
            "fields": (
                "content_type",
            )
        }),
        ("Information", {
            "fields": (
                "content", "quest", "author", "created_at",
            )
        }),
    )
    readonly_fields = ("created_at",)
