from django.urls import path

from core.api.views.auth import AuthorizationView, RegistrationView
from core.api.views.feedback import FeedbackView
from core.api.views.user import ProfileView, UserView

urlpatterns = [
    path("sign-in/", AuthorizationView().as_view(), name="sign-in"),
    path("sign-up/", RegistrationView().as_view(), name="sign-up"),
    path("profile/", ProfileView().as_view(), name="profile"),
    path("user/<username>/", UserView().as_view(), name="user"),
    path("feedback/<username>/", FeedbackView().as_view(), name="feedback"),
]
