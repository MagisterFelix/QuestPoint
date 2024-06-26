from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core.api"

    def ready(self):
        from core.api import signals  # noqa: F401
