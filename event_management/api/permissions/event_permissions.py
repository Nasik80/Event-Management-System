from rest_framework.permissions import BasePermission, SAFE_METHODS
from ..models import Event, RSVP


class IsOrganizerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj: Event):
        if request.method in SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'profile') and obj.organizer_id == request.user.profile.id


class CanViewEvent(BasePermission):
    def has_object_permission(self, request, view, obj: Event):
        if obj.is_public:
            return True
        if not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'profile') and obj.organizer_id == request.user.profile.id:
            return True
        # invited users = users with RSVP entries for the event
        if hasattr(request.user, 'profile'):
            return RSVP.objects.filter(event=obj, user=request.user.profile).exists()
        return False


