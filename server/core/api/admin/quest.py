from django.contrib import admin

from core.api.models.quest import Quest


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):

    list_display = ("title", "short_description", "creator", "reward",)
    fieldsets = (
        (None, {
            "fields": (
                "title",
            )
        }),
        ("Information", {
            "fields": (
                "description", "creator", "category", "reward", "latitude", "longitude", "created_at",
            )
        }),
    )
    readonly_fields = ("created_at",)
