from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html

from core.api.models.user import User


@admin.register(User)
class UserAdmin(UserAdmin):

    def avatar(self, user: User) -> str:
        return format_html(f"<img src=\"{user.image.url}\" style=\"max-width: 128px; max-height: 128px\"/>")

    fieldsets = (
        (None, {
            "fields": (
                "username", "password",
            )
        }),
        ("Personal info", {
            "fields": (
                "first_name", "last_name", "email", "avatar", "image", "balance", "xp",
            )
        }),
        ("Permissions", {
            "fields": (
                "is_active", "is_staff", "is_superuser",
            )
        }),
        ("Important dates", {
            "fields": (
                "last_login", "date_joined",
            )
        }),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2")
            }
        ),
    )
    readonly_fields = ("avatar", "last_login", "date_joined", "balance", "xp")
