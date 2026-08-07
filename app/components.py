import streamlit as st
import pandas as pd


# =====================================================
# Prediction Card
# =====================================================

def prediction_card(prediction, confidence):

    st.subheader("CNN Prediction")

    col1, col2 = st.columns(2)

    with col1:

        st.success(prediction.capitalize())

    with col2:

        st.metric(
            "Confidence",
            f"{confidence:.2f}%"
        )


# =====================================================
# Probability Table
# =====================================================

def probability_table(probabilities):

    st.subheader("Prediction Probabilities")

    df = pd.DataFrame({

        "Tumor Type":[
            i.capitalize()
            for i in probabilities.keys()
        ],

        "Probability (%)":[
            j
            for j in probabilities.values()
        ]

    })

    st.table(
        df.set_index("Tumor Type")
    )


# =====================================================
# CNN Metrics
# =====================================================
import os

def cnn_metrics():

    st.subheader("CNN Performance")

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric("Accuracy", "88.06%")

    with c2:
        st.metric("Precision", "88.39%")

    with c3:
        st.metric("Recall", "88.06%")

    with c4:
        st.metric("F1 Score", "87.77%")

    st.markdown("---")

    st.subheader("CNN Confusion Matrix")

    image_path = "outputs/confusion_matrix/cnn_confusion_matrix.png"

    if os.path.exists(image_path):
        st.image(
            image_path,
            caption="CNN Confusion Matrix",
            use_container_width=True
        )
    else:
        st.warning("Confusion Matrix not found.")
# =====================================================
# Morphology Placeholder
# =====================================================

def morphology_placeholder():

    st.subheader("Morphology Analysis")

    st.info(
        "Will be enabled after Morphology training."
    )


# =====================================================
# Hybrid Placeholder
# =====================================================

def hybrid_placeholder():

    st.subheader("Hybrid Prediction")

    st.info(
        "Will be enabled after Hybrid Model training."
    )