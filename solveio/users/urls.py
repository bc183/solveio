from django.urls import path
from .views import RegisterView, LoginView, check_password, check_user_exits_and_send_mail, get_logged_in_user, get_user, update_password_forgot_password, update_password_when_logged_in, update_user
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('me/', get_logged_in_user, name='get_logged_in_user'),
    path('<int:pk>/', get_user, name="get_user"),
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),   
    path('check-mail/', check_user_exits_and_send_mail, name='check-mail'),
    path('update-password/', update_password_forgot_password, name='update-password'),
    path('update-password-logged-in/', update_password_when_logged_in, name='update_password_when_logged_in'),
    path('update/<int:pk>/', update_user, name='update_user'),
    path('check-password/', check_password, name='check_password'),

]