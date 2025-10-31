from rest_framework import serializers
from ..models import Review
from .user_profile import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(source='user.user', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']

    def validate_rating(self, value: int):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5')
        return value

    def create(self, validated_data):
        event = self.context['event']
        user_profile = self.context['request'].user.profile
        return Review.objects.create(event=event, user=user_profile, **validated_data)


