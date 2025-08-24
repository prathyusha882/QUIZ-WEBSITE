import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Quiz_Website_Project.settings")

app = Celery("Quiz_Website_Project")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
