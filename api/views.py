from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Reserva
from .serializers import ReservaSerializer

class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin ve todo, pacientes solo propias
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
        reserva.estado = "confirmada"
        reserva.save()
        return Response({"status": "confirmada"})
