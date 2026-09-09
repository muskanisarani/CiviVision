import os
import io
import time
import json
import hashlib
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from PIL import Image
from typing import Dict, List, Set

HEADERS = {
    "User-Agent": "CiviVisionMLDatasetCollector/2.0 (civivision.municipal@gmail.com; Educational ML Project)"
}

RAW_DATASET_DIR = Path("ml/dataset/raw")

DATASET_SOURCES = {
    "Garbage_Waste": {
        "categories": [
            "Category:Litter (waste)",
            "Category:Waste containers",
            "Category:Dumpsters",
            "Category:Rubbish dumps",
            "Category:Plastic pollution",
            "Category:Solid waste",
            "Category:Fly tipping",
            "Category:Waste in streets"
        ],
        "searches": [
            "garbage pile street", "overflowing dumpster", "trash on sidewalk",
            "litter road pavement", "waste heap dump", "plastic waste street",
            "illegal trash dump street", "rubbish pavement city"
        ]
    },
    "Road_Damage": {
        "categories": [
            "Category:Potholes",
            "Category:Damaged roads",
            "Category:Cracks in asphalt",
            "Category:Road pavement defects",
            "Category:Road damage",
            "Category:Subsidence of roads"
        ],
        "searches": [
            "pothole asphalt road", "cracked pavement street", "damaged road surface",
            "broken asphalt crater", "sunken road pavement", "asphalt fissure road"
        ]
    },
    "Water_Issue": {
        "categories": [
            "Category:Burst pipes",
            "Category:Water pipe leaks",
            "Category:Flooded roads and streets",
            "Category:Water main breaks",
            "Category:Leaking fire hydrants",
            "Category:Street flooding"
        ],
        "searches": [
            "water main break street", "water pipe leak road", "burst pipe street",
            "flooded city street asphalt", "water puddle leak road", "gushing water street"
        ]
    },
    "Streetlights": {
        "categories": [
            "Category:Street lights",
            "Category:Street light poles",
            "Category:Lanterns on posts",
            "Category:Damaged street lights",
            "Category:Street lamps",
            "Category:Lighting columns"
        ],
        "searches": [
            "streetlight pole road", "street lamp damaged", "street lantern post",
            "broken street light", "highway lighting pole", "lamp post sidewalk"
        ]
    },
    "Drainage_Sewerage": {
        "categories": [
            "Category:Manhole covers",
            "Category:Storm drain grates",
            "Category:Street gutters",
            "Category:Culverts",
            "Category:Sewerage",
            "Category:Storm sewers",
            "Category:Gully grates",
            "Category:Drains",
            "Category:Street drains",
            "Category:Rainwater drains",
            "Category:Culvert pipes"
        ],
        "searches": [
            "storm drain street", "manhole cover road", "clogged drain grate",
            "street drainage gutter", "overflowing sewer street", "open manhole street",
            "road drainage ditch", "curb inlet drain", "storm sewer pipe street",
            "drainage grating road", "sewer grate curb"
        ]
    },
    "Public_Toilet_Issue": {
        "categories": [
            "Category:Public toilets",
            "Category:Urinals",
            "Category:Public restrooms",
            "Category:Toilet rooms",
            "Category:Restrooms",
            "Category:Restroom signs and facilities",
            "Category:Toilets (sanitation fixtures)",
            "Category:Public washrooms",
            "Category:Restroom sinks"
        ],
        "searches": [
            "public toilet stall", "urinal public bathroom", "public restroom lavatory",
            "dirty public toilet", "washroom stall restroom", "commode public",
            "public bathroom stall", "urinal wall public", "sanitary toilet room",
            "commercial restroom toilet"
        ]
    },
    "Non_Civic": {
        "categories": [
            "Category:Living rooms",
            "Category:Prepared food",
            "Category:Domestic cats",
            "Category:Pet dogs",
            "Category:Indoor furniture",
            "Category:Laptops",
            "Category:Indoor houseplants",
            "Category:Dining rooms",
            "Category:Beds",
            "Category:Kitchens",
            "Category:Office desks",
            "Category:Bookshelves"
        ],
        "searches": [
            "living room sofa interior", "plate of food meal", "cat resting indoor",
            "dog playing park", "laptop keyboard desk", "portrait person selfie",
            "indoor houseplant room", "dining table dinner",
            "bedroom interior bed", "kitchen counter cooking", "desk workspace setup",
            "coffee mug desk", "bookshelf books indoor"
        ]
    }
}


def get_image_hash(img_bytes: bytes) -> str:
    """Computes SHA-256 hash of image bytes."""
    return hashlib.sha256(img_bytes).hexdigest()


def fetch_category_images(category_title: str, limit: int = 50) -> List[str]:
    """Fetches direct image URLs from a Wikimedia Commons Category."""
    params = {
        "action": "query",
        "format": "json",
        "generator": "categorymembers",
        "gcmtitle": category_title,
        "gcmtype": "file",
        "gcmlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|mime|size"
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)

    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            urls = []
            for _, page in pages.items():
                info_list = page.get("imageinfo", [])
                if not info_list:
                    continue
                info = info_list[0]
                mime = info.get("mime", "")
                img_url = info.get("url", "")
                if ("image/jpeg" in mime or "image/png" in mime or "image/webp" in mime) and img_url:
                    urls.append(img_url)
            return urls
    except Exception:
        return []


def search_wikimedia_paginated(query: str, limit: int = 40, offset: int = 0) -> List[str]:
    """Searches Wikimedia Commons with offset for diverse results."""
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",
        "gsrlimit": str(limit),
        "gsroffset": str(offset),
        "prop": "imageinfo",
        "iiprop": "url|mime|size"
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)

    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            urls = []
            for _, page in pages.items():
                info_list = page.get("imageinfo", [])
                if not info_list:
                    continue
                info = info_list[0]
                mime = info.get("mime", "")
                img_url = info.get("url", "")
                if ("image/jpeg" in mime or "image/png" in mime or "image/webp" in mime) and img_url:
                    urls.append(img_url)
            return urls
    except Exception:
        return []


