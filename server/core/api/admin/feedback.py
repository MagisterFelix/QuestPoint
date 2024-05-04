from django.contrib import admin

from core.api.models.feedback import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):

    list_display = ("recipient", "author", "rating", "short_text",)
    fieldsets = (
        (None, {
            "fields": (
                "recipient",
            )
        }),
        ("Information", {
            "fields": (
                "author", "text", "rating", "created_at",
            )
        }),
    )
    readonly_fields = ("created_at",)
