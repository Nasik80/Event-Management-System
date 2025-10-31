from rest_framework import serializers
from ..models import RSVP, Event


class RSVPSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    event_id = serializers.IntegerField(source='event.id', read_only=True)

    class Meta:
        model = RSVP
        fields = ['id', 'event_id', 'user_id', 'status']

    def validate(self, attrs):
        request = self.context['request']
        event = self.context['event']
        user_profile = request.user.profile
        # Ensure unique per event
        existing = RSVP.objects.filter(event=event, user=user_profile).exclude(pk=getattr(self.instance, 'pk', None))
        if existing.exists():
            raise serializers.ValidationError('You have already RSVPed to this event')
        return attrs

    def create(self, validated_data):
        event = self.context['event']
        user_profile = self.context['request'].user.profile
        return RSVP.objects.create(event=event, user=user_profile, **validated_data)


