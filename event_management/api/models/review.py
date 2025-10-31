from django.db import models
from .event import Event
from .user_profile import UserProfile


class Review(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.user} on {self.event}: {self.rating}"


