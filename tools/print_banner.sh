#!/bin/bash
# Banner y best practices para entorno de dev Django+JS
BOLD='\033[1m'
NC='\033[0m'
CYAN='\033[0;36m'
echo -e "${CYAN}"
echo "############################################################"
echo -e "${BOLD}Caveman Dev Tools"
echo "- Siempre usa el venv local para Django (python -m venv venv)"
echo "- Activa: source venv/bin/activate"
echo "- Instala pip sólo en venv activo, después: pip freeze > requirements.txt"
echo "- Node deps: solo pnpm dentro de spa-client/"
echo "- Si algo falla: borra venv/node_modules y reinstala"
echo "############################################################${NC}"
