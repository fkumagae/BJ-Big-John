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
const menuColumns = document.querySelectorAll(".menu-column");

const CATALOG_URL = "/audio/catalog/catalog.json";

let catalog = {};

let activeColumn = "genre";
let selected = { genre: 0, artist: 0, song: 0 };
let data = { genres: [], artists: [], songs: [] };

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
  data.songs = normalizeList(songs || []);
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
    label.textContent = item;
    li.appendChild(label);
    container.appendChild(li);
  });
}

function renderAll() {
  buildData();
  renderList(genreListEl, data.genres, selected.genre);
  renderList(artistListEl, data.artists, selected.artist);
  renderList(songListEl, data.songs, selected.song);

  const genre = data.genres[selected.genre] || "—";
  const artist = data.artists[selected.artist] || "—";
  const song = data.songs[selected.song] || "—";
  selectedPathEl.textContent = `${genre} / ${artist} / ${song}`;

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
    nowPlayingEl.textContent = song || "—";
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
    await fetch("/rescan", { method: "POST" });
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
    result[genre][artist].push(title);
  });
  return result;
}

loadCatalog();
