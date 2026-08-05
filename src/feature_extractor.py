import numpy as np
from tensorflow.keras.models import Model


class CNNFeatureExtractor:

    def __init__(self, model):

        self.model = Model(
            inputs=model.input,
            outputs=model.layers[-2].output
        )

    def extract(self, image):

        features = self.model.predict(
            image,
            verbose=0
        )

        return features.flatten()