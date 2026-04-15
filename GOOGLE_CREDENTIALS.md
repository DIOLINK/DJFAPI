# Google OAuth/Calendar - Info referencia

1. **Credenciales OAuth2/Calendar**
   - https://console.cloud.google.com/apis/credentials
     - Crear "ID de cliente de OAuth" (tipo Web Application)
     - Añade redirect URI: http://localhost:8000/api/auth/google/callback/
   - Habilita API "Google Calendar" en https://console.cloud.google.com/apis/library/calendar-json.googleapis.com

2. **Docs Google OAuth**
   - https://developers.google.com/identity/protocols/oauth2/web-server
   - https://developers.google.com/identity/openid-connect/openid-connect

3. **API Python (backend)**
   - Autenticación: https://google-auth.readthedocs.io/en/latest/
   - Calendar: https://developers.google.com/calendar/api/guides/create-events

4. **Scopes mínimos**
   - openid email profile https://www.googleapis.com/auth/calendar.events

5. **Test credentials**
   - Usar .env con GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_PROJECT_ID

6. **Notas**
   - Backend puede refresh token
   - SPA puede usar el mismo CLIENT_ID para integración directa (VITE_GOOGLE_CLIENT_ID)
   - Para despliegue, agrega URI productivo en consola Google

