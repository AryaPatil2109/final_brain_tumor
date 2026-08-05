import os
import cv2
import numpy as np
import pandas as pd

from tensorflow.keras.models import load_model

from src.feature_extractor import CNNFeatureExtractor
from src.morphology import MorphologyAnalyzer


class FeatureDatasetGenerator:

    def __init__(self, model_path):

        self.model = load_model(model_path)

        self.cnn = CNNFeatureExtractor(self.model)

        self.morphology = MorphologyAnalyzer()

    def process_image(self, image_path):

        image = cv2.imread(image_path)

        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        resized = cv2.resize(image, (224,224))

        cnn_input = resized.astype("float32")/255.0

        cnn_input = np.expand_dims(cnn_input, axis=0)

        cnn_features = self.cnn.extract(cnn_input)

        morphology = self.morphology.extract_features(image)

        return cnn_features, morphology