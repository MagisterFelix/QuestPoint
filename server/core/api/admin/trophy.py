from django.contrib import admin
from django.utils.html import format_html

from core.api.models.trophy import Trophy


@admin.register(Trophy)
class TrophyAdmin(admin.ModelAdmin):

    def preview(self, trophy: Trophy) -> str:
        return format_html(f"<img src=\"{trophy.image.url}\" style=\"max-width: 128px; max-height: 128px\"/>")

    list_display = ("title", "short_description",)
    fieldsets = (
        (None, {
            "fields": (
                "title",
            )
        }),
        ("Information", {
            "fields": (
                "description", "activation", "preview", "image",
            )
        }),
    )
    readonly_fields = ("preview",)
