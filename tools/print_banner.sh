#!/bin/bash
# Banner y best practices para entorno de dev Django+JS
BOLD='\033[1m'
NC='\033[0m'
CYAN='\033[0;36m'
cat <<EOF
${CYAN}
############################################################
${BOLD}Caveman Dev Tools
- Siempre usa el venv local para Django (python -m venv venv)
- Activa: source venv/bin/activate
- Instala pip sólo en venv activo, después: pip freeze > requirements.txt
- Node deps: solo pnpm dentro de spa-client/
- Si algo falla: borra venv/node_modules y reinstala
############################################################${NC}
EOF
