import os
import tempfile

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt

from src.predict import BrainTumorPredictor
from src.gradcam import GradCAM
from src.hybrid_predictor import HybridPredictor

from components import (
    prediction_card,
    cnn_metrics,
)

from morphology_component import show_morphology


# ======================================================
# MODEL PATHS
# ======================================================

# ------------------------------------------------------
# CNN MODEL
# ------------------------------------------------------

MODEL_PATH = (
    "models/cnn_model.keras"
)


# ------------------------------------------------------
# FINAL HYBRID MODEL - V2
# ------------------------------------------------------

HYBRID_MODEL_PATH = (
    "models/hybrid_model_v2.keras"
)


# ------------------------------------------------------
# CNN FEATURE MODEL
# ------------------------------------------------------

CNN_FEATURE_MODEL_PATH = (
    "models/cnn_model_finetuned (2).keras"
)


# ------------------------------------------------------
# CNN FEATURE SCALER
# ------------------------------------------------------

CNN_FEATURE_SCALER_PATH = (
    "models/cnn_feature_scaler.pkl"
)


# ------------------------------------------------------
# MORPHOLOGY SCALER
# ------------------------------------------------------

MORPH_FEATURE_SCALER_PATH = (
    "models/morphology_feature_scaler.pkl"
)


# ======================================================
# FINAL MODEL PERFORMANCE
# ======================================================

# Final selected model = Hybrid V2

CNN_TEST_ACCURACY = 88.06

HYBRID_V2_ACCURACY = 93.00
HYBRID_V2_PRECISION = 93.39
HYBRID_V2_RECALL = 93.00
HYBRID_V2_F1 = 92.85


# ======================================================
# HYBRID V3 CONFUSION MATRIX
# ======================================================

# V3 is NOT the final selected model.
# This matrix is displayed only for model analysis.

HYBRID_V3_CONFUSION_MATRIX = np.array([
    [309, 69, 17, 5],
    [6, 382, 4, 8],
    [0, 1, 399, 0],
    [2, 3, 0, 395]
])

CLASS_NAMES = [
    "glioma",
    "meningioma",
    "notumor",
    "pituitary"
]


# ======================================================
# IMPROVEMENT OVER ORIGINAL CNN
# ======================================================

HYBRID_IMPROVEMENT = (
    HYBRID_V2_ACCURACY
    - CNN_TEST_ACCURACY
)


# ======================================================
# LOAD CNN MODEL
# ======================================================

predictor = BrainTumorPredictor(
    MODEL_PATH
)


# ======================================================
# LOAD GRAD-CAM
# ======================================================

gradcam = GradCAM(
    predictor.model
)


# ======================================================
# LOAD FINAL HYBRID MODEL
# ======================================================

hybrid_predictor = HybridPredictor(
    hybrid_model_path=HYBRID_MODEL_PATH,
    cnn_model_path=CNN_FEATURE_MODEL_PATH,
    cnn_scaler_path=CNN_FEATURE_SCALER_PATH,
    morph_scaler_path=MORPH_FEATURE_SCALER_PATH
)


# ======================================================
# PREDICTION PAGE
# ======================================================

