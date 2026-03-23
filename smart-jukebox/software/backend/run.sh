#!/usr/bin/env zsh
# Script de desenvolvimento para criar venv e rodar o backend Flask
# Uso: ./run.sh  (no macOS / Linux)

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${0}")/.." && pwd)"
API_DIR="$ROOT_DIR/api"
VENV_DIR="$ROOT_DIR/.venv"

echo "Root: $ROOT_DIR"

if [ ! -d "$VENV_DIR" ]; then
  echo "Criando virtualenv em $VENV_DIR..."
  python3 -m venv "$VENV_DIR"
fi

echo "Ativando virtualenv..."
source "$VENV_DIR/bin/activate"

echo "Atualizando pip e instalando dependências..."
python -m pip install --upgrade pip
pip install -r "$API_DIR/requirements.txt"

echo "Iniciando servidor Flask (development)..."
cd "$API_DIR"
export FLASK_APP=app.py
export FLASK_ENV=development
python app.py
