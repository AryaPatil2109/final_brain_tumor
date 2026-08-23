import os
import cv2
import joblib
import numpy as np

from src.model_loader import load_keras_model

from src.feature_extractor import CNNFeatureExtractor
from src.morphology import MorphologyAnalyzer


class HybridPredictor:

    def __init__(
        self,
        hybrid_model_path="models/hybrid_model_v2.keras",
        cnn_model_path="models/cnn_model_finetuned (2).keras",
        cnn_scaler_path="models/cnn_feature_scaler.pkl",
        morph_scaler_path="models/morphology_feature_scaler.pkl"
    ):

        # ==================================================
        # CHECK FILES
        # ==================================================

        if not os.path.exists(hybrid_model_path):
            raise FileNotFoundError(
                f"Hybrid model not found: {hybrid_model_path}"
            )

        if not os.path.exists(cnn_model_path):
            raise FileNotFoundError(
                f"Fine-tuned CNN model not found: {cnn_model_path}"
            )

        if not os.path.exists(cnn_scaler_path):
            raise FileNotFoundError(
                f"CNN scaler not found: {cnn_scaler_path}"
            )

        if not os.path.exists(morph_scaler_path):
            raise FileNotFoundError(
                f"Morphology scaler not found: {morph_scaler_path}"
            )

        # ==================================================
        # LOAD HYBRID MODEL
        # ==================================================

        print("Loading Hybrid V2 model...")

        self.hybrid_model = load_keras_model(hybrid_model_path)

        print("Hybrid V2 model loaded.")

        # ==================================================
        # LOAD FINE-TUNED CNN
        # ==================================================

        print("Loading fine-tuned CNN model...")

        self.cnn_model = load_keras_model(cnn_model_path)

        print("Fine-tuned CNN loaded.")

        # ==================================================
        # CNN FEATURE EXTRACTOR
        # ==================================================

        self.cnn_extractor = CNNFeatureExtractor(
            self.cnn_model
        )

        # ==================================================
        # MORPHOLOGY ANALYZER
        # ==================================================

        self.morphology = MorphologyAnalyzer()

        # ==================================================
        # LOAD SCALERS
        # ==================================================

        print("Loading feature scalers...")

        self.cnn_scaler = joblib.load(
            cnn_scaler_path
        )

        self.morph_scaler = joblib.load(
            morph_scaler_path
        )

        print("Feature scalers loaded.")

        # ==================================================
        # CLASS NAMES
        # ==================================================

        self.class_names = [
            "glioma",
            "meningioma",
            "notumor",
            "pituitary"
        ]

        print(
            "Hybrid Predictor initialized successfully."
        )

    # ======================================================
    # READ IMAGE
    # ======================================================

    def load_image(
        self,
        image_path
    ):

        image = cv2.imread(
            image_path
        )

        if image is None:
            raise ValueError(
                f"Unable to read image: {image_path}"
            )

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        return image

    # ======================================================
    # CNN FEATURE EXTRACTION
    # ======================================================

    def extract_cnn_features(
        self,
        image
    ):

        resized = cv2.resize(
            image,
            (224, 224)
        )

        cnn_input = (
            resized.astype("float32") / 255.0
        )

        cnn_input = np.expand_dims(
            cnn_input,
            axis=0
        )

        features = self.cnn_extractor.extract(
            cnn_input
        )

        features = np.asarray(
            features,
            dtype="float32"
        )

        features = features.reshape(
            1,
            -1
        )

        return features

    # ======================================================
    # MORPHOLOGY FEATURE EXTRACTION
    # ======================================================

    def extract_morphology_features(
        self,
        image
    ):

        morphology = (
            self.morphology.extract_features(
                image
            )
        )

        bounding_box = morphology[
            "bounding_box"
        ]

        if bounding_box is None:

            x = 0
            y = 0
            w = 0
            h = 0

        else:

            x, y, w, h = bounding_box

        features = np.array(
            [
                morphology["tumor_area"],
                morphology["largest_contour_area"],
                morphology["contour_count"],
                x,
                y,
                w,
                h
            ],
            dtype="float32"
        )

        features = features.reshape(
            1,
            -1
        )

        return (
            features,
            morphology
        )

    # ======================================================
    # HYBRID PREDICTION
    # ======================================================

    def predict(
        self,
        image_path
    ):

        # --------------------------------------------------
        # Load image
        # --------------------------------------------------

        image = self.load_image(
            image_path
        )

        # --------------------------------------------------
        # CNN features
        # --------------------------------------------------

        cnn_features = (
            self.extract_cnn_features(
                image
            )
        )

        # --------------------------------------------------
        # Morphology features
        # --------------------------------------------------

        (
            morphology_features,
            morphology_data
        ) = self.extract_morphology_features(
            image
        )

        # --------------------------------------------------
        # Apply SAME scalers used during training
        # --------------------------------------------------

        cnn_scaled = (
            self.cnn_scaler.transform(
                cnn_features
            )
        )

        morphology_scaled = (
            self.morph_scaler.transform(
                morphology_features
            )
        )

        # --------------------------------------------------
        # Hybrid model prediction
        # --------------------------------------------------

        prediction = (
            self.hybrid_model.predict(
                [
                    cnn_scaled,
                    morphology_scaled
                ],
                verbose=0
            )
        )

        # --------------------------------------------------
        # Predicted class
        # --------------------------------------------------

        predicted_index = int(
            np.argmax(
                prediction[0]
            )
        )

        predicted_class = (
            self.class_names[
                predicted_index
            ]
        )

        # --------------------------------------------------
        # Confidence
        # --------------------------------------------------

        confidence = float(
            prediction[0][
                predicted_index
            ] * 100
        )

        # --------------------------------------------------
        # Probabilities
        # --------------------------------------------------

        probabilities = {}

        for i, class_name in enumerate(
            self.class_names
        ):

            probabilities[class_name] = round(
                float(
                    prediction[0][i] * 100
                ),
                2
            )

        # --------------------------------------------------
        # Return result
        # --------------------------------------------------

        return {

            "prediction":
                predicted_class,

            "confidence":
                round(
                    confidence,
                    2
                ),

            "probabilities":
                probabilities,

            "morphology":
                morphology_data
        }