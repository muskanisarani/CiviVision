import os
import json
import argparse
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Dict, List

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    precision_recall_fscore_support,
    accuracy_score
)

from model import load_checkpoint, get_transforms, get_device


def evaluate_test_set(
    model_path: str = "ml/models/civivision_model.pth",
    test_dir: str = "ml/dataset/test",
    reports_dir: str = "ml/reports",
    batch_size: int = 32
) -> Dict:
    """
    Evaluates trained model strictly on the held-out test dataset.
    """
    device = get_device()
    print(f"[*] Evaluation Device: {device}")

    if not os.path.exists(model_path):
        print(f"[ERR] Model checkpoint not found at: {model_path}")
        print("  -> Please train the model first by running: python ml/src/train.py")
        return {}

    test_path = Path(test_dir)
    if not test_path.exists():
        print(f"[ERR] Test dataset directory not found at: {test_path}")
        print("  -> Please prepare dataset splits first by running: python ml/src/prepare_dataset.py")
        return {}

    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    test_count = sum(1 for p in test_path.rglob("*") if p.is_file() and p.suffix.lower() in valid_exts)
    if test_count == 0:
        print(f"[WARN] Test dataset directory '{test_dir}' contains 0 images.")
        print("  -> Please populate raw images in 'ml/dataset/raw/' and run 'python ml/src/prepare_dataset.py'.")
        return {}

    try:
        test_dataset = ImageFolder(root=str(test_path), transform=get_transforms(is_training=False))
    except Exception as e:
        print(f"[ERR] Failed to load test dataset: {e}")
        return {}

    classes = test_dataset.classes
    num_classes = len(classes)
    print(f"[*] Evaluating {len(test_dataset)} test images across {num_classes} classes: {classes}")

    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    model, metadata = load_checkpoint(model_path, num_classes=num_classes, device=device)

    all_preds = []
    all_labels = []
    all_probs = []

    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())

    # Calculate overall metrics
    acc = accuracy_score(all_labels, all_preds)
    macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(all_labels, all_preds, average="macro", zero_division=0)
    weighted_p, weighted_r, weighted_f1, _ = precision_recall_fscore_support(all_labels, all_preds, average="weighted", zero_division=0)

    # Calculate per-class metrics
    per_class_p, per_class_r, per_class_f1, per_class_supp = precision_recall_fscore_support(
        all_labels, all_preds, labels=list(range(num_classes)), average=None, zero_division=0
    )

    per_class_results = {}
    for idx, cls in enumerate(classes):
        per_class_results[cls] = {
            "precision": float(per_class_p[idx]),
            "recall": float(per_class_r[idx]),
            "f1_score": float(per_class_f1[idx]),
            "support": int(per_class_supp[idx])
        }

    summary = {
        "model_version": metadata.get("model_version", "civivision-cv-v1"),
        "total_test_samples": len(test_dataset),
        "overall_accuracy": float(acc),
        "macro_precision": float(macro_p),
        "macro_recall": float(macro_r),
        "macro_f1": float(macro_f1),
        "weighted_f1": float(weighted_f1),
        "per_class_metrics": per_class_results
    }

    rep_path = Path(reports_dir)
    rep_path.mkdir(parents=True, exist_ok=True)

    # Save JSON report
    json_path = rep_path / "classification_report.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    # Save formatted text report
    clf_report = classification_report(all_labels, all_preds, target_names=classes, zero_division=0)
    txt_path = rep_path / "classification_report.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 65 + "\n")
        f.write(f"CIVIVISION MODEL TEST EVALUATION REPORT ({metadata.get('model_version', 'v1')})\n")
        f.write("=" * 65 + "\n\n")
        f.write(clf_report)
        f.write("\n" + "=" * 65 + "\n")
        f.write(f"Overall Accuracy : {acc*100:.2f}%\n")
        f.write(f"Macro F1-Score   : {macro_f1:.4f}\n")
        f.write(f"Weighted F1-Score: {weighted_f1:.4f}\n")
        f.write("=" * 65 + "\n")

    # Generate Confusion Matrix
    cm = confusion_matrix(all_labels, all_preds, labels=list(range(num_classes)))
    fig, ax = plt.subplots(figsize=(10, 8))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=classes)
    disp.plot(cmap="Blues", values_format="d", ax=ax, colorbar=True)
    plt.title(f"Confusion Matrix - {metadata.get('model_version', 'civivision-cv-v1')}")
    plt.xticks(rotation=35, ha="right")
    plt.tight_layout()

    cm_path = rep_path / "confusion_matrix.png"
    plt.savefig(cm_path, dpi=200)
    plt.close()

    print("\n" + "=" * 65)
    print("CLASSIFICATION EVALUATION SUMMARY:")
    print("=" * 65)
    print(clf_report)
    print(f"Overall Accuracy : {acc*100:.2f}%")
    print(f"Macro F1-Score   : {macro_f1:.4f}")
    print(f"\nSaved Reports:")
    print(f"  - {json_path}")
    print(f"  - {txt_path}")
    print(f"  - {cm_path}")

    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate CiviVision model on test set")
    parser.add_argument("--model", type=str, default="ml/models/civivision_model.pth", help="Model checkpoint path")
    parser.add_argument("--test-dir", type=str, default="ml/dataset/test", help="Test dataset directory")
    args = parser.parse_args()

    evaluate_test_set(model_path=args.model, test_dir=args.test_dir)
