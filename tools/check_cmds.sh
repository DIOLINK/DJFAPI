#!/bin/bash
# Revisa comandos base requeridos para el tooling
RED='\033[0;31m'; NC='\033[0m'
all_ok=true
for dep in python3 pnpm git; do
  if ! command -v $dep >/dev/null 2>&1; then
    echo -e "${RED}Falta comando: $dep${NC}"
    all_ok=false
  fi
done
if [ "$all_ok" = false ]; then
  echo -e "${RED}Instala los comandos básicos antes de continuar.${NC}"
  exit 2
fi
