import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image


class BrainTumorPredictor:

    def __init__(self, model_path):

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found: {model_path}"
            )

        self.model = load_model(model_path)

        self.class_names = [
            "glioma",
            "meningioma",
            "notumor",
            "pituitary"
        ]


    def preprocess_image(self, image_path):

        img = image.load_img(
            image_path,
            target_size=(224,224)
        )

        img_array = image.img_to_array(img)

        img_array = img_array.astype("float32")

        img_array /= 255.0

        img_array = np.expand_dims(
            img_array,
            axis=0
        )

        return img_array


    def predict(self, image_path):

        img = self.preprocess_image(image_path)

        prediction = self.model.predict(
            img,
            verbose=0
        )

        predicted_index = np.argmax(prediction)

        predicted_class = self.class_names[predicted_index]

        confidence = float(
            prediction[0][predicted_index] * 100
        )

        probabilities = {}

        for i, label in enumerate(self.class_names):

            probabilities[label] = round(
                float(prediction[0][i] * 100),
                2
            )

        return {

            "prediction": predicted_class,

            "confidence": round(confidence,2),

            "probabilities": probabilities

        }