from .models import Reserva, CarrouselItem, LegalText
from .serializers import ReservaSerializer, CarrouselItemSerializer, LegalTextSerializer
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action

class ReservaViewSet(viewsets.ModelViewSet):
    ... # NO CAMBIO

class CarrouselItemViewSet(viewsets.ModelViewSet):
    ... # NO CAMBIO

class AdminCarrouselItemViewSet(viewsets.ModelViewSet):
    ... # NO CAMBIO

class LegalTextViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LegalText.objects.filter(visible=True)
    serializer_class = LegalTextSerializer
    permission_classes = [permissions.AllowAny]

class AdminLegalTextViewSet(viewsets.ModelViewSet):
    queryset = LegalText.objects.all()
    serializer_class = LegalTextSerializer
    permission_classes = [permissions.IsAdminUser]
