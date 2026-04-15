from .models import Reserva, CarrouselItem, LegalText
from .serializers import ReservaSerializer, CarrouselItemSerializer, LegalTextSerializer
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from api.gcal_utils import crear_evento_calendar
from api.email_utils import enviar_mail_reserva_confirmada
from django.db import transaction

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Reserva.objects.all()
        return Reserva.objects.filter(paciente=user)

    def perform_create(self, serializer):
        serializer.save(paciente=self.request.user)

    @action(detail=True, methods=["post"])
    def cancelar(self, request, pk=None):
        reserva = self.get_object()
        if reserva.estado == "cancelada":
            return Response({"error": "Reserva ya cancelada."}, status=400)
        reserva.estado = "cancelada"
        reserva.save()
        return Response({"status": "cancelada"})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def confirmar(self, request, pk=None):
        reserva = self.get_object()
        if reserva.estado != "pendiente":
            return Response({"error": "Solo reservas pendientes se confirman."}, status=400)
        with transaction.atomic():
            reserva.estado = "confirmada"
            event_id = crear_evento_calendar(reserva)
            if event_id:
                reserva.event_id = event_id
            reserva.save()
            # enviar mail
            enviar_mail_reserva_confirmada(reserva.paciente.email, reserva)
        return Response({"status": "confirmada", "event_id": reserva.event_id})

class CarrouselItemViewSet(viewsets.ModelViewSet):
    queryset = CarrouselItem.objects.filter(activo=True)
    serializer_class = CarrouselItemSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get"]

class AdminCarrouselItemViewSet(viewsets.ModelViewSet):
    queryset = CarrouselItem.objects.all()
    serializer_class = CarrouselItemSerializer
    permission_classes = [permissions.IsAdminUser]

class LegalTextViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LegalText.objects.filter(visible=True)
    serializer_class = LegalTextSerializer
    permission_classes = [permissions.AllowAny]

class AdminLegalTextViewSet(viewsets.ModelViewSet):
    queryset = LegalText.objects.all()
    serializer_class = LegalTextSerializer
    permission_classes = [permissions.IsAdminUser]
