#!/bin/bash
# Chequea existencia y activación de venv local
RED='\033[0;31m'; NC='\033[0m'
if [ ! -d "venv" ] || [ ! -f "venv/bin/activate" ]; then
  echo -e "${RED}No hay entorno virtual correctamente creado (venv/).${NC}"
  echo "Corre: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
  exit 3
fi
if [ -z "${VIRTUAL_ENV-}" ] || [[ "$VIRTUAL_ENV" != "$PWD/venv"* ]]; then
  echo -e "${RED}Activa el entorno virtual (venv/) antes de continuar.${NC}"
  echo "source venv/bin/activate"
  exit 4
fi
