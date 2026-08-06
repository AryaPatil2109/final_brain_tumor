import os
import tempfile
import streamlit as st

from src.predict import BrainTumorPredictor
from src.gradcam import GradCAM

from components import (
    prediction_card,
    probability_table,
    cnn_metrics,
    hybrid_placeholder
)

from morphology_component import show_morphology


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

    # =====================================================
    # Save Uploaded Image
    # =====================================================

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".jpg"
    ) as tmp:

        tmp.write(uploaded_file.getbuffer())

        image_path = tmp.name

    # =====================================================
    # CNN Prediction
    # =====================================================

    result = predictor.predict(image_path)

    # =====================================================
    # Original MRI + Prediction
    # =====================================================

    col1, col2 = st.columns(2)

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

    # =====================================================
    # Prediction Probabilities
    # =====================================================

    probability_table(
        result["probabilities"]
    )

    st.markdown("---")

    # =====================================================
    # Grad-CAM
    # =====================================================

    st.subheader("Grad-CAM Heatmap")

    heatmap = gradcam.create_gradcam(
        image_path
    )

    st.image(
        heatmap,
        caption="Grad-CAM Heatmap",
        use_container_width=True
    )

    st.markdown("---")

    # =====================================================
    # CNN Metrics
    # =====================================================

    cnn_metrics()

    st.markdown("---")

    # =====================================================
    # Morphology Analysis
    # =====================================================

    show_morphology(image_path)

    st.markdown("---")

    # =====================================================
    # Hybrid Prediction
    # =====================================================

    hybrid_placeholder()

    st.markdown("---")

    # =====================================================
    # Final Diagnosis
    # =====================================================

    st.subheader("Final Diagnosis")

    st.info(
        "Hybrid Model training is pending. Final diagnosis will be displayed after the Hybrid Model is completed."
    )

    # =====================================================
    # Cleanup
    # =====================================================

    if os.path.exists(image_path):
        os.remove(image_path)