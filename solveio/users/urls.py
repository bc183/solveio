from django.urls import path
from .views import RegisterView, LoginView, get_logged_in_user, get_user
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('me/', get_logged_in_user, name='get_logged_in_user'),
    path('<int:pk>/', get_user, name="get_user"),
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),   
]