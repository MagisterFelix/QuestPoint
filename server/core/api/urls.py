from django.urls import path, re_path

from core.api.views.auth import AuthorizationView, RegistrationView
from core.api.views.deprecated_category import DeprecatedCategoryView
from core.api.views.deprecated_quest import DeprecatedQuestView

urlpatterns = [
    path("sign-in/", AuthorizationView().as_view(), name="sign-in"),
    path("sign-up/", RegistrationView().as_view(), name="sign-up"),
    re_path(r"deprecated-quests/(?P<lat>[\d+\.\d+]+)/(?P<lon>[\d+\.\d+]+)",
            DeprecatedQuestView().as_view(), name="quests"),
    path("deprecated-quest/", DeprecatedQuestView().as_view(), name="quest"),
    path("deprecated-categories/", DeprecatedCategoryView().as_view(), name="categories"),
]
