import sys
import os

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.predict import BrainTumorPredictor

MODEL_PATH = "models/cnn_model.keras"

IMAGE_PATH = "dataset/Testing/glioma"

predictor = BrainTumorPredictor(MODEL_PATH)

import os

files = os.listdir(IMAGE_PATH)

image_file = os.path.join(
    IMAGE_PATH,
    files[0]
)

result = predictor.predict(image_file)

print("\nPrediction Result")

print("-"*50)

print(result["prediction"])

print(result["confidence"])

print()

print(result["probabilities"])