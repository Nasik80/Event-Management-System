from rest_framework import serializers
from ..models import Event


class OrganizerNestedSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(read_only=True)


class EventSerializer(serializers.ModelSerializer):
    organizer = OrganizerNestedSerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'organizer', 'location',
            'start_time', 'end_time', 'is_public', 'created_at', 'updated_at'
        ]
        read_only_fields = ['organizer', 'created_at', 'updated_at']

    def validate(self, attrs):
        start = attrs.get('start_time') or getattr(self.instance, 'start_time', None)
        end = attrs.get('end_time') or getattr(self.instance, 'end_time', None)
        if start and end and end <= start:
            raise serializers.ValidationError('end_time must be after start_time')
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        organizer = user.profile
        validated_data['organizer'] = organizer
        return super().create(validated_data)


