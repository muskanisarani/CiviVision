import os
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from typing import Dict, Any, Tuple, Optional

# Standard ImageNet normalization values used by MobileNetV3
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
DEFAULT_IMAGE_SIZE = (224, 224)


def get_device() -> torch.device:
    """
    Automatically selects CUDA GPU if available, else CPU.
    """
    if torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")


def get_transforms(is_training: bool = False) -> transforms.Compose:
    """
    Returns image preprocessing transforms.
    Training includes realistic data augmentation.
    Validation/Inference uses deterministic normalization.
    """
    if is_training:
        return transforms.Compose([
            transforms.RandomResizedCrop(DEFAULT_IMAGE_SIZE, scale=(0.8, 1.0)),
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
            transforms.RandomAffine(degrees=8, translate=(0.04, 0.04)),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
        ])
    else:
        return transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(DEFAULT_IMAGE_SIZE),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD)
        ])


def build_mobilenet_v3_large(num_classes: int = 7, pretrained: bool = True) -> nn.Module:
    """
    Builds a MobileNetV3-Large transfer learning architecture
    adapted for CiviVision's 7 municipal classes.
    """
    if pretrained:
        try:
            weights = models.MobileNet_V3_Large_Weights.DEFAULT
            model = models.mobilenet_v3_large(weights=weights)
        except Exception:
            model = models.mobilenet_v3_large(pretrained=True)
    else:
        model = models.mobilenet_v3_large(weights=None)

    # In MobileNetV3-Large, classifier[0] is Linear(960, 1280), classifier[3] is Linear(1280, 1000)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model


def freeze_backbone(model: nn.Module, freeze: bool = True) -> None:
    """
    Freezes or unfreezes backbone feature extractor layers.
    """
    for param in model.features.parameters():
        param.requires_grad = not freeze


def unfreeze_upper_layers(model: nn.Module, num_layers: int = 4) -> None:
    """
    Unfreezes the top N feature blocks for fine-tuning.
    """
    # Unfreeze classifier head
    for param in model.classifier.parameters():
        param.requires_grad = True

    # Unfreeze the last few feature blocks
    total_blocks = len(model.features)
    for i in range(total_blocks - num_layers, total_blocks):
        for param in model.features[i].parameters():
            param.requires_grad = True


def save_checkpoint(
    model: nn.Module,
    filepath: str,
    optimizer: Optional[torch.optim.Optimizer] = None,
    epoch: int = 0,
    metrics: Optional[Dict[str, Any]] = None,
    class_to_idx: Optional[Dict[str, int]] = None
) -> None:
    """
    Saves model state dict and training metadata.
    """
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
    checkpoint = {
        "model_state_dict": model.state_dict(),
        "epoch": epoch,
        "metrics": metrics or {},
        "class_to_idx": class_to_idx or {},
        "architecture": "mobilenet_v3_large",
        "model_version": "civivision-cv-v1"
    }
    if optimizer:
        checkpoint["optimizer_state_dict"] = optimizer.state_dict()
    torch.save(checkpoint, filepath)


def load_checkpoint(
    filepath: str,
    num_classes: int = 7,
    device: Optional[torch.device] = None
) -> Tuple[nn.Module, Dict[str, Any]]:
    """
    Loads model from checkpoint filepath on the given device.
    """
    if device is None:
        device = get_device()

    model = build_mobilenet_v3_large(num_classes=num_classes, pretrained=False)
    checkpoint = torch.load(filepath, map_location=device)

    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
        metadata = checkpoint
    else:
        model.load_state_dict(checkpoint)
        metadata = {"model_version": "civivision-cv-v1"}

    model.to(device)
    model.eval()
    return model, metadata
