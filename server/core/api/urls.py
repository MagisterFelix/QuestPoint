from django.urls import path, re_path

from core.api.views.auth import AuthorizationView, RegistrationView
from core.api.views.quest import QuestView

urlpatterns = [
    path("sign-in/", AuthorizationView().as_view(), name="sign-in"),
    path("sign-up/", RegistrationView().as_view(), name="sign-up"),
    re_path(r"quests/(?P<lat>[\d+\.\d+]+)/(?P<lon>[\d+\.\d+]+)", QuestView().as_view(), name="quests")
]
