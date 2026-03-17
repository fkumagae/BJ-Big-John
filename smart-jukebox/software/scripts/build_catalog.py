import json
import os
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MUSIC_DIR = os.path.join(ROOT, "audio", "music")
CATALOG_DIR = os.path.join(ROOT, "audio", "catalog")
CATALOG_PATH = os.path.join(CATALOG_DIR, "catalog.json")


def safe_text(value):
    if isinstance(value, list):
        return value[0] if value else None
    return value


def clean_token(token):
    return token.replace("_", " ").strip()


def strip_known_extensions(filename):
    base = os.path.basename(filename)
    for ext in (".mp3.mpeg", ".mp3", ".mpeg"):
        if base.lower().endswith(ext):
            return base[: -len(ext)]
    return os.path.splitext(base)[0]


def parse_filename(filename):
    name = strip_known_extensions(filename)
    if " - " in name:
        artist, title = name.split(" - ", 1)
        return title.strip(), artist.strip(), "Desconhecido"

    parts = name.split("-")
    parts = [clean_token(p) for p in parts if p.strip()]
    if len(parts) >= 3:
        genre = parts[0]
        artist = parts[1]
        title = " - ".join(parts[2:])
        return title, artist, genre
    if len(parts) == 2:
        artist = parts[0]
        title = parts[1]
        return title, artist, "Desconhecido"
    return clean_token(name), "Desconhecido", "Desconhecido"


def read_tags(path):
    try:
        from mutagen import File as MutagenFile
    except Exception:
        return None

    audio = MutagenFile(path, easy=True)
    if not audio:
        return None

    title = safe_text(audio.get("title"))
    artist = safe_text(audio.get("artist"))
    genre = safe_text(audio.get("genre"))
    return {
        "title": title,
        "artist": artist,
        "genre": genre,
    }


def load_existing_items():
    if not os.path.isfile(CATALOG_PATH):
        return []
    try:
        with open(CATALOG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data.get("items", [])
    except Exception:
        return []


def build_catalog():
    items = []
    if not os.path.isdir(MUSIC_DIR):
        print(f"Pasta de musicas nao encontrada: {MUSIC_DIR}")
        return {"items": []}

    existing = load_existing_items()
    existing_by_filename = {item.get("filename"): item for item in existing if item.get("filename")}
    found_any = False

    files = []
    for filename in sorted(os.listdir(MUSIC_DIR)):
        lower = filename.lower()
        if not (lower.endswith(".mp3") or lower.endswith(".mp3.mpeg") or lower.endswith(".mpeg")):
            continue
        files.append(filename)

    for index, filename in enumerate(files):
        found_any = True
        path = os.path.join(MUSIC_DIR, filename)
        tags = read_tags(path)
        title, artist, genre = parse_filename(filename)
        if filename in existing_by_filename:
            item = dict(existing_by_filename[filename])
            item["index"] = index
            items.append(item)
            continue

        items.append(
            {
                "index": index,
                "title": (tags.get("title") if tags else None) or title,
                "artist": (tags.get("artist") if tags else None) or artist,
                "genre": (tags.get("genre") if tags else None) or genre,
                "filename": filename,
            }
        )

    if not found_any and existing:
        # If no mp3 was found, keep the existing catalog to avoid wiping it.
        items = existing

    return {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "items": items,
    }


def main():
    os.makedirs(CATALOG_DIR, exist_ok=True)
    catalog = build_catalog()
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    print(f"Catalogo gerado em: {CATALOG_PATH}")


if __name__ == "__main__":
    main()
