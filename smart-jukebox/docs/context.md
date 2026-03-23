# Contexto do módulo smart-jukebox

Data de geração: 2026-03-22

Este arquivo resume o estado atual do módulo `smart-jukebox` no repositório e serve como referência rápida para desenvolvedores.

## Visão geral

Smart Jukebox é um projeto para construir uma caixa de som inteligente estilo jukebox. O repositório está organizado em camadas: hardware, firmware, software, audio e design. O desenvolvimento é incremental com checkpoints bem definidos.

## O que foi lido e registrado

- `audio/catalog/catalog.json` — catálogo gerado com 4 entradas (Big Bad John, Never Gonna Give You Up, Água, Como Tudo Deve Ser).
- `software/backend/api/app.py` — API Flask com endpoints: `/songs`, `/status`, `/play/<index>`, `/pause`, `/resume`, `/next`, `/prev`, `/rescan`. O endpoint `/rescan` executa o script `software/scripts/build_catalog.py`.
- `software/backend/api/player.py` — `AudioPlayer` implementado com `pygame.mixer`. Métodos: `play`, `pause`, `resume`, `next`, `prev`, `get_songs`, `get_status`. Lê arquivos de `audio/music` com extensões `.mp3`, `.mp3.mpeg`, `.mpeg`.
- `software/scripts/build_catalog.py` — varre `audio/music`, tenta ler tags com `mutagen` se disponível, faz parsing do filename como fallback e gera `audio/catalog/catalog.json`.
- `software/frontend/interface_jukebox/` — SPA (HTML/JS/CSS) que consome `audio/catalog/catalog.json` e a API em `http://localhost:5000`. Implementa navegação por `genre / artist / song`, fila local e envios de comandos (`/play`, `/pause`, `/resume`, `/next`, `/prev`).

## Arquivos notáveis que faltam / observações

- `software/backend/api/config.py` está presente mas vazio.
- `software/backend/api/requirements.txt` estava vazio — é recomendável preencher com dependências do backend.
- `pygame` é usado no player; atenção: no macOS pode requerer dependências de sistema (SDL) ou pode ser preferível `python-vlc` para compatibilidade de codecs.
- O frontend busca o catálogo por caminho relativo (`/audio/catalog/catalog.json`); certifique-se de servir esse arquivo em ambiente de produção ou ao executar o frontend em outro host.
- O estado do player é mantido somente em memória — reiniciar o backend zera o estado.

## Como rodar localmente (rápido)

1. Criar um virtualenv e instalar dependências do backend (exemplo):

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r smart-jukebox/software/backend/api/requirements.txt
   ```

2. Iniciar a API Flask (diretório `smart-jukebox/software/backend/api`):

   ```bash
   cd smart-jukebox/software/backend/api
   python app.py
   ```

3. Abrir `smart-jukebox/software/frontend/interface_jukebox/index.html` no navegador (ou servir via um servidor estático). A UI tenta se comunicar com `http://localhost:5000`.

4. Comandos de teste via terminal:

   ```bash
   curl http://localhost:5000/songs
   curl -X POST http://localhost:5000/play/0
   curl -X POST http://localhost:5000/pause
   curl -X POST http://localhost:5000/resume
   ```

Observação: se houver erros do tipo "No module named certifi" ou problemas com `pygame` no macOS, use um venv limpo e instale as dependências do sistema (ex.: `brew install sdl2 sdl2_mixer`) ou considere `python-vlc`.

## Recomendações rápidas

- Preencher `software/backend/api/requirements.txt` com dependências: Flask, Flask-Cors, pygame (ou python-vlc), mutagen.
- Adicionar um script `run.sh` para facilitar criação de venv e execução local.
- Considerar um `system_controller` (MQTT ↔ HTTP) para desacoplar firmware (ESP32) do backend.
- Incluir testes mínimos para `build_catalog.py` e endpoints da API.

## Próximos passos sugeridos

1. Persistir este resumo (feito).
2. Atualizar `requirements.txt` do backend e adicionar `run.sh` — posso aplicar isso se autorizar.
3. Adicionar um `system_controller/` com um bridge MQTT→HTTP para integração com o firmware ESP32.

---

Autor do resumo: automação (leitura dos arquivos do workspace)
