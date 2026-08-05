import os
import sys
import cv2

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from src.predict import BrainTumorPredictor
from src.morphology import MorphologyAnalyzer
from src.hybrid_model import HybridDecision

MODEL_PATH = "models/cnn_model.keras"

IMAGE_FOLDER = "dataset/Testing/glioma"

predictor = BrainTumorPredictor(MODEL_PATH)

image_name = os.listdir(IMAGE_FOLDER)[0]

image_path = os.path.join(
    IMAGE_FOLDER,
    image_name
)

prediction = predictor.predict(image_path)

image = cv2.imread(image_path)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

morph = MorphologyAnalyzer()

mask = morph.segment(image)

area = morph.tumor_area(mask)

count = morph.contour_count(mask)

hybrid = HybridDecision()

report = hybrid.analyze(
    prediction["prediction"],
    prediction["confidence"],
    count,
    area
)

print("\nHybrid Report")
print("="*40)

for k,v in report.items():
    print(f"{k}: {v}")