def show_predict_page():

    # ==================================================
    # PAGE TITLE
    # ==================================================

    st.title(
        "🧠 Brain Tumor Dual Path Detection"
    )

    st.markdown("---")


    # ==================================================
    # IMAGE UPLOAD
    # ==================================================

    uploaded_file = st.file_uploader(
        "Upload Brain MRI Image",
        type=[
            "jpg",
            "jpeg",
            "png"
        ]
    )


    # ==================================================
    # NO IMAGE
    # ==================================================

    if uploaded_file is None:

        st.info(
            "Please upload a Brain MRI image."
        )

        return


    # ==================================================
    # TEMPORARY IMAGE
    # ==================================================

    image_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as tmp:

            tmp.write(
                uploaded_file.getbuffer()
            )

            image_path = tmp.name


        # ==================================================
        # CNN PREDICTION + BRAIN VALIDATION
        # ==================================================

        result = predictor.predict(
            image_path
        )


        # ==================================================
        # INVALID IMAGE
        # ==================================================

        if not result["valid_brain"]:

            st.subheader(
                "Uploaded Image"
            )

            st.image(
                image_path,
                width=350
            )

            st.error(
                "❌ Invalid Image"
            )

            st.warning(
                result["message"]
            )

            st.write(
                f"Distance : "
                f"{result['distance']}"
            )

            st.write(
                f"Threshold : "
                f"{result['threshold']}"
            )

            st.info(
                "Please upload a valid Brain MRI image."
            )

            return


        # ==================================================
        # VALID MRI IMAGE
        # ==================================================

        st.subheader(
            "Uploaded MRI Image"
        )

        st.image(
            image_path,
            width=350
        )

        st.markdown("---")


        # ==================================================
        # MODULE SELECTION
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

            st.header(
                "CNN Analysis"
            )


            # ----------------------------------------------
            # CNN PREDICTION
            # ----------------------------------------------

            prediction_card(
                result["prediction"],
                result["confidence"]
            )

            st.markdown("---")


            # ----------------------------------------------
            # GRAD-CAM
            # ----------------------------------------------

            st.subheader(
                "Grad-CAM Heatmap"
            )

            heatmap = gradcam.create_gradcam(
                image_path
            )

            st.image(
                heatmap,
                width="stretch"
            )

            st.markdown("---")


            # ----------------------------------------------
            # CNN PERFORMANCE
            # ----------------------------------------------

            cnn_metrics()


            # ----------------------------------------------
            # CNN TEST ACCURACY
            # ----------------------------------------------

            st.markdown("---")

            st.subheader(
                "CNN Model Performance"
            )

            st.metric(
                "CNN Test Accuracy",
                f"{CNN_TEST_ACCURACY:.2f}%"
            )

            st.caption(
                "Original CNN model performance "
                "on the independent test set."
            )


        # ==================================================
        # MORPHOLOGY OUTPUT
        # ==================================================

        elif analysis_mode == "Morphology Output":

            st.header(
                "Morphological Analysis"
            )

            show_morphology(
                image_path
            )


        # ==================================================
        # HYBRID OUTPUT
        # ==================================================

        else:

            st.header(
                "Hybrid CNN + Morphology Analysis"
            )

            st.info(
                "The final Hybrid V2 model combines "
                "deep CNN features with morphological "
                "features."
            )


            # ==================================================
            # RUN HYBRID PREDICTION
            # ==================================================

            try:

                hybrid_result = (
                    hybrid_predictor.predict(
                        image_path
                    )
                )


                # ==================================================
                # FINAL HYBRID PREDICTION
                # ==================================================

                st.subheader(
                    "Final Hybrid Prediction"
                )

                prediction_card(
                    hybrid_result[
                        "prediction"
                    ],
                    hybrid_result[
                        "confidence"
                    ]
                )


                # ==================================================
                # FINAL HYBRID MODEL PERFORMANCE - V2
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "Hybrid V2 Model Performance"
                )


                # --------------------------------------------------
                # FOUR PERFORMANCE METRICS
                # --------------------------------------------------

                col1, col2, col3, col4 = (
                    st.columns(4)
                )


                with col1:

                    st.metric(
                        "Test Accuracy",
                        f"{HYBRID_V2_ACCURACY:.2f}%"
                    )


                with col2:

                    st.metric(
                        "Precision",
                        f"{HYBRID_V2_PRECISION:.2f}%"
                    )


                with col3:

                    st.metric(
                        "Recall",
                        f"{HYBRID_V2_RECALL:.2f}%"
                    )


                with col4:

                    st.metric(
                        "F1-Score",
                        f"{HYBRID_V2_F1:.2f}%"
                    )


                st.caption(
                    "Performance of the final Hybrid V2 "
                    "model on the independent test set."
                )


                # ==================================================
                # FINAL DIAGNOSIS
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "Final Diagnosis"
                )


                final_prediction = (
                    hybrid_result[
                        "prediction"
                    ]
                )


                final_confidence = (
                    hybrid_result[
                        "confidence"
                    ]
                )


                if (
                    final_prediction.lower()
                    == "notumor"
                ):

                    st.success(
                        f"""
### ✅ No Tumor Detected

**Prediction:** NO TUMOR

**Confidence:** {final_confidence}%

**Decision Source:** Final Hybrid V2 CNN + Morphology Model
"""
                    )

                else:

                    st.warning(
                        f"""
### ⚠️ Tumor Class Detected

**Prediction:** {final_prediction.upper()}

**Confidence:** {final_confidence}%

**Decision Source:** Final Hybrid V2 CNN + Morphology Model
"""
                    )


                # ==================================================
                # HYBRID V3 CONFUSION MATRIX
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "Hybrid V3 Confusion Matrix"
                )

                st.caption(
                    "Confusion matrix from the independent "
                    "Hybrid V3 test set. V2 remains the "
                    "selected final model."
                )


                # --------------------------------------------------
                # CREATE CONFUSION MATRIX
                # --------------------------------------------------

                fig, ax = plt.subplots(
                    figsize=(8, 6)
                )


                im = ax.imshow(
                    HYBRID_V3_CONFUSION_MATRIX,
                    cmap="viridis"
                )


                # --------------------------------------------------
                # AXIS LABELS
                # --------------------------------------------------

                ax.set_xticks(
                    np.arange(
                        len(CLASS_NAMES)
                    )
                )

                ax.set_yticks(
                    np.arange(
                        len(CLASS_NAMES)
                    )
                )

                ax.set_xticklabels(
                    CLASS_NAMES
                )

                ax.set_yticklabels(
                    CLASS_NAMES
                )


                ax.set_xlabel(
                    "Predicted Label"
                )

                ax.set_ylabel(
                    "True Label"
                )

                ax.set_title(
                    "Hybrid V3 CNN + Morphology Confusion Matrix"
                )


                # --------------------------------------------------
                # DISPLAY MATRIX VALUES
                # --------------------------------------------------

                for i in range(
                    HYBRID_V3_CONFUSION_MATRIX.shape[0]
                ):

                    for j in range(
                        HYBRID_V3_CONFUSION_MATRIX.shape[1]
                    ):

                        value = (
                            HYBRID_V3_CONFUSION_MATRIX[
                                i,
                                j
                            ]
                        )

                        ax.text(
                            j,
                            i,
                            str(value),
                            ha="center",
                            va="center",
                            color="white",
                            fontsize=12,
                            fontweight="bold"
                        )


                # --------------------------------------------------
                # COLOR BAR
                # --------------------------------------------------

                fig.colorbar(
                    im,
                    ax=ax
                )


                plt.tight_layout()


                st.pyplot(
                    fig,
                    width="stretch"
                )


                plt.close(fig)


                # ==================================================
                # V3 MATRIX INTERPRETATION
                # ==================================================

                st.caption(
                    "Rows represent the true tumor class and "
                    "columns represent the predicted class."
                )


                # ==================================================
                # MORPHOLOGICAL FEATURES
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "Morphological Features"
                )


                morphology = (
                    hybrid_result[
                        "morphology"
                    ]
                )


                col1, col2 = (
                    st.columns(2)
                )


                # ----------------------------------------------
                # LEFT COLUMN
                # ----------------------------------------------

                with col1:

                    st.metric(
                        "Tumor Area",
                        morphology[
                            "tumor_area"
                        ]
                    )


                    st.metric(
                        "Largest Contour Area",
                        round(
                            morphology[
                                "largest_contour_area"
                            ],
                            2
                        )
                    )


                # ----------------------------------------------
                # RIGHT COLUMN
                # ----------------------------------------------

                with col2:

                    st.metric(
                        "Contour Count",
                        morphology[
                            "contour_count"
                        ]
                    )


                    bounding_box = (
                        morphology[
                            "bounding_box"
                        ]
                    )


                    if (
                        bounding_box
                        is not None
                    ):

                        x, y, w, h = (
                            bounding_box
                        )


                        st.write(
                            f"Bounding Box: "
                            f"({x}, {y}, {w}, {h})"
                        )

                    else:

                        st.write(
                            "Bounding Box: None"
                        )


                # ==================================================
                # CNN VS HYBRID COMPARISON
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "CNN vs Hybrid Comparison"
                )


                col1, col2 = (
                    st.columns(2)
                )


                # ----------------------------------------------
                # CNN
                # ----------------------------------------------

                with col1:

                    st.markdown(
                        "### CNN Model"
                    )


                    st.write(
                        f"Prediction: "
                        f"**{result['prediction'].upper()}**"
                    )


                    st.write(
                        f"Confidence: "
                        f"**{result['confidence']}%**"
                    )


                    st.write(
                        "Test Accuracy: "
                        f"**{CNN_TEST_ACCURACY:.2f}%**"
                    )


                # ----------------------------------------------
                # HYBRID V2
                # ----------------------------------------------

                with col2:

                    st.markdown(
                        "### Final Hybrid V2"
                    )


                    st.write(
                        f"Prediction: "
                        f"**{final_prediction.upper()}**"
                    )


                    st.write(
                        f"Confidence: "
                        f"**{final_confidence}%**"
                    )


                    st.write(
                        "Test Accuracy: "
                        f"**{HYBRID_V2_ACCURACY:.2f}%**"
                    )


                # ==================================================
                # IMPROVEMENT
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "📈 Model Improvement"
                )


                st.success(
                    f"""
**CNN Test Accuracy:** {CNN_TEST_ACCURACY:.2f}%

**Final Hybrid V2 Test Accuracy:** {HYBRID_V2_ACCURACY:.2f}%

**Improvement:** +{HYBRID_IMPROVEMENT:.2f} percentage points
"""
                )


                # ==================================================
                # FINAL MODEL SUMMARY
                # ==================================================

                st.markdown("---")

                st.subheader(
                    "Final Model Summary"
                )


                summary_col1, summary_col2 = (
                    st.columns(2)
                )


                with summary_col1:

                    st.write(
                        "**Selected Final Model**"
                    )

                    st.success(
                        "Hybrid V2"
                    )


                with summary_col2:

                    st.write(
                        "**Architecture**"
                    )

                    st.info(
                        "CNN + Morphology"
                    )


                st.write(
                    "The final Hybrid V2 model was selected "
                    "based on its independent test performance. "
                    "Hybrid V3 is shown only for confusion-matrix "
                    "analysis and is not the selected final model."
                )


            # ==================================================
            # HYBRID ERROR
            # ==================================================

            except Exception as e:

                st.error(
                    "❌ Hybrid prediction failed."
                )

                st.exception(
                    e
                )


    # ==================================================
    # CLEANUP
    # ==================================================

    finally:

        if (
            image_path is not None
            and os.path.exists(
                image_path
            )
        ):

            os.remove(
                image_path
            )