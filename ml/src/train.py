import os
import json
import time
import argparse
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Dict, List, Tuple

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from sklearn.metrics import precision_recall_fscore_support, accuracy_score

from model import (
    build_mobilenet_v3_large,
    freeze_backbone,
    unfreeze_upper_layers,
    get_transforms,
    get_device,
    save_checkpoint
)

MODEL_VERSION = "civivision-cv-v1"


def calculate_metrics(y_true: List[int], y_pred: List[int]) -> Dict[str, float]:
    """Calculates accuracy, macro precision, recall, and F1."""
    acc = accuracy_score(y_true, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="macro", zero_division=0
    )
    weighted_f1 = precision_recall_fscore_support(
        y_true, y_pred, average="weighted", zero_division=0
    )[2]
    return {
        "accuracy": float(acc),
        "macro_precision": float(prec),
        "macro_recall": float(rec),
        "macro_f1": float(f1),
        "weighted_f1": float(weighted_f1)
    }


def train_one_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    device: torch.device
) -> Tuple[float, float]:
    """Runs one training epoch."""
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0

    for inputs, labels in dataloader:
        inputs = inputs.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item() * inputs.size(0)
        _, preds = torch.max(outputs, 1)
        correct += torch.sum(preds == labels.data).item()
        total += inputs.size(0)

    epoch_loss = total_loss / max(1, total)
    epoch_acc = correct / max(1, total)
    return epoch_loss, epoch_acc


def evaluate_epoch(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    device: torch.device
) -> Tuple[float, Dict[str, float]]:
    """Runs evaluation on validation set."""
    model.eval()
    total_loss = 0.0
    total = 0
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for inputs, labels in dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model(inputs)
            loss = criterion(outputs, labels)

            total_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)

            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            total += inputs.size(0)

    val_loss = total_loss / max(1, total)
    metrics = calculate_metrics(all_labels, all_preds)
    return val_loss, metrics


def plot_training_history(history: Dict[str, List[float]], output_path: str) -> None:
    """Plots and saves loss and accuracy curves."""
    epochs = range(1, len(history["train_loss"]) + 1)
    plt.figure(figsize=(12, 5))

    # Loss plot
    plt.subplot(1, 2, 1)
    plt.plot(epochs, history["train_loss"], "b-", label="Train Loss")
    plt.plot(epochs, history["val_loss"], "r-", label="Val Loss")
    plt.title("Training & Validation Loss")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.6)

    # Accuracy / F1 plot
    plt.subplot(1, 2, 2)
    plt.plot(epochs, history["val_acc"], "g-", label="Val Accuracy")
    plt.plot(epochs, history["val_macro_f1"], "m-", label="Val Macro F1")
    plt.title("Validation Accuracy & Macro F1")
    plt.xlabel("Epoch")
    plt.ylabel("Score")
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.6)

    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()


