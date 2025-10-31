from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from ..models import Event, RSVP, Review
from ..serializers.event import EventSerializer
from ..serializers.rsvp import RSVPSerializer
from ..serializers.review import ReviewSerializer
from ..permissions.event_permissions import IsOrganizerOrReadOnly, CanViewEvent


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.select_related('organizer__user').all()

    def get_permissions(self):
        if self.action in ['list', 'reviews_list']:
            return [AllowAny()]
        if self.action in ['retrieve']:
            return [CanViewEvent()]
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'rsvp', 'rsvp_update', 'reviews']:
            # edit/destroy: organizer only (checked in object permission), create requires auth
            base = [IsAuthenticated()]
            if self.action in ['update', 'partial_update', 'destroy']:
                base.append(IsOrganizerOrReadOnly())
            return base
        return super().get_permissions()

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list':
            qs = qs.filter(is_public=True)
        # Filters
        title = self.request.query_params.get('title')
        location = self.request.query_params.get('location')
        organizer = self.request.query_params.get('organizer')
        if title:
            qs = qs.filter(title__icontains=title)
        if location:
            qs = qs.filter(location__icontains=location)
        if organizer:
            qs = qs.filter(organizer__full_name__icontains=organizer)
        return qs

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], url_path='rsvp')
    def rsvp(self, request, pk=None):
        event = self.get_object()
        serializer = RSVPSerializer(data=request.data, context={'request': request, 'event': event})
        serializer.is_valid(raise_exception=True)
        rsvp = serializer.save()
        return Response(RSVPSerializer(rsvp).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path=r'rsvp/(?P<user_id>[^/.]+)')
    def rsvp_update(self, request, pk=None, user_id=None):
        event = self.get_object()
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        # Only the user themselves or organizer can update
        user_profile = request.user.profile
        if int(user_id) != user_profile.id and event.organizer_id != user_profile.id:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        try:
            rsvp = RSVP.objects.get(event=event, user_id=user_id)
        except RSVP.DoesNotExist:
            return Response({'detail': 'RSVP not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RSVPSerializer(instance=rsvp, data=request.data, partial=True, context={'request': request, 'event': event})
        serializer.is_valid(raise_exception=True)
        rsvp = serializer.save()
        return Response(RSVPSerializer(rsvp).data)

    @action(detail=True, methods=['post'], url_path='reviews')
    def reviews(self, request, pk=None):
        event = self.get_object()
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ReviewSerializer(data=request.data, context={'request': request, 'event': event})
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

    @reviews.mapping.get
    def reviews_list(self, request, pk=None):
        event = self.get_object()
        queryset = event.reviews.select_related('user__user').all()
        page = self.paginate_queryset(queryset)
        serializer = ReviewSerializer(page or queryset, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)


