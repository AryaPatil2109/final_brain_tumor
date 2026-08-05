import os
import tempfile
import streamlit as st

from src.predict import BrainTumorPredictor
from src.gradcam import GradCAM

from components import (
    prediction_card,
    probability_table,
    cnn_metrics,
    morphology_placeholder,
    hybrid_placeholder
)

# ======================================================
# Load CNN Model
# ======================================================

MODEL_PATH = "models/cnn_model.keras"

predictor = BrainTumorPredictor(MODEL_PATH)

gradcam = GradCAM(
    predictor.model
)


# ======================================================
# Prediction Page
# ======================================================

def show_predict_page():

    st.title("🧠 Brain Tumor Detection Dashboard")

    st.markdown("---")

    uploaded_file = st.file_uploader(
        "Upload Brain MRI Image",
        type=["jpg", "jpeg", "png"]
    )

    if uploaded_file is None:

        st.info("Please upload a Brain MRI image.")

        return

    # ---------------------------------------------------

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".jpg"
    ) as tmp:

        tmp.write(uploaded_file.getbuffer())

        image_path = tmp.name

    # ---------------------------------------------------

    result = predictor.predict(image_path)

    # ===================================================
    # Original Image + Prediction
    # ===================================================

    col1, col2 = st.columns([1,1])

    with col1:

        st.subheader("Original MRI")

        st.image(
            image_path,
            use_container_width=True
        )

    with col2:

        prediction_card(
            result["prediction"],
            result["confidence"]
        )

    st.markdown("---")

    # ===================================================
    # Probability Table
    # ===================================================

    probability_table(
        result["probabilities"]
    )

    st.markdown("---")

    # ===================================================
    # GradCAM
    # ===================================================

    st.subheader("Grad-CAM Heatmap")

    heatmap = gradcam.create_gradcam(
        image_path
    )

    st.image(
        heatmap,
        use_container_width=True
    )

    st.markdown("---")

    # ===================================================
    # CNN Metrics
    # ===================================================

    cnn_metrics()

    st.markdown("---")

    # ===================================================
    # Morphology
    # ===================================================

    morphology_placeholder()

    st.markdown("---")

    # ===================================================
    # Hybrid
    # ===================================================

    hybrid_placeholder()

    st.markdown("---")

    # ===================================================
    # Final Diagnosis
    # ===================================================

    st.subheader("Final Diagnosis")

    st.info(
        "Final diagnosis will be generated after the Hybrid Model is trained."
    )

    # ---------------------------------------------------

    os.remove(image_path)