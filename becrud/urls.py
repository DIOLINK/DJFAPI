"""
URL configuration for becrud project.

Routes:
- admin/
- api/ (rest: reservas, google auth)
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ReservaViewSet

router = DefaultRouter()
router.register(r'reservas', ReservaViewSet, basename='reserva')

from django.http import HttpResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

def index(request):
    return HttpResponse("""
        <h1>DJFAPI backend levantado</h1>
        <p>API base: <a href='/api/'>/api/</a></p>
        <p>Admin: <a href='/admin/'>/admin/</a></p>
        <p>Swagger UI: <a href='/api/schema/swagger-ui/'>/api/schema/swagger-ui/</a></p>
        <p>Redoc: <a href='/api/schema/redoc/'>/api/schema/redoc/</a></p>
        <p>OpenAPI schema (yaml/json): <a href='/api/schema/'>/api/schema/</a></p>
    """)

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/', include(router.urls)),
    path('api/', include('api.urls')),
]