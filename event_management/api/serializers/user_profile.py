from django.contrib.auth.models import User
from rest_framework import serializers
from ..models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'full_name', 'bio', 'location', 'profile_picture']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(allow_blank=True, required=False)
    full_name = serializers.CharField(max_length=255)

    def validate_username(self, value: str):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value

    def create(self, validated_data):
        username = validated_data['username']
        password = validated_data['password']
        email = validated_data.get('email', '')
        full_name = validated_data['full_name']
        user = User.objects.create_user(username=username, password=password, email=email)
        profile = UserProfile.objects.create(user=user, full_name=full_name)
        return profile


