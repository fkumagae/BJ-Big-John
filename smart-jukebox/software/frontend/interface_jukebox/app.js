const genreListEl = document.getElementById("genreList");
const artistListEl = document.getElementById("artistList");
const songListEl = document.getElementById("songList");
const nowPlayingEl = document.getElementById("nowPlaying");
const selectedPathEl = document.getElementById("selectedPath");

const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const btnEnter = document.getElementById("btnEnter");
const btnBack = document.getElementById("btnBack");
const btnReload = document.getElementById("btnReload");
const btnPlayQueue = document.getElementById("btnPlayQueue");
const btnPause = document.getElementById("btnPause");
const btnResume = document.getElementById("btnResume");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

const queueCountEl = document.getElementById("queueCount");
const queueListEl = document.getElementById("queueList");
const queueMessageEl = document.getElementById("queueMessage");
const toastEl = document.getElementById("toast");
const menuColumns = document.querySelectorAll(".menu-column");

const CATALOG_URL = "/audio/catalog/catalog.json";
const API_BASE = "http://localhost:5000";

let catalog = {};

let activeColumn = "genre";
let selected = { genre: 0, artist: 0, song: 0 };
let data = { genres: [], artists: [], songs: [] };
let queue = [];
let history = [];

function normalizeList(list) {
  return [...list].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function buildData() {
  data.genres = normalizeList(Object.keys(catalog));
  const genre = data.genres[selected.genre] || null;

  const artists = genre ? Object.keys(catalog[genre]) : [];
  data.artists = normalizeList(artists);
  const artist = data.artists[selected.artist] || null;

  const songs = genre && artist ? catalog[genre][artist] : [];
  data.songs = normalizeSongList(songs || []);
}

function renderList(container, items, activeIndex) {
  container.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "menu-item";
    if (index === activeIndex) {
      li.classList.add("active");
    }

    const label = document.createElement("span");
    label.textContent = typeof item === "string" ? item : item.title;
    li.appendChild(label);
    container.appendChild(li);
  });
}

function renderAll() {
  buildData();
  renderList(genreListEl, data.genres, selected.genre);
  renderList(artistListEl, data.artists, selected.artist);
  renderList(songListEl, data.songs, selected.song);
  renderQueue();

  const genre = data.genres[selected.genre] || "—";
  const artist = data.artists[selected.artist] || "—";
  const songObj = data.songs[selected.song];
  const songTitle = songObj ? songObj.title : "—";
  selectedPathEl.textContent = `${genre} / ${artist} / ${songTitle}`;

  menuColumns.forEach((col) => {
    const isActive = col.dataset.column === activeColumn;
    col.classList.toggle("active-column", isActive);
  });
}

function moveSelection(direction) {
  const key = activeColumn;
  const list =
    key === "genre" ? data.genres : key === "artist" ? data.artists : data.songs;

  if (list.length === 0) return;
  const nextIndex = selected[key] + direction;
  if (nextIndex < 0 || nextIndex >= list.length) return;
  selected[key] = nextIndex;
  if (key === "genre") {
    selected.artist = 0;
    selected.song = 0;
  }
  if (key === "artist") {
    selected.song = 0;
  }
  renderAll();
}

function enterSelection() {
  if (activeColumn === "genre") {
    activeColumn = "artist";
  } else if (activeColumn === "artist") {
    activeColumn = "song";
  } else {
    const song = data.songs[selected.song];
    if (song) {
      addToQueue(song);
    }
  }
}

function backSelection() {
  if (activeColumn === "song") {
    activeColumn = "artist";
  } else if (activeColumn === "artist") {
    activeColumn = "genre";
  }
}

btnUp.addEventListener("click", () => moveSelection(-1));
btnDown.addEventListener("click", () => moveSelection(1));
btnEnter.addEventListener("click", () => {
  enterSelection();
  renderAll();
});
btnBack.addEventListener("click", () => {
  backSelection();
  renderAll();
});
btnReload.addEventListener("click", async () => {
  await refreshCatalog();
});
btnPlayQueue.addEventListener("click", () => playNextFromQueue());
btnPause.addEventListener("click", () => sendCommand("/pause"));
btnResume.addEventListener("click", () => sendCommand("/resume"));
btnNext.addEventListener("click", () => playNextFromQueue(true));
btnPrev.addEventListener("click", () => playPreviousFromHistory());

