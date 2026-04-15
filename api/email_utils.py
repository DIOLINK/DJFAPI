from django.core.mail import send_mail
from django.conf import settings

def enviar_mail_reserva_confirmada(dest_email, reserva):
    asunto = "Reserva confirmada en SPA"
    mensaje = f"Hola, tu reserva para el día {reserva.fecha_hora} fue confirmada.\n\nDetalles: {reserva.nota}"
    send_mail(
        asunto, mensaje, settings.DEFAULT_FROM_EMAIL, [dest_email, settings.DEFAULT_FROM_EMAIL], fail_silently=True
    )
