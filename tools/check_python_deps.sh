#!/bin/bash
# Validación robusta de paquetes Python instalados (por import real)
RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
pycheck_failed=false
MISSING_PY=""
PY_DEPS=(
  "django:Django"
  "rest_framework:djangorestframework"
  "drf_yasg:drf-yasg"
  "rest_framework_simplejwt:djangorestframework-simplejwt"
  "googleapiclient:google-api-python-client"
  "google_auth_httplib2:google-auth-httplib2"
  "google_auth_oauthlib:google-auth-oauthlib"
  "PIL:Pillow"
)
echo -e "\n${CYAN}Validando imports Python en venv...${NC}"
> tools/missing_python_deps.txt
for line in "${PY_DEPS[@]}"; do
  imp="${line%%:*}"
  pkg="${line##*:}"
  venv/bin/python -c "import $imp" 2>/dev/null || {
    echo -e "${RED}FALTA: pip install $pkg   (import $imp)${NC}"
    echo "$pkg" >> tools/missing_python_deps.txt
    pycheck_failed=true
  }
done
if [ "$pycheck_failed" = true ]; then
  echo -e "${RED}\nExisten dependencias Python FALTANTES: puedes instalarlas con la opción del menú principal.${NC}"
  exit 6
else
  echo -e "${GREEN}✓ Todos los imports Python OK en tu venv.${NC}"
  rm -f tools/missing_python_deps.txt 2>/dev/null || true
fi

