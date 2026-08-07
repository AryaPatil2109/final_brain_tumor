import numpy as np
from tensorflow.keras.models import Model


class CNNFeatureExtractor:

    def __init__(self, model):

        self.model = Model(
            inputs=model.input,
            outputs=model.get_layer("global_average_pooling2d").output
        )

    def extract(self, image):

        features = self.model.predict(
            image,
            verbose=0
        )

        return features.flatten()