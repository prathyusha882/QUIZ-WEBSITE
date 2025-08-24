from django.urls import path
from .views import (
    #RegisterUserView
    RegisterAPIView,
    CustomTokenObtainPairView,
    UserProfileAPIView,
    PasswordChangeAPIView,
    PasswordResetRequestAPIView,
    PasswordResetConfirmAPIView,
    EmailVerificationAPIView,
)

urlpatterns = [
   # path('register/', RegisterUserView.as_view(), name='user-register'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('profile/', UserProfileAPIView.as_view(), name='profile'),
    path('password/change/', PasswordChangeAPIView.as_view(), name='password_change'),
    path('password/reset/', PasswordResetRequestAPIView.as_view(), name='password_reset'),
    path('password/reset/confirm/', PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm'),
    path('email/verify/', EmailVerificationAPIView.as_view(), name='email_verify'),
]