async function loadCatalog() {
  try {
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(`${CATALOG_URL}${cacheBuster}`);
    if (!response.ok) {
      throw new Error(`Erro ${response.status} em ${CATALOG_URL}`);
    }
    const data = await response.json();
    catalog = buildCatalogFromItems(data.items || []);
  } catch (err) {
    console.warn("Nao foi possivel carregar o catalogo.", err);
    catalog = buildCatalogFromItems([]);
  }
  renderAll();
}

async function refreshCatalog() {
  try {
    await fetch(`${API_BASE}/rescan`, { method: "POST" });
  } catch (err) {
    console.warn("Backend de rescan nao disponivel.", err);
  }
  await loadCatalog();
}

function buildCatalogFromItems(items) {
  const result = {};
  items.forEach((item) => {
    const genre = item.genre || "Desconhecido";
    const artist = item.artist || "Desconhecido";
    const title = item.title || item.filename || "Sem titulo";
    if (!result[genre]) result[genre] = {};
    if (!result[genre][artist]) result[genre][artist] = [];
    result[genre][artist].push({
      title,
      index: typeof item.index === "number" ? item.index : null,
    });
  });
  return result;
}

async function playByIndex(index) {
  try {
    await fetch(`${API_BASE}/play/${index}`, { method: "POST" });
    await loadStatus();
  } catch (err) {
    console.warn("Nao foi possivel tocar a musica.", err);
  }
}

async function loadStatus() {
  try {
    const response = await fetch(`${API_BASE}/status`);
    if (!response.ok) return;
    const data = await response.json();
    nowPlayingEl.textContent = data.current_song || "—";
  } catch (err) {
    console.warn("Status do player indisponivel.", err);
  }
}

function normalizeSongList(list) {
  return [...list].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

function addToQueue(song) {
  queue.push(song);
  renderQueue();
  showQueueMessage(`Adicionado: ${song.title}`);
}

function renderQueue() {
  queueCountEl.textContent = `${queue.length} músicas`;
  queueListEl.innerHTML = "";
  queue.forEach((song, index) => {
    const li = document.createElement("li");
    li.className = "menu-item";
    const label = document.createElement("span");
    label.textContent = song.title;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `#${index + 1}`;
    li.appendChild(label);
    li.appendChild(badge);
    queueListEl.appendChild(li);
  });
}

function showQueueMessage(message) {
  if (!queueMessageEl) return;
  queueMessageEl.textContent = message;
  queueMessageEl.classList.remove("hidden");
  clearTimeout(showQueueMessage._timer);
  showQueueMessage._timer = setTimeout(() => {
    queueMessageEl.classList.add("hidden");
  }, 2000);
  showToast(message);
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toastEl.classList.remove("show");
    toastEl.classList.add("hidden");
  }, 2000);
}

async function playNextFromQueue(forceNext = false) {
  if (queue.length === 0) {
    if (forceNext) {
      await sendCommand("/next");
    }
    return;
  }
  const song = queue.shift();
  history.push(song);
  renderQueue();
  if (song && typeof song.index === "number") {
    await playByIndex(song.index);
  }
}

async function playPreviousFromHistory() {
  if (history.length >= 2) {
    history.pop(); // remove atual
    const previous = history[history.length - 1];
    if (previous && typeof previous.index === "number") {
      await playByIndex(previous.index);
    }
    return;
  }
  await sendCommand("/prev");
}

async function sendCommand(path) {
  try {
    await fetch(`${API_BASE}${path}`, { method: "POST" });
    await loadStatus();
  } catch (err) {
    console.warn("Comando indisponivel.", err);
  }
}

loadCatalog();
loadStatus();
