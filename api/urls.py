from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib import admin
from .googleauth import GoogleLogin, GoogleCallback
from .views import CarrouselItemViewSet, AdminCarrouselItemViewSet, LegalTextViewSet, AdminLegalTextViewSet, GalleryView

schema_view = get_schema_view(
   openapi.Info(
      title="SPA API",
      default_version='v1',
      description="API reserva spa, carrousel, legaltext, Google integ.",
   ),
   public=True,
)

router = DefaultRouter()
router.register(r'carrousel', CarrouselItemViewSet, basename='carrousel')
router.register(r'admin/carrousel', AdminCarrouselItemViewSet, basename='admin-carrousel')
router.register(r'legaltext', LegalTextViewSet, basename='legaltext')
router.register(r'admin/legaltext', AdminLegalTextViewSet, basename='admin-legaltext')

from .googleauth import GoogleLogin, GoogleCallback, GoogleAuthVerify

urlpatterns = [
    path('auth/google/login/', GoogleLogin.as_view(), name='google-login'),
    path('auth/google/callback/', GoogleCallback.as_view(), name='google-callback'),
    path('auth/google/', GoogleAuthVerify.as_view(), name='google-verify'),
    path('gallery/', GalleryView.as_view(), name='gallery'),
    path('', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
