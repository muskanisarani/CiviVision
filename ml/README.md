# CiviVision Computer Vision ML Pipeline

Welcome to the **CiviVision Computer Vision Subsystem** — a custom-trained, production-grade PyTorch deep learning pipeline and FastAPI microservice designed for municipal grievance classification and non-civic image filtering.

---

## 🏗️ 1. Architecture Overview

```text
React Frontend (UserComplaint.js)
      │
      ▼
Node.js / Express Backend (/api/ai/verify)
      │
      ├────────────────────────────────────────┐
      ▼ (Primary)                              ▼ (Fallback)
Python FastAPI ML Service                Google Gemini Multimodal Vision
(http://localhost:8000/predict)          (if ML offline & ENABLE_GEMINI_FALLBACK=true)
      │
      ▼
PyTorch MobileNetV3-Large
(Model: civivision-cv-v1)
      │
      ▼
7-Class Softmax Probabilities
(Category, Confidence, Top 3 Predictions, Non-Civic Rejection, Needs Review Flag)
```

---

## 🎯 2. Target Classes (7 Categories)

| Raw Class Index | Portal Display Name | Description |
| :--- | :--- | :--- |
| `0: Garbage_Waste` | **Garbage / Waste** | Overflowing dumpsters, solid garbage piles, illegal roadside dumping. |
| `1: Road_Damage` | **Road Damage** | Potholes, asphalt cracks, broken pavers, eroded road sections. |
| `2: Water_Issue` | **Water Issue** | Burst municipal pipelines, fresh water leakage, road flooding. |
| `3: Streetlights` | **Streetlights** | Non-functional streetlights, broken poles, hanging wires. |
| `4: Drainage_Sewerage` | **Drainage & Sewerage** | Clogged storm drains, open sewers, overflowing manholes. |
| `5: Public_Toilet_Issue` | **Public Toilet Issue** | Broken sanitary fittings, unhygienic public restrooms, non-functional taps. |
| `6: Non_Civic` | **Non-Civic / Invalid** | Selfies, portraits, indoor rooms, furniture, pets, food, memes, screenshots, vehicles without defects, random objects. |

---

## 📦 3. Directory Layout

```text
ml/
├── dataset/
│   ├── raw/                      # Place your raw downloaded/captured photos here
│   │   ├── Garbage_Waste/
│   │   ├── Road_Damage/
│   │   ├── Water_Issue/
│   │   ├── Streetlights/
│   │   ├── Drainage_Sewerage/
│   │   ├── Public_Toilet_Issue/
│   │   └── Non_Civic/
│   ├── train/                    # 70% Stratified Training Split (Auto-generated)
│   ├── validation/               # 15% Stratified Validation Split (Auto-generated)
│   └── test/                     # 15% Stratified Test Split (Auto-generated)
├── src/
│   ├── model.py                  # MobileNetV3-Large Architecture & Transforms
│   ├── prepare_dataset.py        # Validation, Hash Deduplication & Stratified Splitting
│   ├── train.py                  # Two-Stage Transfer Learning with Early Stopping
│   ├── evaluate.py               # Held-out Test Evaluation & Confusion Matrix
│   └── predict.py                # CLI Single-Image Prediction Utility
├── models/
│   ├── civivision_model.pth      # Saved Trained PyTorch Weights
│   ├── classes.json              # Class index mapping & display names
│   ├── model_config.json         # Hyperparameters & input normalization
│   └── metrics.json              # Checkpoint evaluation summary
├── reports/
│   ├── dataset_stats.json        # Dataset scan summary & class distribution
│   ├── dataset_stats.txt         # Human-readable dataset breakdown
│   ├── training_curves.png       # Loss & Macro-F1 curves
│   ├── confusion_matrix.png      # Test confusion matrix plot
│   ├── classification_report.json
│   └── classification_report.txt
├── tests/
│   └── test_ml.py                # Pytest verification suite
├── api.py                        # FastAPI Inference Microservice
├── requirements.txt              # Python dependencies
└── README.md
```

---

## ⚡ 4. Setup & Installation

### Requirements:
* **Python 3.10+** (Tested on Python 3.11)
* **CUDA GPU** (Optional — automatically selects CPU if CUDA is unavailable)

### Step 1: Create and Activate Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

### Step 2: Install Python Dependencies
```bash
pip install -r ml/requirements.txt
```

---

## 📊 5. Dataset Preparation Guide

1. Place your raw image files (.jpg, .png, .webp) inside their respective folders under `ml/dataset/raw/<class_name>/`:
   * `ml/dataset/raw/Garbage_Waste/`
   * `ml/dataset/raw/Road_Damage/`
   * `ml/dataset/raw/Water_Issue/`
   * `ml/dataset/raw/Streetlights/`
   * `ml/dataset/raw/Drainage_Sewerage/`
   * `ml/dataset/raw/Public_Toilet_Issue/`
   * `ml/dataset/raw/Non_Civic/`

