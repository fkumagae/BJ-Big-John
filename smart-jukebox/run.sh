#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

PYTHON_CMD=""

pick_python() {
  local candidate
  for candidate in python3 python py; do
    if command -v "$candidate" >/dev/null 2>&1 && "$candidate" --version >/dev/null 2>&1; then
      PYTHON_CMD="$candidate"
      return 0
    fi
  done

  # Fallback comum no Git Bash/Windows
  for candidate in "/c/Windows/py.exe" "/mnt/c/Windows/py.exe"; do
    if [ -x "$candidate" ] && "$candidate" --version >/dev/null 2>&1; then
      PYTHON_CMD="$candidate"
      return 0
    fi
  done

  return 1
}

if ! pick_python; then
  echo "Erro: Python nao encontrado no PATH."
  echo "Dica (Windows): rode ./run.ps1 no PowerShell."
  exit 1
fi

VENV_DIR=".venv"
if [ ! -d "$VENV_DIR" ]; then
  echo "[1/4] Criando ambiente virtual em $VENV_DIR"
  "$PYTHON_CMD" -m venv "$VENV_DIR"
else
  echo "[1/4] Ambiente virtual ja existe em $VENV_DIR"
fi

if [ -f "$VENV_DIR/bin/activate" ]; then
  # Linux/macOS
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
elif [ -f "$VENV_DIR/Scripts/activate" ]; then
  # Windows (Git Bash)
  # shellcheck disable=SC1091
  source "$VENV_DIR/Scripts/activate"
else
  echo "Erro: script de ativacao do venv nao encontrado."
  exit 1
fi

echo "[2/4] Atualizando pip"
python -m pip install --upgrade pip

install_if_not_empty() {
  local req_file="$1"
  if [ -f "$req_file" ] && grep -Eq '^[[:space:]]*[^#[:space:]]' "$req_file"; then
    echo "Instalando dependencias de $req_file"
    python -m pip install -r "$req_file"
    return 0
  fi
  return 1
}

echo "[3/4] Instalando dependencias"
installed_any=false
if install_if_not_empty "software/backend/api/requirements.txt"; then
  installed_any=true
fi
if install_if_not_empty "software/scripts/requirements.txt"; then
  installed_any=true
fi

if [ "$installed_any" = false ]; then
  echo "Nenhum requirements preenchido. Instalando dependencias padrao."
  python -m pip install flask flask-cors mutagen
fi

ensure_mpg123() {
  if command -v mpg123 >/dev/null 2>&1; then
    return 0
  fi

  if command -v apt-get >/dev/null 2>&1; then
    echo "mpg123 nao encontrado. Instalando via apt-get..."
    sudo apt-get update
    sudo apt-get install -y mpg123
    return 0
  fi

  echo "Erro: mpg123 nao encontrado no PATH."
  echo "Instale mpg123 e tente novamente."
  return 1
}

echo "[4/5] Verificando mpg123"
ensure_mpg123

echo "[5/6] Iniciando API"
python software/backend/api/app.py &
API_PID=$!

echo "[6/6] Iniciando Frontend (http.server)"
python -m http.server 8000 &
FRONT_PID=$!

echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:8000/software/frontend/interface_jukebox/"
echo "Para encerrar: Ctrl+C"

trap 'kill $API_PID $FRONT_PID' INT TERM
wait $API_PID $FRONT_PID