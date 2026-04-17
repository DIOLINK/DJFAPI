#!/bin/bash
# Menú principal de tooling Caveman modular
set -euo pipefail
cd "$(dirname "$0")/.."

# Colores
RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'; BOLD='\033[1m'

# 1. Banner
./tools/print_banner.sh

# 2. Checks SO y dependencias
./tools/check_cmds.sh
./tools/check_venv.sh
./tools/check_node_modules.sh
./tools/check_python_deps.sh

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
  echo "6. Salir"
  if [ "$show_pyfix" = true ]; then
    echo "7. Instalar dependencias Python faltantes"
  fi
  read -rp "> " opt
  case $opt in
    1)
      echo -e "${CYAN}[BACKEND] Check...${NC}"
      venv/bin/python manage.py check
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
        echo "# Frontend Test Report\nVersion: $version_tag\n" > "$frontend_log"
        if [ -f "spa-client/package.json" ] && grep -q 'test' "spa-client/package.json"; then
          (cd spa-client && pnpm test -- --coverage 2>&1 | tee -a "../$frontend_log") || true
        else
          echo "No hay test script definido" >> "$frontend_log"
        fi
      fi
      echo -e "${GREEN}Tests completados. Log en log-test/*.md${NC}"
      ;;
    4)
      echo -e "${CYAN}Iniciando backend...${NC}"
      nohup venv/bin/python manage.py runserver > log-test/backend_dev.log 2>&1 &
      sleep 2
      echo -e "${CYAN}Iniciando frontend (vite)...${NC}"
      (cd spa-client && nohup pnpm dev > ../log-test/frontend_dev.log 2>&1 &)
      sleep 3
      echo -e "${GREEN}Ambos servicios corriendo (logs en log-test).${NC}"
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
      echo "Bye"; exit 0;;
    7)
      if [ "$show_pyfix" = true ]; then
        ./tools/install_missing_python_deps.sh
        # Revalida después de instalar
        ./tools/check_python_deps.sh && show_pyfix=false
      else
        echo -e "${RED}No hay dependencias Python pendientes${NC}"
      fi
      ;;
    *) echo -e "${RED}Opción no válida${NC}";;
  esac
done
