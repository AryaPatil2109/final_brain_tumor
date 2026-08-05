import os
import sys
import cv2
import numpy as np

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from tensorflow.keras.models import load_model

from src.feature_extractor import FeatureExtractor

MODEL_PATH = "models/cnn_model.keras"

IMAGE_FOLDER = "dataset/Testing/glioma"

model = load_model(MODEL_PATH)

extractor = FeatureExtractor(model)

image_name = os.listdir(IMAGE_FOLDER)[0]

image_path = os.path.join(
    IMAGE_FOLDER,
    image_name
)

image = cv2.imread(image_path)

image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

image = cv2.resize(image, (224,224))

image = image.astype("float32") / 255.0

image = np.expand_dims(image, axis=0)

features = extractor.extract(image)

print(features.shape)
