#!/bin/bash
# Menú principal de tooling Caveman modular
set -euo pipefail
cd "$(dirname "$0")/.."

# Colores
RED='[0;31m'; GREEN='[0;32m'; CYAN='[0;36m'; NC='[0m'; BOLD='[1m'

# Versión tooling Caveman
declare CAVETOOLS_VERSION="v2024.04.16-1"
echo -e "${BOLD}${CYAN}CAVEMAN DEV TOOLS (versión $CAVETOOLS_VERSION)${NC}"
# 1. Banner
./tools/print_banner.sh

# 2. Checks SO y dependencias
./tools/check_cmds.sh
./tools/check_venv.sh
./tools/check_node_modules.sh
./tools/check_python_deps.sh || true

# Detecta si hay dependencias python faltantes
show_pyfix=false
if [ -f tools/missing_python_deps.txt ] && [ -s tools/missing_python_deps.txt ]; then
  show_pyfix=true
fi

# 3. Menú principal
while true; do
  echo -e "\n${BOLD}SOLID Caveman Dev Tools (elige opción):${NC}"
  echo "1. Build/check back y front"
  echo "2. Limpiar basura build/test"
  echo "3. Test y generar reporte"
  echo "4. Correr backend+frontend local"
  echo "5. Levantar demo pública frontend (ngrok)"
  echo "6. Ver reporte coverage frontend (servidor local)"
  echo "7. Actualizar/Crear Swagger/OpenAPI (UI-export)"
  echo "8. Salir"
  if [ "$show_pyfix" = true ]; then
    echo "9. Instalar dependencias Python faltantes"
  fi
  echo "10. Crear usuario admin Django (superusuario)"
  read -rp "> " opt
  case $opt in
    1)
      echo -e "${CYAN}[BACKEND] Check...${NC}"
      BACKEND_CHECK_OUTPUT=$(venv/bin/python manage.py check 2>&1)
      echo -e "$BACKEND_CHECK_OUTPUT"
      # Detecta Pillow faltante y propone instalación
      if echo "$BACKEND_CHECK_OUTPUT" | grep -q 'Cannot use ImageField because Pillow is not installed'; then
        echo -e "${RED}Django detectó que falta Pillow para ImageField.${NC}"
        read -rp "¿Te instalo Pillow en este entorno virtual y actualizo requirements.txt? (S/n): " PILLOW_YN
        if [[ "$PILLOW_YN" =~ ^[Ss]?$ ]]; then
          source venv/bin/activate && pip install Pillow && pip freeze > requirements.txt
          echo -e "${GREEN}Pillow instalado y requirements.txt actualizado.${NC}"
          echo -e "Reintentando backend check..."
          BACKEND_CHECK_OUTPUT=$(venv/bin/python manage.py check 2>&1)
          echo -e "$BACKEND_CHECK_OUTPUT"
          if echo "$BACKEND_CHECK_OUTPUT" | grep -q 'System check identified 1 issue' && echo "$BACKEND_CHECK_OUTPUT" | grep -q 'Cannot use ImageField because Pillow is not installed'; then
            echo -e "${RED}ATENCIÓN: Pillow sigue sin estar disponible. Revisa el entorno virtual manualmente.${NC}"
            break
          fi
        fi
      fi
      # Detecta cualquier error 'No module named' y propone instalación por input del usuario
      if echo "$BACKEND_CHECK_OUTPUT" | grep -qE "No module named '([a-zA-Z0-9_]+)'"; then
        MODNAME=$(echo "$BACKEND_CHECK_OUTPUT" | grep -oE "No module named '([a-zA-Z0-9_]+)'" | grep -oE "'([a-zA-Z0-9_]+)'" | tr -d "'")
        echo -e "${RED}Detectado: falta el módulo Python '$MODNAME' requerido.${NC}"
        read -rp "¿Cómo se llama el paquete pip a instalar para '$MODNAME'? (déjalo vacío para ignorar): " PIPNAME
        if [[ -n "$PIPNAME" ]]; then
          source venv/bin/activate && pip install "$PIPNAME" && pip freeze > requirements.txt
          echo -e "${GREEN}Paquete $PIPNAME instalado y requirements.txt actualizado.${NC}"
          echo -e "Reintentando backend check..."
          BACKEND_CHECK_OUTPUT=$(venv/bin/python manage.py check 2>&1)
          echo -e "$BACKEND_CHECK_OUTPUT"
        fi
      fi
      echo -e "${CYAN}[FRONTEND] Build...${NC}"
      (cd spa-client && pnpm build)
      echo -e "${GREEN}Build todo OK.${NC}"
      ;;
    2)
      echo -e "${CYAN}Limpiando basura...${NC}"
      rm -rf spa-client/dist spa-client/.vite spa-client/coverage .pytest_cache __pycache__ log-test/old || true
      find spa-client -type d -name "node_modules" -prune -exec rm -rf '{}' + 2>/dev/null || true
      find . -type d -name "__pycache__" -exec rm -rf '{}' + 2>/dev/null || true
      echo -e "${GREEN}Listo: limpio.${NC}"
      ;;
    3)
      mkdir -p log-test
      version_tag="$(date +'%Y%m%d-%H%M%S')_$(git rev-parse --abbrev-ref HEAD)_$(git rev-parse --short HEAD)"
      backend_log="log-test/backend_test_$version_tag.md"
      frontend_log="log-test/frontend_test_$version_tag.md"

      echo -e "${CYAN}[BACKEND] Test...${NC}"
      echo "# Backend Test Report\nVersion: $version_tag\n" > "$backend_log"
      venv/bin/python manage.py test 2>&1 | tee -a "$backend_log"

      if [ -d "spa-client" ]; then
        echo -e "${CYAN}[FRONTEND] Test...${NC}"
