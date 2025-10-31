from django.db import models
from .event import Event
from .user_profile import UserProfile


class RSVP(models.Model):
    GOING = 'Going'
    MAYBE = 'Maybe'
    NOT_GOING = 'Not Going'
    STATUS_CHOICES = [
        (GOING, 'Going'),
        (MAYBE, 'Maybe'),
        (NOT_GOING, 'Not Going'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='rsvps')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self) -> str:
        return f"{self.user} → {self.event} ({self.status})"


