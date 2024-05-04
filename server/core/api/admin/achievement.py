from django.contrib import admin

from core.api.models.achievement import Achievement


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):

    list_display = ("trophy",)
    fieldsets = (
        (None, {
            "fields": (
                "trophy",
            )
        }),
        ("Information", {
            "fields": (
                "user", "created_at",
            )
        }),
    )
    readonly_fields = ("created_at",)
