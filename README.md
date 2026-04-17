# Proyecto DJFAPI

Fullstack: Django (backend) + React (spa-client)

## Tooling automatizado SOLID (recomendado 🌟)

La forma más rápida y robusta de levantar/validar todo:

```sh
source venv/bin/activate
./tools/dev_menu.sh
```

- Valida comandos base, venv, node_modules y dependencias Python por import real
- Todos los logs/reportes van a /log-test/
- El menú te guía para build, test, limpiar, correr server y exponer demo

---

## Inicializar Backend (Django) manual

1. Activa virtualenv (recomendado):
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

## Inicializar Frontend (spa-client) manual

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

---

## Tooling y estructura

- Todos los scripts de validación y automatización están en `/tools/`.
    - Cada chequeo (comandos base, venv, node_modules, deps Python) es un módulo pequeño.
    - El menú principal (`dev_menu.sh`) coordina todo.
- Logs y reportes de test: `/log-test/`.

### Buenas prácticas (highlights auto-banner):
- Siempre activa y usa TU venv local (nunca Python global)
- Instala todo con pip solo dentro del venv — si cambias, ejecuta `pip freeze > requirements.txt`
- Para bugs, borra venv/node_modules y reinstala limpio

Ver menú automatizado para autochequeo y flujos build/test demo.

## Notas
- Backend usa SQLite, viene preconfigurado.
- Spa usa React 19 + Vite. Hot reload activo por defecto.
- Cambia configuración en archivos `becrud/settings.py` (backend) o `spa-client/vite.config.ts` (frontend) según necesidad.
