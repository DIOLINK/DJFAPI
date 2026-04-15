from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .googleauth import GoogleLogin, GoogleCallback
from .views import CarrouselItemViewSet, AdminCarrouselItemViewSet, LegalTextViewSet, AdminLegalTextViewSet

router = DefaultRouter()
router.register(r'carrousel', CarrouselItemViewSet, basename='carrousel')
router.register(r'admin/carrousel', AdminCarrouselItemViewSet, basename='admin-carrousel')
router.register(r'legaltext', LegalTextViewSet, basename='legaltext')
router.register(r'admin/legaltext', AdminLegalTextViewSet, basename='admin-legaltext')

urlpatterns = [
    path('auth/google/login/', GoogleLogin.as_view(), name='google-login'),
    path('auth/google/callback/', GoogleCallback.as_view(), name='google-callback'),
    path('', include(router.urls)),
]