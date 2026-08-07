import pickle
import numpy as np

from scipy.spatial.distance import cosine

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

from src.feature_extractor import CNNFeatureExtractor


class BrainValidator:

    def __init__(
        self,
        model_path="models/cnn_model.keras",
        centers_path="models/brain_centers.pkl"
    ):

        self.cnn = load_model(model_path)

        self.extractor = CNNFeatureExtractor(self.cnn)

        with open(centers_path, "rb") as f:

            data = pickle.load(f)

        self.centers = data["centers"]

        self.thresholds = data["thresholds"]


    def preprocess(self, image_path):

        img = image.load_img(
            image_path,
            target_size=(224, 224)
        )

        img = image.img_to_array(img)

        img = img.astype("float32") / 255.0

        img = np.expand_dims(
            img,
            axis=0
        )

        return img


    def validate(self, image_path):

        img = self.preprocess(image_path)

        feature = self.extractor.extract(img)

        best_class = None

        best_distance = 999

        for cls in self.centers:

            distance = cosine(
                feature,
                self.centers[cls]
            )

            if distance < best_distance:

                best_distance = distance

                best_class = cls

        threshold = self.thresholds[best_class]

        is_brain = best_distance <= threshold

        return {

            "is_brain": is_brain,

            "closest_class": best_class,

            "distance": round(best_distance, 6),

            "threshold": round(threshold, 6)

        }