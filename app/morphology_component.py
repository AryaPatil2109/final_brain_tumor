
import cv2
import streamlit as st

from src.morphology import MorphologyAnalyzer


morphology = MorphologyAnalyzer()


def show_morphology(image_path):

    image = cv2.imread(image_path)

    image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    mask = morphology.segment(image)

    contour_image, _ = morphology.draw_contours(image)

    features = morphology.extract_features(image)

    st.subheader("Morphology Analysis")

    col1, col2 = st.columns(2)

    with col1:

        st.image(
            mask,
            caption="Binary Mask",
            use_container_width=True
        )

    with col2:

        st.image(
            contour_image,
            caption="Tumor Contours",
            use_container_width=True
        )

    st.markdown("### Morphological Features")

    c1, c2 = st.columns(2)

    with c1:

        st.metric(
            "Tumor Area",
            features["tumor_area"]
        )

    with c2:

        st.metric(
            "Largest Contour Area",
            round(
                features["largest_contour_area"],
                2
            )
        )