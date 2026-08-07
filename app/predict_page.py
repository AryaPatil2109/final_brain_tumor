import os
import tempfile

import streamlit as st

from src.predict import BrainTumorPredictor
from src.gradcam import GradCAM

from components import (
    prediction_card,
    probability_table,
    cnn_metrics,
)

from morphology_component import show_morphology


# ======================================================
# Load CNN Model
# ======================================================

MODEL_PATH = "models/cnn_model.keras"

predictor = BrainTumorPredictor(MODEL_PATH)

gradcam = GradCAM(predictor.model)


# ======================================================
# Prediction Page
# ======================================================

def show_predict_page():

    st.title("🧠 Brain Tumor Dual Path Detection")

    st.markdown("---")

    uploaded_file = st.file_uploader(
        "Upload Brain MRI Image",
        type=["jpg", "jpeg", "png"]
    )

    if uploaded_file is None:
        st.info("Please upload a Brain MRI image.")
        return

    # ==================================================
    # Save Uploaded Image
    # ==================================================

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".jpg"
    ) as tmp:

        tmp.write(uploaded_file.getbuffer())
        image_path = tmp.name

    # ==================================================
    # Prediction
    # ==================================================

    result = predictor.predict(image_path)

    # ==================================================
    # Invalid Image
    # ==================================================

    if not result["valid_brain"]:

        st.subheader("Uploaded Image")

        st.image(
            image_path,
            width=350
        )

        st.error("❌ Invalid Image")

        st.warning(result["message"])

        st.write(f"Distance : {result['distance']}")

        st.write(f"Threshold : {result['threshold']}")

        st.info(
            "Please upload a valid Brain MRI image."
        )

        if os.path.exists(image_path):
            os.remove(image_path)

        return

    # ==================================================
    # Uploaded MRI
    # ==================================================

    st.subheader("Uploaded MRI Image")

    st.image(
        image_path,
        width=350
    )

    st.markdown("---")

    # ==================================================
    # Module Selection
    # ==================================================

    analysis_mode = st.selectbox(
        "Select Analysis Module",
        [
            "CNN Output",
            "Morphology Output",
            "Hybrid Output"
        ]
    )

    st.markdown("---")

    # ==================================================
    # CNN OUTPUT
    # ==================================================

    if analysis_mode == "CNN Output":

        st.header("CNN Analysis")

        prediction_card(
            result["prediction"],
            result["confidence"]
        )

        st.markdown("---")

        probability_table(
            result["probabilities"]
        )

        st.markdown("---")

        st.subheader("Grad-CAM Heatmap")

        heatmap = gradcam.create_gradcam(
            image_path
        )

        st.image(
            heatmap,
            use_container_width=True
        )

        st.markdown("---")

        cnn_metrics()

    # ==================================================
    # MORPHOLOGY
    # ==================================================

    elif analysis_mode == "Morphology Output":

        st.header("Morphological Analysis")

        show_morphology(image_path)

    # ==================================================
    # HYBRID
    # ==================================================

    else:

        st.header("Hybrid Model")

        st.info(
            "Hybrid model training is still in progress."
        )

        st.metric(
            "Current CNN Prediction",
            result["prediction"]
        )

        st.metric(
            "Confidence",
            f"{result['confidence']}%"
        )

        st.warning(
            "Hybrid prediction will be available after Hybrid model training."
        )

        st.markdown("---")

        st.subheader("Final Diagnosis")

        st.success(
            f"""
### Prediction : {result['prediction'].upper()}

**Confidence : {result['confidence']}%**

**Current Decision Source : CNN Model**
"""
        )

    # ==================================================
    # Cleanup
    # ==================================================

    if os.path.exists(image_path):
        os.remove(image_path)