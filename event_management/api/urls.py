from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views.events import EventViewSet
from .views.auth import RegisterView, UserMeView

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
    # Auth
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/user/', UserMeView.as_view(), name='user_me'),
]


