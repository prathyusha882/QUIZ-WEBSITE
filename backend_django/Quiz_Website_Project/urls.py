from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView  # Your custom login view

urlpatterns = [
    path('', lambda request: HttpResponse("Welcome to the Quiz API Backend")),
    path('admin/', admin.site.urls),

    # JWT token endpoints with correct paths matching frontend API.js
    path('api/users/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Application URLs
    path('api/users/', include('users.urls')),
    path('api/quizzes/', include('quizzes.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
