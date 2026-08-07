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

    # Morphology Processing
    mask = morphology.segment(image)

    gradient = morphology.gradient(image)

    contour_image, _ = morphology.draw_contours(image)

    features = morphology.extract_features(image)

    st.subheader("Morphology Analysis")

    # ==================================================
    # Binary Mask & Gradient
    # ==================================================

    col1, col2 = st.columns(2)

    with col1:

        st.image(
            mask,
            caption="Binary Mask",
            use_container_width=True
        )

    with col2:

        st.image(
            gradient,
            caption="Morphological Gradient",
            use_container_width=True
        )

    st.markdown("---")

    # ==================================================
    # Contours
    # ==================================================

    st.image(
        contour_image,
        caption="Tumor Contours",
        use_container_width=True
    )

    st.markdown("---")

    # ==================================================
    # Morphological Features
    # ==================================================

    st.subheader("Morphological Features")

    c1, c2 = st.columns(2)

    with c1:

        st.metric(
            "Tumor Area",
            features["tumor_area"]
        )

        st.metric(
            "Contour Count",
            features["contour_count"]
        )

    with c2:

        st.metric(
            "Largest Contour Area",
            round(
                features["largest_contour_area"],
                2
            )
        )

        st.write("Bounding Box")

        st.write(
            features["bounding_box"]
        )