echo "# Frontend Test Report" > "$frontend_log"
echo "**Version:** $version_tag" >> "$frontend_log"
echo -e "\n---\n\n### Test Command\n\`\`\`shell\npnpm test\n\`\`\`\n\n---\n" >> "$frontend_log"

if [ -f "spa-client/package.json" ] && grep -q 'test' "spa-client/package.json"; then
  set +e
  FRONTEND_OUT=$(cd spa-client && pnpm test 2>&1)
  FRONTEND_STATUS=$?
  set -e
  # Siempre escribe la sección de resultado de test
  if [ -z "$FRONTEND_OUT" ]; then
    FRONTEND_OUT="(Sin salida de los tests - posible error grave o configuración faltante)"
  fi
  echo -e "#### Test Output\n\`\`\`text\n$FRONTEND_OUT\n\`\`\`\n" >> "$frontend_log"
  if [ $FRONTEND_STATUS -ne 0 ] || echo "$FRONTEND_OUT" | grep -q "Error:"; then
    echo -e "❌ **Se detectaron errores en la ejecución de los tests.**\n" >> "$frontend_log"
  else
    echo -e "✅ **Todos los tests pasaron correctamente.**\n" >> "$frontend_log"
  fi
else
  echo "No hay test script definido" >> "$frontend_log"
fi
      fi
      echo -e "${GREEN}Tests completados. Log en log-test/*.md${NC}"
      ;;
    4)
      echo -e "${CYAN}Lanzando backend en nueva terminal...${NC}"
      osascript <<EOF
      tell application "Terminal"
          do script "cd '$(pwd)' && source venv/bin/activate && python manage.py runserver"
      end tell
EOF
      sleep 2
      echo -e "${CYAN}Lanzando frontend (vite) en nueva terminal...${NC}"
      osascript <<EOF
      tell application "Terminal"
          do script "cd '$(pwd)/spa-client' && pnpm dev"
      end tell
