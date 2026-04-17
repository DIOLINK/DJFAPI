#!/bin/bash
# Instala las dependencias Python marcadas como faltantes por check_python_deps.sh
depsfile="tools/missing_python_deps.txt"
RED='\033[0;31m'; GREEN='\033[0;32m'; NC='\033[0m'
if [ ! -f "$depsfile" ] || [ ! -s "$depsfile" ]; then
  echo -e "${GREEN}No hay dependencias Python pendientes a instalar.${NC}"
  exit 0
fi

while read -r pkg; do
  echo -e "Instalando: $pkg ..."
  source venv/bin/activate && pip install "$pkg"
done < "$depsfile"

# Actualiza requirements.txt y borra la lista de faltantes
source venv/bin/activate && pip freeze > requirements.txt
rm -f "$depsfile"
echo -e "${GREEN}Todas las dependencias pendientes fueron instaladas y requirements.txt actualizado.${NC}"
