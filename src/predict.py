import os
import numpy as np

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

from src.brain_validator import BrainValidator


class BrainTumorPredictor:

    def __init__(self, model_path):

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found: {model_path}"
            )

        self.model = load_model(model_path)

        self.validator = BrainValidator()

        self.class_names = [
            "glioma",
            "meningioma",
            "notumor",
            "pituitary"
        ]

    # ===================================================
    # Image Preprocessing
    # ===================================================

    def preprocess_image(self, image_path):

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

    # ===================================================
    # Prediction
    # ===================================================

    def predict(self, image_path):

        validation = self.validator.validate(
            image_path
        )

        print("\n========== Brain Validator ==========")
        print(validation)
        print("=====================================\n")

        # -----------------------------------------------
        # Reject Non-Brain Images
        # -----------------------------------------------

        if not validation["is_brain"]:

            return {

                "valid_brain": False,

                "message": "Uploaded image is NOT a valid Brain MRI.",

                "distance": validation["distance"],

                "threshold": validation["threshold"],

                "closest_class": validation["closest_class"]

            }

        # -----------------------------------------------
        # CNN Prediction
        # -----------------------------------------------

        img = self.preprocess_image(
            image_path
        )

        prediction = self.model.predict(
            img,
            verbose=0
        )

        predicted_index = np.argmax(
            prediction[0]
        )

        predicted_class = self.class_names[
            predicted_index
        ]

        confidence = float(
            prediction[0][predicted_index] * 100
        )

        probabilities = {}

        for i, cls in enumerate(
            self.class_names
        ):

            probabilities[cls] = round(
                float(prediction[0][i] * 100),
                2
            )

        return {

            "valid_brain": True,

            "prediction": predicted_class,

            "confidence": round(
                confidence,
                2
            ),

            "probabilities": probabilities,

            "closest_class": validation["closest_class"],

            "distance": validation["distance"]

        }