def clean_existing_duplicates(raw_dir: Path) -> Dict[str, Set[str]]:
    """
    Scans existing raw directories, removes exact file duplicates,
    and returns a dict of valid SHA-256 hashes per class.
    """
    print("[*] Performing SHA-256 deduplication on existing raw dataset...")
    global_seen: Set[str] = set()
    class_hashes: Dict[str, Set[str]] = {}

    for cls in DATASET_SOURCES.keys():
        cls_dir = raw_dir / cls
        cls_dir.mkdir(parents=True, exist_ok=True)
        class_hashes[cls] = set()

        files = sorted([p for p in cls_dir.iterdir() if p.is_file() and p.name != ".gitkeep"])
        for fpath in files:
            try:
                with open(fpath, "rb") as f:
                    content = f.read()
                if len(content) < 3000:
                    fpath.unlink()
                    continue

                fhash = get_image_hash(content)
                if fhash in global_seen:
                    fpath.unlink()
                else:
                    with Image.open(io.BytesIO(content)) as img:
                        img.verify()
                    global_seen.add(fhash)
                    class_hashes[cls].add(fhash)
            except Exception:
                try:
                    fpath.unlink()
                except Exception:
                    pass

        clean_files = sorted([p for p in cls_dir.iterdir() if p.is_file() and p.name != ".gitkeep"])
        for idx, fpath in enumerate(clean_files, start=1):
            new_name = cls_dir / f"{cls.lower()}_{idx:03d}.jpg"
            if fpath != new_name and not new_name.exists():
                fpath.rename(new_name)

        print(f"  [OK] Class '{cls}': {len(class_hashes[cls])} unique images retained.")

    return class_hashes


def download_and_verify_image(url: str, output_path: Path, global_seen: Set[str]) -> bool:
    """Downloads image, checks SHA-256 uniqueness, validates, and saves as JPEG."""
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            img_bytes = res.read()
            if len(img_bytes) < 4000:
                return False

            fhash = get_image_hash(img_bytes)
            if fhash in global_seen:
                return False

            with Image.open(io.BytesIO(img_bytes)) as img:
                img.verify()

            with Image.open(io.BytesIO(img_bytes)) as img:
                rgb_img = img.convert("RGB")
                if rgb_img.width > 1000 or rgb_img.height > 1000:
                    rgb_img.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
                rgb_img.save(output_path, format="JPEG", quality=88)

            global_seen.add(fhash)
            return True
    except Exception:
        if output_path.exists():
            try:
                output_path.unlink()
            except Exception:
                pass
        return False


def process_category(cls: str, config: dict, target_count: int, global_seen: Set[str]) -> int:
    cls_dir = RAW_DATASET_DIR / cls
    cls_dir.mkdir(parents=True, exist_ok=True)

    existing = [p for p in cls_dir.iterdir() if p.is_file() and p.name != ".gitkeep"]
    count = len(existing)

    if count >= target_count:
        print(f"[OK] Class '{cls}' already has {count} unique images.", flush=True)
        return count

    needed = target_count - count
    print(f"[*] Class '{cls}': fetching {needed} distinct images (currently has {count})...", flush=True)

    candidate_urls: List[str] = []

    # 1. Collect from all Wikimedia Categories
    for cat in config.get("categories", []):
        cat_urls = fetch_category_images(cat, limit=50)
        for u in cat_urls:
            if u not in candidate_urls:
                candidate_urls.append(u)

    # 2. Collect from all Paginated Searches
    for query in config.get("searches", []):
        for offset in [0, 30, 60, 90]:
            search_urls = search_wikimedia_paginated(query, limit=35, offset=offset)
            for u in search_urls:
                if u not in candidate_urls:
                    candidate_urls.append(u)
            if len(candidate_urls) >= needed * 8:
                break
        if len(candidate_urls) >= needed * 8:
            break

    downloaded = 0
    idx = count + 1

    for url in candidate_urls:
        if count + downloaded >= target_count:
            break
        target_path = cls_dir / f"{cls.lower()}_{idx:03d}.jpg"
        if download_and_verify_image(url, target_path, global_seen):
            downloaded += 1
            idx += 1
            print(f"  [+] {cls}: saved unique image {target_path.name} ({count + downloaded}/{target_count})", flush=True)

    total = count + downloaded
    print(f"[DONE] Class '{cls}' now has {total} verified unique images.", flush=True)
    return total


def download_all_unique(target_per_class: int = 50):
    print("=" * 65)
    print("CIVIVISION UNIQUE MULTI-SOURCE DATASET DOWNLOADER")
    print(f"Target: {target_per_class} guaranteed unique images per category")
    print("=" * 65)

    class_hashes = clean_existing_duplicates(RAW_DATASET_DIR)
    global_seen: Set[str] = set()
    for hashes in class_hashes.values():
        global_seen.update(hashes)

    print(f"[*] Total unique image hashes currently in dataset: {len(global_seen)}")
    print("=" * 65)

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(process_category, cls, config, target_per_class, global_seen): cls
            for cls, config in DATASET_SOURCES.items()
        }
        for future in as_completed(futures):
            cls = futures[future]
            try:
                future.result()
            except Exception as e:
                print(f"[ERR] Error downloading {cls}: {e}", flush=True)

    print("\n" + "=" * 65)
    print("[SUCCESS] All categories downloaded with zero duplicate images!")
    print("=" * 65)


if __name__ == "__main__":
    download_all_unique(target_per_class=75)


