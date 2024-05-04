from django.contrib import admin
from django.utils.html import format_html

from core.api.models.category import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    def preview(self, category: Category) -> str:
        return format_html(f"<img src=\"{category.image.url}\" style=\"max-width: 128px; max-height: 128px\"/>")

    list_display = ("title",)
    fieldsets = (
        (None, {
            "fields": (
                "title",
            )
        }),
        ("Information", {
            "fields": (
                "preview", "image",
            )
        }),
    )
    readonly_fields = ("preview",)
