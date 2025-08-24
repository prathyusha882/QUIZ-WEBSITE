import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import quizzes.routing  # change 'quiz' to your quiz app name

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            quizzes.routing.websocket_urlpatterns
        )
    ),
})
