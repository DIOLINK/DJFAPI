from django.db import models
from django.contrib.auth.models import User

class Reserva(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    ]
    paciente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservas')
    fecha_hora = models.DateTimeField()
    estado = models.CharField(max_length=12, choices=ESTADO_CHOICES, default='pendiente')
    nota = models.TextField(blank=True)
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)
    event_id = models.CharField(max_length=128, blank=True, null=True) # Google Calendar
    def __str__(self):
        return f"Reserva {self.paciente.username} {self.fecha_hora} {self.estado}"

class CarrouselItem(models.Model):
    imagen = models.ImageField(upload_to='carrousel/')
    texto = models.CharField(max_length=255)
    orden = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['orden']
    def __str__(self):
        return f"Item {self.orden} - {self.texto[:24]}"

class LegalText(models.Model):
    titulo = models.CharField(max_length=100)
    contenido = models.TextField()
    visible = models.BooleanField(default=True)
    creado = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.titulo

class GoogleToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='google_token')
    access_token = models.TextField()
    refresh_token = models.TextField(blank=True, null=True)
    expires_in = models.IntegerField(default=0)
    scope = models.CharField(max_length=256, blank=True)
    token_type = models.CharField(max_length=32, blank=True)
    id_token = models.TextField(blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Token {self.user.email}"
