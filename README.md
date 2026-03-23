git sta# 🎵 Smart Big John - BJ

Projeto de desenvolvimento de uma **caixa de som inteligente estilo Jukebox**, capaz de reproduzir músicas sob demanda, gerenciar playlists e oferecer uma interface interativa para seleção de faixas.

O objetivo do projeto é desenvolver um sistema completo envolvendo **hardware, firmware, software e design**, com foco em modularidade, prototipagem rápida e evolução incremental.

---

# 👥 Equipe

- Felipe Pellegrini Kumagae  
- João Paulo Souza da Silva

---

# 📌 Visão do Projeto

A **Smart Jukebox** busca recriar o conceito clássico de jukebox utilizando tecnologias modernas.

O sistema permitirá:

- seleção de músicas via interface
- gerenciamento de playlists
- reprodução de áudio
- experiência interativa
- possibilidade de integração com rede local ou internet

O projeto será desenvolvido de forma **incremental**, com checkpoints claros de evolução.

---

# 🧠 Arquitetura Geral

O sistema será dividido em quatro camadas principais:

## Hardware

Responsável pela reprodução de áudio e interação física.

Possíveis componentes:

- ESP32 ou microcontrolador
- amplificador de áudio
- alto-falantes
- botões ou encoder
- display ou touchscreen
- fonte de alimentação

---

## Firmware

Responsável pelo controle do hardware.

Funções principais:

- controle de reprodução de áudio
- leitura de botões e sensores
- comunicação com sistema de software
- gerenciamento de estados do sistema

---

## Software

Responsável pela interface e gerenciamento de conteúdo.

Possíveis componentes:

- interface gráfica da jukebox
- sistema de playlists
- banco de dados de músicas
- painel de administração

---

## Design

Responsável pela experiência visual e física.

Inclui:

- design da caixa
- layout da interface
- identidade visual

---

# 📁 Estrutura do Repositório
```text
smart-jukebox
│
├── docs
│ ├── visao-geral.md
│ ├── arquitetura.md
│ ├── roadmap.md
│ └── reunioes
│
├── hardware
│ ├── esquematicos
│ ├── pcb
│ ├── simulacoes
│ └── lista_componentes
│ └── BOM.md
│
├── firmware
│ ├── esp32
│ │ ├── jukebox_controller
│ │ └── audio_control
│ └── testes
│
├── software
│ ├── backend
│ │ ├── api
│ │ └── database
│ ├── frontend
│ │ ├── interface_jukebox
│ │ └── painel_admin
│ └── scripts
│
├── audio
│ ├── samples
│ ├── efeitos
│ └── playlists
│
├── design
│ ├── interface
│ ├── mockups
│ └── caixa_fisica
│
├── testes
│ ├── hardware
│ ├── software
│ └── integracao
│
├── logs
│ └── desenvolvimento
│
├── README.md
├── LICENSE
└── .gitignore
``` 
### docs
Documentação técnica e planejamento.

### hardware
Esquemáticos, PCB e lista de componentes.

### firmware
Código embarcado.

### software
Backend, frontend e scripts.

### audio
Samples, efeitos e playlists.

### design
Mockups e design físico.

### testes
Testes de hardware, software e integração.

### logs
Registro do desenvolvimento.

---

# 🗺️ Roadmap do Projeto

O projeto será dividido em **checkpoints entregáveis**.

Cada checkpoint deve resultar em **um sistema funcional demonstrável**.

---

# ✅ Checkpoint 1 — Estrutura do Projeto

**Objetivo**

Organizar o projeto.

**Entregáveis**

- estrutura do repositório criada
- README documentado
- roadmap definido
- definição inicial da arquitetura

**Critério de conclusão**

Repositório organizado e documentado.

---

# ✅ Checkpoint 2 — Protótipo de Áudio

**Objetivo**

Garantir que o sistema consegue reproduzir áudio.

**Entregáveis**

- amplificador conectado
- alto-falantes funcionando
- reprodução de áudio via sistema

**Critério de conclusão**

Reprodução de um arquivo de áudio.

---

# ✅ Checkpoint 3 — Controle de Reprodução

**Objetivo**

Controlar música via interface física.

**Funções**

- Play
- Pause
- Próxima música
- Música anterior

**Entregáveis**

- botões ou encoder funcionando
- lógica de controle implementada

**Critério de conclusão**

Usuário consegue controlar a música manualmente.

---

# ✅ Checkpoint 4 — Interface da Jukebox

**Objetivo**

Criar interface de seleção de músicas.

**Entregáveis**

- tela ou interface gráfica
- exibição de músicas disponíveis
- seleção de faixas

**Critério de conclusão**

Usuário consegue escolher a música.

---

# ✅ Checkpoint 5 — Sistema de Playlist

**Objetivo**

Implementar gerenciamento de playlists.

**Entregáveis**

- fila de reprodução
- múltiplas músicas selecionadas
- execução sequencial

**Critério de conclusão**

Usuário consegue montar uma playlist.

---

# ✅ Checkpoint 6 — Integração Completa

**Objetivo**

Integrar todos os módulos.

**Entregáveis**

- interface conectada ao sistema de áudio
- controle completo da jukebox
- reprodução contínua

**Critério de conclusão**

Sistema funcional integrado.

---

# ✅ Checkpoint 7 — Design da Caixa

**Objetivo**

Desenvolver o design físico.

**Entregáveis**

- modelo da caixa
- posicionamento dos componentes
- estrutura física montada

**Critério de conclusão**

Protótipo físico montado.

---

# ✅ Checkpoint 8 — Versão 1.0

**Objetivo**

Primeira versão completa do sistema.

**Entregáveis**

- jukebox funcional
- interface final
- áudio estável
- design físico finalizado

**Critério de conclusão**

Sistema utilizável.

---

# ⚙️ Organização do Trabalho

Sugestão inicial de divisão:

### Felipe

- arquitetura do sistema
- firmware
- integração hardware/software
- organização do repositório

### Xota

- interface da jukebox
- design visual
- experiência do usuário
- design físico da caixa

---

# 🔢 Versionamento
```text
v0.1 protótipo de áudio
v0.2 controle de reprodução
v0.3 interface básica
v0.4 sistema de playlists
v1.0 jukebox funcional
```

---

# 🚀 Possíveis Expansões Futuras

- integração com Spotify
- controle via celular
- ranking de músicas
- sistema de votação
- iluminação LED reativa ao áudio

---

# 📜 Licença

A definir.

---

# 📬 Contato

Projeto experimental de desenvolvimento tecnológico.

Autores:

Bruninha 
Jota
