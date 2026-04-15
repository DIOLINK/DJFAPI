from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from django.conf import settings

def crear_evento_calendar(reserva):
    user = reserva.paciente
    try:
        token = user.google_token
    except Exception:
        return None
    creds = Credentials(
        token.access_token,
        refresh_token=token.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=["openid", "email", "profile", "https://www.googleapis.com/auth/calendar.events"]
    )
    service = build("calendar", "v3", credentials=creds)
    event = {
        "summary": f"Reserva SPA {user.get_full_name() or user.email}",
        "description": reserva.nota or "Reserva confirmada.",
        "start": {"dateTime": reserva.fecha_hora.isoformat(), "timeZone": "America/Argentina/Buenos_Aires"},
        "end": {"dateTime": (reserva.fecha_hora+timedelta(hours=1)).isoformat(), "timeZone": "America/Argentina/Buenos_Aires"},
    }
    res = service.events().insert(calendarId="primary", body=event).execute()
    return res.get("id")
