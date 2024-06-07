from django.urls import path

from core.api.consumers import UpdaterConsumer

urlpatterns = [
    path("ws/updater/", UpdaterConsumer.as_asgi()),
]
