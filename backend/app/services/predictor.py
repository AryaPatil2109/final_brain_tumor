import numpy as np
import cv2

from pathlib import Path
from typing import Any

from src.predict import BrainTumorPredictor
from src.hybrid_predictor import HybridPredictor
from src.gradcam import GradCAM


def make_json_safe(value):
    """
    Convert NumPy values returned by the ML pipeline
    into normal Python values that FastAPI can serialize.
    """

    if isinstance(value, dict):
        return {
            key: make_json_safe(val)
            for key, val in value.items()
        }

    if isinstance(value, (list, tuple)):
        return [
            make_json_safe(item)
            for item in value
        ]

    if isinstance(value, np.ndarray):
        return value.tolist()

    if isinstance(value, np.generic):
        return value.item()

    return value


class BrainTumorMLService:
    """
    Adapter between the existing ML pipeline and FastAPI.

    This class coordinates the existing:

    - Brain validation
    - CNN prediction
    - Morphology extraction
    - Hybrid V2 prediction
    - Grad-CAM

    The existing ML files inside src/ are not modified.
    """

    def __init__(self):

        print("========================================")
        print("Initializing Brain Tumor ML Service")
        print("========================================")

        # -------------------------------------------------
        # Existing CNN predictor + brain validation
        # -------------------------------------------------

        self.cnn_predictor = BrainTumorPredictor(
            model_path="models/cnn_model_finetuned (2).keras"
        )

        print("CNN predictor loaded.")

        # -------------------------------------------------
        # Existing Hybrid V2 predictor (sharing the preloaded CNN model)
        # -------------------------------------------------

        self.hybrid_predictor = HybridPredictor(
            hybrid_model_path="models/hybrid_model_v2.keras",
            cnn_model_path=self.cnn_predictor.model,
            cnn_scaler_path="models/cnn_feature_scaler.pkl",
            morph_scaler_path="models/morphology_feature_scaler.pkl",
        )

        print("Hybrid predictor loaded.")

        # -------------------------------------------------
        # Existing Grad-CAM
        # -------------------------------------------------

        self.gradcam = GradCAM(
            self.hybrid_predictor.cnn_model,
            last_conv_layer="out_relu",
        )

        print("Grad-CAM initialized.")

        print("========================================")
        print("ML Service initialized successfully")
        print("========================================")

    # =====================================================
    # Prediction
    # =====================================================

    def predict(self, image_path: str) -> dict[str, Any]:

        image_path = str(
            Path(image_path)
        )

        # -------------------------------------------------
        # 1. Brain validation + CNN prediction
        # -------------------------------------------------

        cnn_result = self.cnn_predictor.predict(
            image_path
        )

        # -------------------------------------------------
        # 2. Invalid/non-brain image
        # -------------------------------------------------

        if not cnn_result["valid_brain"]:

            result = {
                "valid_brain": False,

                "message": cnn_result.get(
                    "message",
                    "The uploaded image is not a valid brain MRI."
                ),

                "validation": {
                    "closest_class": cnn_result.get(
                        "closest_class"
                    ),

                    "distance": cnn_result.get(
                        "distance"
                    ),

                    "threshold": cnn_result.get(
                        "threshold"
                    ),
                },
            }

            return make_json_safe(result)

        # -------------------------------------------------
        # 3. Hybrid V2 prediction
        # -------------------------------------------------

        hybrid_result = self.hybrid_predictor.predict(
            image_path
        )

        # -------------------------------------------------
        # 4. Combine CNN + Hybrid + Morphology results
        # -------------------------------------------------

        result = {
            "valid_brain": True,

            # Final Hybrid V2 prediction
            "prediction": hybrid_result.get(
                "prediction"
            ),

            # Final Hybrid V2 confidence
            "confidence": hybrid_result.get(
                "confidence"
            ),

            # Hybrid V2 class probabilities
            "probabilities": hybrid_result.get(
                "probabilities"
            ),

            # -------------------------------------------------
            # CNN information
            # -------------------------------------------------

            "cnn": {
                "prediction": cnn_result.get(
                    "prediction"
                ),

                "confidence": cnn_result.get(
                    "confidence"
                ),

                "probabilities": cnn_result.get(
                    "probabilities"
                ),
            },

            # -------------------------------------------------
            # Brain validation information
            # -------------------------------------------------

            "validation": {
                "closest_class": cnn_result.get(
                    "closest_class"
                ),

                "distance": cnn_result.get(
                    "distance"
                ),
            },

            # -------------------------------------------------
            # Morphology information
            # -------------------------------------------------

            "morphology": hybrid_result.get(
                "morphology"
            ),
        }

        # -------------------------------------------------
        # 5. Convert NumPy values to JSON-safe values
        # -------------------------------------------------

        return make_json_safe(result)

    # =====================================================
    # Grad-CAM
    # =====================================================

    def generate_gradcam(
        self,
        image_path: str,
        output_path: str,
    ) -> str:

        # Generate Grad-CAM overlay
        overlay = self.gradcam.create_gradcam(
            image_path
        )

        # GradCAM returns RGB.
        # OpenCV expects BGR when saving.
        overlay_bgr = cv2.cvtColor(
            overlay,
            cv2.COLOR_RGB2BGR,
        )

        # Save the generated Grad-CAM image
        success = cv2.imwrite(
            output_path,
            overlay_bgr,
        )

        if not success:
            raise RuntimeError(
                f"Failed to save Grad-CAM image: {output_path}"
            )

        return output_path