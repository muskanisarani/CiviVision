import io
import base64
import pytest
from PIL import Image
import numpy as np
import torch
from fastapi.testclient import TestClient

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from api import app, state, load_ml_resources
from model import build_mobilenet_v3_large, get_transforms, get_device


@pytest.fixture(scope="session", autouse=True)
def setup_test_state():
    load_ml_resources()


@pytest.fixture
def client():
    return TestClient(app)


def create_dummy_image_bytes(color=(128, 128, 128), size=(300, 300), format="JPEG") -> bytes:
    """Helper to generate mock image bytes."""
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()


def test_device_selection():
    device = get_device()
    assert isinstance(device, torch.device)
    assert device.type in ["cuda", "cpu"]


def test_model_architecture():
    model = build_mobilenet_v3_large(num_classes=7, pretrained=False)
    assert model.classifier[3].out_features == 7

    # Test forward pass with dummy tensor
    x = torch.randn(2, 3, 224, 224)
    out = model(x)
    assert out.shape == (2, 7)


def test_transforms():
    img = Image.new("RGB", (400, 300), color="blue")
    transform = get_transforms(is_training=False)
    tensor = transform(img)
    assert tensor.shape == (3, 224, 224)
    assert isinstance(tensor, torch.Tensor)


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "CiviVision-ML-Service"
    assert len(data["classes"]) == 7


def test_predict_multipart_valid(client):
    img_bytes = create_dummy_image_bytes()
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", img_bytes, "image/jpeg")},
        data={"threshold": 0.50}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "category" in data
    assert "confidence" in data
    assert len(data["top_predictions"]) == 3
    assert "model_version" in data
    assert isinstance(data["needs_review"], bool)


def test_predict_json_base64_valid(client):
    img_bytes = create_dummy_image_bytes(color="green")
    b64_str = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode("utf-8")

    response = client.post(
        "/predict-json",
        json={"image": b64_str, "threshold": 0.80}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["top_predictions"]) == 3
    # Check probabilities are in valid range
    assert 0.0 <= data["confidence"] <= 1.0


def test_corrupted_image_handling(client):
    corrupted_bytes = b"not-a-valid-image-data-string"
    response = client.post(
        "/predict",
        files={"file": ("corrupt.jpg", corrupted_bytes, "image/jpeg")}
    )
    assert response.status_code == 400
    assert "corrupted" in response.json()["detail"].lower() or "invalid" in response.json()["detail"].lower()


def test_top_predictions_sorting(client):
    img_bytes = create_dummy_image_bytes(color=(200, 50, 50))
    response = client.post(
        "/predict",
        files={"file": ("test_sort.jpg", img_bytes, "image/jpeg")}
    )
    assert response.status_code == 200
    top_preds = response.json()["top_predictions"]
    assert len(top_preds) == 3
    # Verify confidences are in descending order
    confidences = [p["confidence"] for p in top_preds]
    assert confidences == sorted(confidences, reverse=True)
