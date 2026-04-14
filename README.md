# Proyecto DJFAPI

Fullstack: Django (backend) + React (spa-client)

## Inicializar Backend (Django)

1. Activa virtualenv (opcional, recomendado):
   ```sh
   source venv/bin/activate
   ```
2. Instala dependencias:
   ```sh
   pip install -r requirements.txt
   ```
3. Ejecuta migraciones:
   ```sh
   python manage.py migrate
   ```
4. Arranca servidor:
   ```sh
   python manage.py runserver
   ```
Backend disponible en: http://127.0.0.1:8000/

## Inicializar Frontend (spa-client)

1. Instala dependencias:
   ```sh
   cd spa-client
   pnpm install
   ```
2. Arranca modo desarrollo:
   ```sh
   pnpm dev
   ```
SPA accesible en: http://127.0.0.1:5173/

## Notas
- Backend usa SQLite, viene preconfigurado.
- Spa usa React 19 + Vite. Hot reload activo por defecto.
- Cambia configuración en archivos `becrud/settings.py` (backend) o `spa-client/vite.config.ts` (frontend) según necesidad.
