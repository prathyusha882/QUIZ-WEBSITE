from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    if created and instance.email:
        subject = "Welcome to Student Quiz Platform"
        message = (
            f"Hi {instance.username},\n\n"
            "Welcome to Student Quiz Platform! Your account was created successfully."
        )
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [instance.email])
