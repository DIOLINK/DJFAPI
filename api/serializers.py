from rest_framework import serializers
from .models import Reserva, CarrouselItem, LegalText
from django.contrib.auth.models import User

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]

class ReservaSerializer(serializers.ModelSerializer):
    paciente = PacienteSerializer(read_only=True)
    paciente_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="paciente", write_only=True
    )
    class Meta:
        model = Reserva
        fields = ["id", "paciente", "paciente_id", "fecha_hora", "estado", "nota", "creado", "actualizado"]
        read_only_fields = ["estado", "creado", "actualizado"]

class CarrouselItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarrouselItem
        fields = ["id", "imagen", "texto", "orden", "activo", "creado"]

class LegalTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalText
        fields = ["id", "titulo", "contenido", "visible", "creado"]
