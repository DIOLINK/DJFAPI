from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import requests
from django.contrib.auth import login
from django.contrib.auth.models import User
from api.models import Reserva
import os
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI')
GOOGLE_SCOPE = 'openid email profile https://www.googleapis.com/auth/calendar.events'

# AUTH URLS
GOOGLE_AUTH_URL = (
    "https://accounts.google.com/o/oauth2/v2/auth"
    f"?response_type=code&client_id={GOOGLE_CLIENT_ID}"
    f"&redirect_uri={GOOGLE_REDIRECT_URI}"
    f"&scope={GOOGLE_SCOPE}"
    f"&access_type=offline&prompt=consent"
)

class GoogleLogin(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return redirect(GOOGLE_AUTH_URL)

class GoogleCallback(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        code = request.GET.get('code')
        # Intercambia code por tokens
        token_req = requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'redirect_uri': GOOGLE_REDIRECT_URI,
                'grant_type': 'authorization_code',
            },
        )
        tokens = token_req.json()
        id_token = tokens.get('id_token')
        access_token = tokens.get('access_token')
        refresh_token = tokens.get('refresh_token')
        userinfo = requests.get(
            'https://openidconnect.googleapis.com/v1/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        ).json()
        email = userinfo.get('email')
        if not email:
            return Response({'error': 'Google OAuth2 failed'}, status=400)
        user, _ = User.objects.get_or_create(username=email, defaults={'email': email})
        login(request, user)
        # Guardar token en session/demo; en prod usar modelo
        request.session['google_access_token'] = access_token
        request.session['google_refresh_token'] = refresh_token
        return redirect('/')

class GoogleAuthVerify(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        id_token = request.data.get('token')
        try:
            idinfo = google_id_token.verify_oauth2_token(
                id_token, google_requests.Request(), GOOGLE_CLIENT_ID
            )
            email = idinfo['email']
            user, _ = User.objects.get_or_create(username=email, defaults={'email': email, 'first_name': idinfo.get('given_name', ''), 'last_name': idinfo.get('family_name', '')})
            refresh = RefreshToken.for_user(user)
            data = {
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token),
            }
            return Response(data)
        except Exception as e:
            return Response({'error': 'Invalid Google token', 'detail': str(e)}, status=400)
