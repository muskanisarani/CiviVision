import os
import io
import time
import json
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image

HEADERS = {
    "User-Agent": "CiviVisionMLDatasetCollector/1.0 (civivision.municipal@gmail.com; Research ML Project)"
}

SEARCH_QUERIES = {
    "Garbage_Waste": [
        "garbage pile street",
        "overflowing dumpster road",
        "trash roadside heap",
        "municipal waste street"
    ],
    "Road_Damage": [
        "pothole road asphalt",
        "pothole street pavement",
        "damaged road asphalt crater",
        "cracked pavement pothole"
    ],
    "Water_Issue": [
        "water main break street",
        "flooded street water burst",
        "water pipe leak street",
        "water leak road flooding"
    ],
    "Streetlights": [
        "broken street light lamp",
        "damaged street light pole",
        "broken streetlamp pole",
        "street light outage road"
    ],
    "Drainage_Sewerage": [
        "clogged storm drain street",
        "open manhole street",
        "overflowing drain gutter road",
        "blocked storm drain water"
    ],
    "Public_Toilet_Issue": [
        "public toilet restroom",
        "public restroom stall",
        "public urinal bathroom",
        "dirty toilet public restroom"
    ],
    "Non_Civic": [
        "indoor living room sofa",
        "delicious food meal plate",
        "cute cat pet resting",
        "dog playing outdoor park",
        "portrait face smiling selfie",
        "modern sedan car parked"
    ]
}

RAW_DATASET_DIR = Path("ml/dataset/raw")


def search_wikimedia_images(query: str, limit: int = 10) -> list:
    """Searches Wikimedia Commons API for image URLs matching query."""
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": "6",  # Files only
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|mime|size"
    }
    encoded_url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(encoded_url, headers=HEADERS)

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            data = json.loads(response.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            results = []
            for _, page in pages.items():
                info_list = page.get("imageinfo", [])
                if not info_list:
                    continue
                info = info_list[0]
                mime = info.get("mime", "")
                url = info.get("url", "")
                # Accept only JPEG, PNG, WebP images
                if ("image/jpeg" in mime or "image/png" in mime or "image/webp" in mime) and url:
                    results.append(url)
            return results
    except Exception as e:
        print(f"    [WARN] Search failed for '{query}': {e}")
        return []


def download_and_save_image(image_url: str, output_path: Path) -> bool:
    """Downloads an image URL, validates with PIL, and saves as clean RGB JPEG."""
    req = urllib.request.Request(image_url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            img_bytes = res.read()
            if len(img_bytes) < 5000:  # Skip tiny thumbnails/icons
                return False

            with Image.open(io.BytesIO(img_bytes)) as img:
                img.verify()
            
            with Image.open(io.BytesIO(img_bytes)) as img:
                rgb_img = img.convert("RGB")
                # Resize if excessively large to save storage and speed up training
                if rgb_img.width > 1200 or rgb_img.height > 1200:
                    rgb_img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                rgb_img.save(output_path, format="JPEG", quality=90)
            return True
    except Exception:
        return False


def collect_dataset(target_per_class: int = 15):
    """Downloads sample images from open Wikimedia Commons into raw class folders."""
    print("=" * 70)
    print("CIVIVISION AUTOMATED REAL-WORLD DATASET DOWNLOADER")
    print("=" * 70)

    for class_name, queries in SEARCH_QUERIES.items():
        class_dir = RAW_DATASET_DIR / class_name
        class_dir.mkdir(parents=True, exist_ok=True)

        # Count existing images
        existing_images = [p for p in class_dir.iterdir() if p.is_file() and p.name != ".gitkeep"]
        current_count = len(existing_images)

        print(f"\n[*] Class: {class_name} (Current: {current_count} images | Target: {target_per_class})")

        downloaded_for_class = 0
        image_index = current_count + 1

        for query in queries:
            if current_count + downloaded_for_class >= target_per_class:
                break

            needed = target_per_class - (current_count + downloaded_for_class)
            print(f"  -> Querying Wikimedia for: '{query}'...")
            urls = search_wikimedia_images(query, limit=max(8, needed + 3))

            for url in urls:
                if current_count + downloaded_for_class >= target_per_class:
                    break

                target_file = class_dir / f"{class_name.lower()}_{image_index:03d}.jpg"
                success = download_and_save_image(url, target_file)

                if success:
                    downloaded_for_class += 1
                    print(f"    [OK] Downloaded: {target_file.name} ({downloaded_for_class}/{target_per_class})")
                    image_index += 1
                    time.sleep(0.3)  # Be polite to Wikipedia servers
                else:
                    # Clean up if partial/corrupt file remained
                    if target_file.exists():
                        target_file.unlink()

        total_class = current_count + downloaded_for_class
        print(f"  [DONE] Class '{class_name}' now has {total_class} images.")

    print("\n" + "=" * 70)
    print("[SUCCESS] All raw images downloaded successfully!")
    print("=" * 70)


if __name__ == "__main__":
    collect_dataset(target_per_class=15)
