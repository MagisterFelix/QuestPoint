from django.urls import path

from core.api.views import (AchievementListView, AuthorizationView, FeedbackView, ProfileView, RegistrationView,
                            TrophyListView, UserView)

urlpatterns = [
    path("sign-in/", AuthorizationView().as_view(), name="sign-in"),
    path("sign-up/", RegistrationView().as_view(), name="sign-up"),
    path("profile/", ProfileView().as_view(), name="profile"),
    path("user/<username>/", UserView().as_view(), name="user"),
    path("feedback/<username>/", FeedbackView().as_view(), name="feedback"),
    path("trophies/", TrophyListView().as_view(), name="trophies"),
    path("achievements/<username>/", AchievementListView().as_view(), name="achievements"),
]