2. Run the automated data preparation script:
```bash
python ml/src/prepare_dataset.py
```

### What `prepare_dataset.py` does:
* **Format & Integrity Check**: Opens and verifies every image using PIL, rejecting corrupted files.
* **SHA-256 Deduplication**: Calculates file hashes to remove duplicates and prevent train/test leakage.
* **Stratified Splitting**: Splits clean unique images into **70% Train**, **15% Validation**, and **15% Test**.
* **Imbalance Warning**: Emits warnings for classes with under 30 samples.
* **Reports**: Saves detailed statistics to `ml/reports/dataset_stats.json` & `.txt`.

---

## 🏋️ 6. Training the Model

Execute two-stage transfer learning:
```bash
python ml/src/train.py --epochs1 15 --epochs2 10 --batch-size 32
```

### Training Mechanics:
* **Stage 1 (Feature Extractor)**: Freezes backbone layers, trains new 7-class linear classifier head with AdamW (`lr=1e-3`).
* **Stage 2 (Fine-Tuning)**: Unfreezes top 4 feature blocks with reduced learning rate (`lr=1e-4`).
* **Data Augmentation**: `RandomResizedCrop(224)`, `RandomHorizontalFlip(0.5)`, `ColorJitter`, `RandomAffine`.
* **Early Stopping**: Monitors validation **Macro F1** (patience: 5 epochs) to avoid overfitting.
* **Saves Artifacts**:
  * Checkpoint: `ml/models/civivision_model.pth`
  * Metrics: `ml/models/metrics.json`
  * Loss & Accuracy Curves: `ml/reports/training_curves.png`

---

## 🧪 7. Evaluating on Test Set

Evaluate strictly against unseen images in `ml/dataset/test/`:
```bash
python ml/src/evaluate.py
```

Outputs generated:
* `ml/reports/classification_report.txt` (Accuracy, Macro Precision, Recall, F1 per class)
* `ml/reports/confusion_matrix.png` (Visual matrix highlighting misclassifications)

---

## 🚀 8. Running the FastAPI ML Microservice

Start the high-performance FastAPI server:
```bash
uvicorn ml.api:app --host 0.0.0.0 --port 8000 --reload
```

### Endpoints:
* **`GET /health`**: Health status, model loaded flag, active device (`cuda` or `cpu`), version.
* **`POST /predict`**: Accepts multipart image file (`file`), returns JSON prediction.
* **`POST /predict-json`**: Accepts base64 encoded JSON payload (`image`).

### Example API Response:
```json
{
  "success": true,
  "is_civic_issue": true,
  "category": "Road Damage",
  "raw_category": "Road_Damage",
  "confidence": 0.9142,
  "severity": null,
  "top_predictions": [
    {
      "category": "Road Damage",
      "raw_class": "Road_Damage",
      "confidence": 0.9142
    },
    {
      "category": "Drainage & Sewerage",
      "raw_class": "Drainage_Sewerage",
      "confidence": 0.0512
    },
    {
      "category": "Non-Civic / Invalid",
      "raw_class": "Non_Civic",
      "confidence": 0.0210
    }
  ],
  "needs_review": false,
  "model_version": "civivision-cv-v1",
  "device": "cpu"
}
```

---

## 🛠️ 9. CLI Single-Image Prediction

Run quick one-off testing on any image file:
```bash
python ml/src/predict.py path/to/sample_image.jpg --threshold 0.70
```

---

## 🧪 10. Running Test Suite

```bash
pytest ml/tests/test_ml.py -v
```

---

## 🔄 11. Retraining & Versioning Workflow

When new labelled municipal photos become available:
1. Copy new images into `ml/dataset/raw/<class_name>/`.
2. Run `python ml/src/prepare_dataset.py`.
3. Run `python ml/src/train.py`.
4. Run `python ml/src/evaluate.py`.
5. If Macro F1 improves, increment the version in `ml/models/model_config.json` (e.g. `civivision-cv-v2`) and restart FastAPI.

---

## ⚠️ 12. Model Limitations & Best Practices

1. **Dataset Sensitivity**: The model's real-world accuracy is directly proportional to dataset diversity (lighting, camera angles, weather).
2. **Multiple Defects**: In images containing multiple civic defects (e.g. garbage floating in a clogged drain), the model outputs the dominant class; inspect `top_predictions` for secondary hazards.
3. **Severity Assessment**: Severity is returned as `null` by default until a dedicated, labelled multi-level severity dataset is trained.
4. **Non-Civic Rejection**: The `Non_Civic` class prevents false complaints; any prediction below the `ML_CONFIDENCE_THRESHOLD` flags `needs_review=true` for municipal officer verification.