EOF
      sleep 3
      echo -e "${GREEN}Ambos servicios corriendo en ventanas de Terminal aparte.${NC}"
      echo -e "\n${BOLD}Backend: http://localhost:8000/\nFrontend: http://localhost:5173/${NC}"
      ;;
    5)
      if ! command -v ngrok >/dev/null 2>&1; then
        echo -e "${RED}Ngrok no detectado. Instala: npm install -g ngrok${NC}"
        continue
      fi
      echo -e "${CYAN}Levantando frontend Vite...${NC}"
      (cd spa-client && nohup pnpm dev > ../log-test/frontend_demo.log 2>&1 &)
      sleep 3
      echo -e "${CYAN}Iniciando ngrok para exponer frontend...${NC}"
      nohup ngrok http 5173 > log-test/ngrok.log 2>&1 &
      sleep 5
      demo_url=$(grep -oE 'https://[a-zA-Z0-9.-]+ngrok.io' log-test/ngrok.log | head -n1)
      if [[ "$demo_url" == "" ]]; then
        echo -e "${RED}No se pudo leer URL demo desde ngrok.log. Mira manualmente o revisa ngrok...${NC}"
      else
        echo -e "${GREEN}Tu demo está en: $demo_url${NC}"
      fi
      ;;
    6)
      echo -e "${CYAN}Verificando/generando coverage de frontend...${NC}"
      if [ ! -d "spa-client/coverage" ] || [ ! -f "spa-client/coverage/index.html" ]; then
        echo -e "${CYAN}Generando reporte de coverage primero...${NC}"
        (cd spa-client && pnpm test)
      fi
      if ! command -v npx > /dev/null 2>&1; then
        echo -e "${RED}No se encontró 'npx'. Instala Node.js >= 16 para usar serve.${NC}"
        break
      fi
      echo -e "${CYAN}Levantando servidor para coverage HTML en http://localhost:3000 ... (Ctrl+C para salir)${NC}"
      npx serve -l 3000 spa-client/coverage
      ;;
    7)
      echo -e "${CYAN}Verificando e instalando Swagger/OpenAPI (drf-spectacular)...${NC}"
      if ! grep -q drf-spectacular requirements.txt; then
        echo -e "${CYAN}Agregando drf-spectacular a requirements.txt...${NC}"
        echo 'drf-spectacular==0.27.2' >> requirements.txt
      fi
      source venv/bin/activate && pip install -r requirements.txt
      echo -e "${CYAN}Exportando schema OpenAPI a openapi_schema.yml...${NC}"
      venv/bin/python manage.py spectacular --color --file openapi_schema.yml || {
        echo -e "${RED}ERROR: No se pudo exportar el schema. Verifica configuración en settings.py y urls.py según la ayuda sugerida arriba.${NC}"
        break
      }
      echo -e "${GREEN}Documento OpenAPI generado: openapi_schema.yml${NC}"
      echo -e "Swagger UI disponible en: http://localhost:8000/api/schema/swagger-ui/"
      if command -v open >/dev/null 2>&1; then
        open http://localhost:8000/api/schema/swagger-ui/
      fi
      ;;
    8)
      echo -e "${CYAN}Matando procesos Django runserver y pnpm dev (de este proyecto)...${NC}"
      pgrep -f "python manage.py runserver" | xargs -r kill 2>/dev/null || true
      pgrep -f "pnpm dev" | xargs -r kill 2>/dev/null || true
      echo -e "${GREEN}Backend y frontend detenidos (si estaban activos).${NC}"
      echo "Bye"
      exit 0;;
    10)
      echo -e "${BOLD}${CYAN}Creando superusuario admin Django...${NC}"
      # Valida si existe
      EXISTE=$(venv/bin/python manage.py shell -c "from django.contrib.auth.models import User; print(User.objects.filter(username='admin').exists())")
      if [ "$EXISTE" = "True" ]; then
        echo -e "${RED}Ya existe el usuario 'admin'. Si quieres regenerarlo bórralo desde el admin o línea de comandos primero.${NC}"
        break
      fi
      # Crea el superusuario sin interacción
      venv/bin/python manage.py createsuperuser --noinput --username='admin' --email='Admin@test.com'
      # Setea la contraseña automáticamente
      venv/bin/python manage.py shell <<EOF
from django.contrib.auth.models import User
u = User.objects.get(username='admin')
u.set_password('djfapi:main.36')
u.is_superuser = True
u.is_staff = True
u.save()
print("Contraseña seteada correctamente para usuario 'admin'")
EOF
      echo -e "${GREEN}Superusuario creado con éxito. Usuario: 'admin' | Pass: djfapi:main.36${NC}"
      ;;
    9)
      if [ "$show_pyfix" = true ]; then
        ./tools/install_missing_python_deps.sh
        # Revalida después de instalar
        ./tools/check_python_deps.sh || true && show_pyfix=false
      else
        echo -e "${RED}No hay dependencias Python pendientes${NC}"
      fi
      ;;
    *) echo -e "${RED}Opción no válida${NC}";;
  esac
 done
