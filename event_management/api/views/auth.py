from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..serializers.user_profile import RegisterSerializer, UserProfileSerializer, UserSerializer


class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(UserProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        data = {
            'id': profile.id,
            'username': request.user.username,
            'full_name': profile.full_name,
            'email': request.user.email,
        }
        return Response(data)


