import os
import io
import json
import base64
from typing import Optional, List, Dict, Any
from pathlib import Path
from PIL import Image
from contextlib import asynccontextmanager

import torch
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add src to sys.path
import sys
sys.path.insert(0, str(Path(__file__).parent / "src"))

from model import load_checkpoint, build_mobilenet_v3_large, get_transforms, get_device

# Configuration
MODEL_PATH = os.getenv("MODEL_PATH", "ml/models/civivision_model.pth")
CLASSES_PATH = os.getenv("CLASSES_PATH", "ml/models/classes.json")
CONFIG_PATH = os.getenv("CONFIG_PATH", "ml/models/model_config.json")
DEFAULT_THRESHOLD = float(os.getenv("ML_CONFIDENCE_THRESHOLD", "0.70"))
MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

# Global Application State
state: Dict[str, Any] = {
    "model": None,
    "device": None,
    "classes": [],
    "display_names": {},
    "model_version": "civivision-cv-v1",
    "transform": None,
    "is_model_loaded": False
}


def load_ml_resources():
    """Initializes device, transforms, class metadata, and model."""
    device = get_device()
    state["device"] = device
    state["transform"] = get_transforms(is_training=False)

    # Load classes
    if os.path.exists(CLASSES_PATH):
        with open(CLASSES_PATH, "r", encoding="utf-8") as f:
            c_data = json.load(f)
            state["classes"] = c_data.get("classes", [])
            state["display_names"] = c_data.get("display_names", {})
    else:
        state["classes"] = [
            "Garbage_Waste", "Road_Damage", "Water_Issue",
            "Streetlights", "Drainage_Sewerage", "Public_Toilet_Issue", "Non_Civic"
        ]
        state["display_names"] = {
            "Garbage_Waste": "Garbage / Waste",
            "Road_Damage": "Road Damage",
            "Water_Issue": "Water Issue",
            "Streetlights": "Streetlights",
            "Drainage_Sewerage": "Drainage & Sewerage",
            "Public_Toilet_Issue": "Public Toilet Issue",
            "Non_Civic": "Non-Civic / Invalid"
        }

    # Load model checkpoint if available, or initialize architecture
    if os.path.exists(MODEL_PATH):
        try:
            model, meta = load_checkpoint(MODEL_PATH, num_classes=len(state["classes"]), device=device)
            state["model"] = model
            state["model_version"] = meta.get("model_version", "civivision-cv-v1")
            state["is_model_loaded"] = True
            print(f"[OK] Loaded trained CiviVision model checkpoint from: {MODEL_PATH}")
        except Exception as e:
            print(f"[WARN] Error loading checkpoint: {e}. Initializing architecture.")
            model = build_mobilenet_v3_large(num_classes=len(state["classes"]), pretrained=False).to(device)
            model.eval()
            state["model"] = model
            state["is_model_loaded"] = False
    else:
        print(f"[INFO] Checkpoint not found at {MODEL_PATH}. Initializing MobileNetV3 architecture in unweighted state.")
        model = build_mobilenet_v3_large(num_classes=len(state["classes"]), pretrained=False).to(device)
        model.eval()
        state["model"] = model
        state["is_model_loaded"] = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_ml_resources()
    yield


app = FastAPI(
    title="CiviVision Computer Vision ML Service",
    description="MobileNetV3-Large Transfer Learning Service for Municipal Defect Classification",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Base64PredictRequest(BaseModel):
    image: str
    threshold: Optional[float] = None


class PredictionItem(BaseModel):
    category: str
    raw_class: str
    confidence: float


class PredictionResponse(BaseModel):
    success: bool
    is_civic_issue: bool
    category: str
    raw_category: str
    confidence: float
    severity: Optional[str] = None
    top_predictions: List[PredictionItem]
    needs_review: bool
    model_version: str
    rejection_reason: Optional[str] = None
    device: str


def decode_image_data(image_bytes: bytes) -> Image.Image:
    """Validates and decodes image bytes to an RGB PIL Image."""
    if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="Image size exceeds 15MB limit")
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
        # Re-open after verify to load image for processing
        img = Image.open(io.BytesIO(image_bytes))
        return img.convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or corrupted image format: {str(e)}")


def run_inference_on_pil(pil_img: Image.Image, threshold: float = DEFAULT_THRESHOLD) -> PredictionResponse:
    """Executes model forward pass and formats structured prediction."""
    if state["model"] is None:
        raise HTTPException(status_code=503, detail="ML Model is not initialized")

    device = state["device"]
    transform = state["transform"]
    tensor = transform(pil_img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = state["model"](tensor)
        probs = torch.softmax(outputs, dim=1).squeeze(0).cpu().numpy()

    sorted_indices = probs.argsort()[::-1]
    top_class_idx = int(sorted_indices[0])
    top_class_raw = state["classes"][top_class_idx]
    top_confidence = float(probs[top_class_idx])

    top_predictions = []
    for idx in sorted_indices[:3]:
        raw_name = state["classes"][int(idx)]
        top_predictions.append(PredictionItem(
            category=state["display_names"].get(raw_name, raw_name.replace("_", " ")),
            raw_class=raw_name,
            confidence=round(float(probs[int(idx)]), 4)
        ))

    is_non_civic = top_class_raw == "Non_Civic"
    is_civic_issue = not is_non_civic
    display_category = state["display_names"].get(top_class_raw, top_class_raw.replace("_", " "))
    needs_review = top_confidence < threshold

    rejection = None
    if is_non_civic:
        rejection = "No valid municipal defect detected in this image (classified as non-civic/irrelevant scene)."

    return PredictionResponse(
        success=True,
        is_civic_issue=is_civic_issue,
        category=display_category,
        raw_category=top_class_raw,
        confidence=round(top_confidence, 4),
        severity=None,  # Null until dedicated labelled severity dataset is trained
        top_predictions=top_predictions,
        needs_review=needs_review,
        model_version=state["model_version"],
        rejection_reason=rejection,
        device=str(device)
    )


@app.get("/health")
async def health_check():
    """Returns service health and model status."""
    return {
        "status": "healthy",
        "service": "CiviVision-ML-Service",
        "model_loaded": state["is_model_loaded"],
        "model_path": MODEL_PATH,
        "model_version": state["model_version"],
        "device": str(state["device"]),
        "cuda_available": torch.cuda.is_available(),
        "classes": state["classes"]
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_multipart(
    file: Optional[UploadFile] = File(None),
    threshold: Optional[float] = Form(None)
):
    """
    Multipart image prediction endpoint.
    """
    if file is None:
        raise HTTPException(status_code=400, detail="Image file must be provided via 'file'")

    image_bytes = await file.read()
    pil_img = decode_image_data(image_bytes)
    active_threshold = threshold if threshold is not None else DEFAULT_THRESHOLD
    return run_inference_on_pil(pil_img, threshold=active_threshold)


@app.post("/predict-json", response_model=PredictionResponse)
async def predict_json(payload: Base64PredictRequest):
    """
    Base64 JSON image prediction endpoint.
    """
    raw_b64 = payload.image
    if "," in raw_b64:
        raw_b64 = raw_b64.split(",")[1]

    try:
        image_bytes = base64.b64decode(raw_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image encoding")

    pil_img = decode_image_data(image_bytes)
    active_threshold = payload.threshold if payload.threshold is not None else DEFAULT_THRESHOLD
    return run_inference_on_pil(pil_img, threshold=active_threshold)
