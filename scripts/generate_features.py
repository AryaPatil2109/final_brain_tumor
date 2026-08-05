import os
import sys
import cv2
import numpy as np

from tensorflow.keras.models import load_model

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.feature_extractor import CNNFeatureExtractor
from src.morphology import MorphologyAnalyzer

MODEL_PATH = "models/cnn_model.keras"

IMAGE_PATH = "dataset/Testing/glioma/Te-gl_90.jpg"

model = load_model(MODEL_PATH)

extractor = CNNFeatureExtractor(model)

morphology = MorphologyAnalyzer()

image = cv2.imread(IMAGE_PATH)

image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

resized = cv2.resize(image_rgb, (224,224))

cnn_input = resized.astype("float32") / 255.0

cnn_input = np.expand_dims(cnn_input, axis=0)

cnn_features = extractor.extract(cnn_input)

morph_features = morphology.extract_features(image_rgb)

print("="*50)

print("CNN Feature Vector Shape")

print(cnn_features.shape)

print("="*50)

print("Morphology Features")

print(morph_features)