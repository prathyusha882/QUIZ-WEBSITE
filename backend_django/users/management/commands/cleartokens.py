from django.core.management.base import BaseCommand
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

class Command(BaseCommand):
    help = 'Clears all JWT tokens'

    def handle(self, *args, **kwargs):
        BlacklistedToken.objects.all().delete()
        OutstandingToken.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All tokens cleared'))