def train(
    dataset_dir: str = "ml/dataset",
    output_model_path: str = "ml/models/civivision_model.pth",
    reports_dir: str = "ml/reports",
    stage1_epochs: int = 15,
    stage2_epochs: int = 10,
    batch_size: int = 32,
    lr_stage1: float = 1e-3,
    lr_stage2: float = 1e-4,
    patience: int = 5
) -> None:
    """
    Main training function with two-stage transfer learning:
    1. Freeze backbone, train classification head.
    2. Unfreeze top feature layers and fine-tune.
    """
    device = get_device()
    print(f"[*] Training Device: {device} ({'GPU Acceleration' if device.type == 'cuda' else 'CPU Mode'})")

    train_dir = Path(dataset_dir) / "train"
    val_dir = Path(dataset_dir) / "validation"

    if not train_dir.exists() or not val_dir.exists():
        print("[ERR] Dataset split directories not found. Please run 'python ml/src/prepare_dataset.py' first.")
        return

    valid_exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    train_count = sum(1 for p in train_dir.rglob("*") if p.is_file() and p.suffix.lower() in valid_exts)
    val_count = sum(1 for p in val_dir.rglob("*") if p.is_file() and p.suffix.lower() in valid_exts)

    if train_count == 0 or val_count == 0:
        print("\n" + "=" * 70)
        print("[INFO] No image files detected in 'ml/dataset/train/' or 'ml/dataset/validation/'!")
        print("=" * 70)
        print("To train the MobileNetV3 model:")
        print("  1. Place your raw image files (.jpg, .png) into their class folders:")
        print("     - ml/dataset/raw/Garbage_Waste/")
        print("     - ml/dataset/raw/Road_Damage/")
        print("     - ml/dataset/raw/Water_Issue/")
        print("     - ml/dataset/raw/Streetlights/")
        print("     - ml/dataset/raw/Drainage_Sewerage/")
        print("     - ml/dataset/raw/Public_Toilet_Issue/")
        print("     - ml/dataset/raw/Non_Civic/")
        print("\n  2. Run dataset preparation (validates and splits data 70/15/15):")
        print("     python ml/src/prepare_dataset.py")
        print("\n  3. Re-run training:")
        print("     python ml/src/train.py --epochs1 15 --epochs2 10 --batch-size 32")
        print("=" * 70 + "\n")
        return

    try:
        train_dataset = ImageFolder(root=str(train_dir), transform=get_transforms(is_training=True))
        val_dataset = ImageFolder(root=str(val_dir), transform=get_transforms(is_training=False))
    except Exception as e:
        print(f"[ERR] Failed to load dataset splits: {e}")
        return

    print(f"[*] Dataset Loaded: {len(train_dataset)} training images, {len(val_dataset)} validation images")
    print(f"[*] Class Index Mapping: {train_dataset.class_to_idx}")

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    num_classes = len(train_dataset.classes)
    model = build_mobilenet_v3_large(num_classes=num_classes, pretrained=True).to(device)

    criterion = nn.CrossEntropyLoss(label_smoothing=0.08)
    best_macro_f1 = -1.0
    best_epoch = 0
    patience_counter = 0

    history = {
        "train_loss": [], "val_loss": [],
        "train_acc": [], "val_acc": [],
        "val_macro_f1": []
    }

    # ================= STAGE 1: Train Classification Head =================
    print("\n--- STAGE 1: Training Classification Head (Backbone Frozen) ---")
    freeze_backbone(model, freeze=True)
    optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=lr_stage1, weight_decay=5e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=stage1_epochs)

    for epoch in range(1, stage1_epochs + 1):
        t0 = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_metrics = evaluate_epoch(model, val_loader, criterion, device)
        scheduler.step()
        elapsed = time.time() - t0

        history["train_loss"].append(train_loss)
        history["val_loss"].append(val_loss)
        history["train_acc"].append(train_acc)
        history["val_acc"].append(val_metrics["accuracy"])
        history["val_macro_f1"].append(val_metrics["macro_f1"])

        print(f"Epoch {epoch:02d}/{stage1_epochs:02d} [{elapsed:.1f}s] - Train Loss: {train_loss:.4f} - Train Acc: {train_acc*100:.1f}% | Val Loss: {val_loss:.4f} - Val Acc: {val_metrics['accuracy']*100:.1f}% - Val Macro F1: {val_metrics['macro_f1']:.4f}")

        if val_metrics["macro_f1"] > best_macro_f1:
            best_macro_f1 = val_metrics["macro_f1"]
            best_epoch = epoch
            save_checkpoint(model, output_model_path, optimizer, epoch, val_metrics, train_dataset.class_to_idx)
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"[INFO] Early stopping triggered in Stage 1 at epoch {epoch}")
                break

    # ================= STAGE 2: Fine-Tuning Upper Layers =================
    print("\n--- STAGE 2: Fine-Tuning Upper Feature Layers ---")
    unfreeze_upper_layers(model, num_layers=6)
    optimizer = torch.optim.AdamW(filter(lambda p: p.requires_grad, model.parameters()), lr=lr_stage2, weight_decay=5e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=stage2_epochs)
    patience_counter = 0

    for epoch in range(stage1_epochs + 1, stage1_epochs + stage2_epochs + 1):
        t0 = time.time()
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_metrics = evaluate_epoch(model, val_loader, criterion, device)
        scheduler.step()
        elapsed = time.time() - t0

        history["train_loss"].append(train_loss)
        history["val_loss"].append(val_loss)
        history["train_acc"].append(train_acc)
        history["val_acc"].append(val_metrics["accuracy"])
        history["val_macro_f1"].append(val_metrics["macro_f1"])

        print(f"Epoch {epoch:02d}/{(stage1_epochs+stage2_epochs):02d} [{elapsed:.1f}s] - Train Loss: {train_loss:.4f} - Train Acc: {train_acc*100:.1f}% | Val Loss: {val_loss:.4f} - Val Acc: {val_metrics['accuracy']*100:.1f}% - Val Macro F1: {val_metrics['macro_f1']:.4f}")

        if val_metrics["macro_f1"] > best_macro_f1:
            best_macro_f1 = val_metrics["macro_f1"]
            best_epoch = epoch
            save_checkpoint(model, output_model_path, optimizer, epoch, val_metrics, train_dataset.class_to_idx)
            patience_counter = 0
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print(f"[INFO] Early stopping triggered in Stage 2 at epoch {epoch}")
                break

    # Save metrics and training curves
    Path(reports_dir).mkdir(parents=True, exist_ok=True)
    curve_path = Path(reports_dir) / "training_curves.png"
    plot_training_history(history, str(curve_path))

    # Save classes.json
    classes_json_path = Path(output_model_path).parent / "classes.json"
    display_mapping = {
        "Garbage_Waste": "Garbage / Waste",
        "Road_Damage": "Road Damage",
        "Water_Issue": "Water Issue",
        "Streetlights": "Streetlights",
        "Drainage_Sewerage": "Drainage & Sewerage",
        "Public_Toilet_Issue": "Public Toilet Issue",
        "Non_Civic": "Non-Civic / Invalid"
    }
    with open(classes_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "classes": train_dataset.classes,
            "class_to_idx": train_dataset.class_to_idx,
            "display_names": display_mapping
        }, f, indent=2)

    metrics_path = Path(output_model_path).parent / "metrics.json"
    final_metrics = {
        "model_version": MODEL_VERSION,
        "best_epoch": best_epoch,
        "best_validation_macro_f1": best_macro_f1,
        "training_samples": len(train_dataset),
        "validation_samples": len(val_dataset),
        "device": str(device),
        "classes": train_dataset.classes
    }
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(final_metrics, f, indent=2)

    print(f"\n[OK] Training Completed! Best Checkpoint saved to: {output_model_path}")
    print(f"[*] Training curves saved to: {curve_path}")
    print(f"[*] Metrics summary saved to: {metrics_path}")
    print(f"[*] Classes mapping saved to: {classes_json_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train CiviVision MobileNetV3 model")
    parser.add_argument("--epochs1", type=int, default=25, help="Stage 1 epochs")
    parser.add_argument("--epochs2", type=int, default=20, help="Stage 2 epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--patience", type=int, default=10, help="Early stopping patience")
    args = parser.parse_args()

    train(
        stage1_epochs=args.epochs1,
        stage2_epochs=args.epochs2,
        batch_size=args.batch_size,
        patience=args.patience
    )
