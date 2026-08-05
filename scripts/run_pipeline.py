import os
import sys

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.predict import BrainTumorPredictor

MODEL_PATH = "models/cnn_model.keras"

IMAGE_PATH = "dataset/Testing/glioma/Te-gl_0010.jpg"
# Change this image whenever you want.

predictor = BrainTumorPredictor(MODEL_PATH)

prediction, confidence, probabilities = predictor.predict(IMAGE_PATH)

print("\nPrediction")
print("-" * 40)
print(prediction)
print(confidence)

print("\nProbabilities")
print("-" * 40)

for label, value in probabilities.items():
    print(f"{label:15} : {value:.2f}%")