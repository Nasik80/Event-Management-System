from django.db import models
from .user_profile import UserProfile


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    organizer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='organized_events')
    location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_time']

    def __str__(self) -> str:
        return self.title


