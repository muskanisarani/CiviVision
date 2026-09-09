import os
import shutil
import hashlib
import json
import random
from pathlib import Path
from PIL import Image
from typing import Dict, List, Tuple, Set

CLASSES = [
    "Garbage_Waste",
    "Road_Damage",
    "Water_Issue",
    "Streetlights",
    "Drainage_Sewerage",
    "Public_Toilet_Issue",
    "Non_Civic"
]

VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
SEED = 42
MIN_IMAGES_WARNING_THRESHOLD = 30


def get_image_hash(filepath: Path) -> str:
    """Computes SHA-256 hash of image file contents to detect duplicates."""
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def is_valid_image(filepath: Path) -> bool:
    """Verifies image file can be opened and decoded without corruption."""
    try:
        if filepath.suffix.lower() not in VALID_EXTENSIONS:
            return False
        with Image.open(filepath) as img:
            img.verify()
        # Ensure it can also be converted to RGB
        with Image.open(filepath) as img:
            img.convert("RGB")
        return True
    except Exception:
        return False


def prepare_dataset(
    raw_dir: str = "ml/dataset/raw",
    output_dir: str = "ml/dataset",
    reports_dir: str = "ml/reports",
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    seed: int = SEED
) -> Dict:
    """
    Scans raw dataset, validates, deduplicates, and creates stratified train/val/test splits.
    """
    random.seed(seed)
    raw_path = Path(raw_dir)
    out_path = Path(output_dir)
    rep_path = Path(reports_dir)
    rep_path.mkdir(parents=True, exist_ok=True)

    # Initialize raw class folders if they don't exist
    for cls in CLASSES:
        (raw_path / cls).mkdir(parents=True, exist_ok=True)

    stats = {
        "total_raw_found": 0,
        "corrupted_images": [],
        "duplicate_images_removed": [],
        "valid_images_by_class": {},
        "split_counts": {"train": {}, "validation": {}, "test": {}},
        "warnings": []
    }

    seen_hashes: Set[str] = set()
    valid_images_by_class: Dict[str, List[Path]] = {cls: [] for cls in CLASSES}

    print("[*] Scanning raw dataset in:", raw_path.resolve())

    for cls in CLASSES:
        cls_raw_dir = raw_path / cls
        images = [p for p in cls_raw_dir.iterdir() if p.is_file() and p.name != ".gitkeep"]
        stats["total_raw_found"] += len(images)

        for img_path in images:
            if not is_valid_image(img_path):
                stats["corrupted_images"].append(str(img_path))
                print(f"  [WARN] Corrupted/Invalid image detected: {img_path.name}")
                continue

            file_hash = get_image_hash(img_path)
            if file_hash in seen_hashes:
                stats["duplicate_images_removed"].append(str(img_path))
                print(f"  [DUP] Duplicate image detected and skipped: {img_path.name}")
                continue

            seen_hashes.add(file_hash)
            valid_images_by_class[cls].append(img_path)

        count = len(valid_images_by_class[cls])
        stats["valid_images_by_class"][cls] = count
        print(f"  [OK] Class '{cls}': {count} valid unique images")

        if count < MIN_IMAGES_WARNING_THRESHOLD:
            warn_msg = f"Class '{cls}' has only {count} images (recommended minimum is {MIN_IMAGES_WARNING_THRESHOLD} per class for quality transfer learning)."
            stats["warnings"].append(warn_msg)
            print(f"  [INFO] {warn_msg}")

    # Create target split directories
    for split in ["train", "validation", "test"]:
        for cls in CLASSES:
            split_dir = out_path / split / cls
            if split_dir.exists():
                shutil.rmtree(split_dir)
            split_dir.mkdir(parents=True, exist_ok=True)

    # Perform stratified split per class
    for cls, img_list in valid_images_by_class.items():
        shuffled = list(img_list)
        random.shuffle(shuffled)
        n = len(shuffled)

        n_train = int(n * train_ratio)
        n_val = int(n * val_ratio)
        n_test = n - n_train - n_val

        # Handle small dataset edge case
        if n > 0 and n_train == 0:
            n_train = 1

        train_imgs = shuffled[:n_train]
        val_imgs = shuffled[n_train:n_train + n_val]
        test_imgs = shuffled[n_train + n_val:]

        for img in train_imgs:
            shutil.copy2(img, out_path / "train" / cls / img.name)
        for img in val_imgs:
            shutil.copy2(img, out_path / "validation" / cls / img.name)
        for img in test_imgs:
            shutil.copy2(img, out_path / "test" / cls / img.name)

        stats["split_counts"]["train"][cls] = len(train_imgs)
        stats["split_counts"]["validation"][cls] = len(val_imgs)
        stats["split_counts"]["test"][cls] = len(test_imgs)

    # Write reports
    json_report = rep_path / "dataset_stats.json"
    with open(json_report, "w", encoding="utf-8") as f:
        json.dump(stats, f, indent=2)

    txt_report = rep_path / "dataset_stats.txt"
    with open(txt_report, "w", encoding="utf-8") as f:
        f.write("=" * 60 + "\n")
        f.write("CIVIVISION DATASET PREPARATION REPORT\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Total raw images scanned: {stats['total_raw_found']}\n")
        f.write(f"Corrupted images excluded: {len(stats['corrupted_images'])}\n")
        f.write(f"Duplicate images excluded: {len(stats['duplicate_images_removed'])}\n\n")
        f.write("Class Breakdown (Clean Unique):\n")
        for cls, count in stats["valid_images_by_class"].items():
            f.write(f"  - {cls:<25}: {count:>5} images\n")
        f.write("\nSplit Distribution:\n")
        f.write(f"  - Train      (70%): {sum(stats['split_counts']['train'].values())} images\n")
        f.write(f"  - Validation (15%): {sum(stats['split_counts']['validation'].values())} images\n")
        f.write(f"  - Test       (15%): {sum(stats['split_counts']['test'].values())} images\n")
        if stats["warnings"]:
            f.write("\nWarnings:\n")
            for w in stats["warnings"]:
                f.write(f"  [WARN] {w}\n")
        f.write("=" * 60 + "\n")

    print(f"\n[OK] Dataset preparation report saved to:\n  - {json_report}\n  - {txt_report}")
    return stats


if __name__ == "__main__":
    prepare_dataset()
