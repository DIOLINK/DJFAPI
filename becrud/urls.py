"""
URL configuration for becrud project.

Routes:
- admin/
- api/reservas/ (DRF ViewSet reserva)
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ReservaViewSet

router = DefaultRouter()
router.register(r'reservas', ReservaViewSet, basename='reserva')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]