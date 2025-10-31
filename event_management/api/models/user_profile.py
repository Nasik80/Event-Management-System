from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self) -> str:
        return self.full_name or self.user.username


