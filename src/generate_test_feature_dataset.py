import os
import cv2
import numpy as np

from tensorflow.keras.models import load_model

from src.feature_extractor import CNNFeatureExtractor
from src.morphology import MorphologyAnalyzer


# ==========================================================
# TEST FEATURE DATASET GENERATOR
# ==========================================================

class TestFeatureGenerator:

    def __init__(self, model_path):

        print()
        print("=" * 60)
        print("Loading Fine-Tuned CNN model...")
        print("=" * 60)

        # --------------------------------------------------
        # Check model exists
        # --------------------------------------------------

        if not os.path.exists(model_path):

            raise FileNotFoundError(
                f"CNN model not found: {model_path}"
            )

        # --------------------------------------------------
        # Load fine-tuned CNN
        # --------------------------------------------------

        self.model = load_model(
            model_path
        )

        # --------------------------------------------------
        # CNN feature extractor
        # --------------------------------------------------

        self.cnn = CNNFeatureExtractor(
            self.model
        )

        # --------------------------------------------------
        # Morphology analyzer
        # --------------------------------------------------

        self.morphology = MorphologyAnalyzer()

        print(
            "Fine-Tuned CNN model loaded successfully."
        )

        print()


    # ======================================================
    # PROCESS IMAGE
    # ======================================================

    def process_image(self, image_path):

        # --------------------------------------------------
        # Read image
        # --------------------------------------------------

        image = cv2.imread(
            image_path
        )

        if image is None:

            raise ValueError(
                f"Unable to read image: {image_path}"
            )

        # --------------------------------------------------
        # BGR → RGB
        # --------------------------------------------------

        image = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2RGB
        )

        # --------------------------------------------------
        # Resize for CNN
        # --------------------------------------------------

        resized = cv2.resize(
            image,
            (224, 224)
        )

        # --------------------------------------------------
        # Normalize CNN input
        # --------------------------------------------------

        cnn_input = (
            resized.astype("float32") / 255.0
        )

        cnn_input = np.expand_dims(
            cnn_input,
            axis=0
        )

        # --------------------------------------------------
        # CNN feature extraction
        # --------------------------------------------------

        cnn_features = self.cnn.extract(
            cnn_input
        )

        # --------------------------------------------------
        # Morphology feature extraction
        # --------------------------------------------------

        morphology = (
            self.morphology.extract_features(
                image
            )
        )

        # --------------------------------------------------
        # Bounding box
        # --------------------------------------------------

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

        # --------------------------------------------------
        # Convert morphology features
        # into numeric vector
        # --------------------------------------------------

        morphology_features = np.array(
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

        return (
            cnn_features,
            morphology_features
        )


# ==========================================================
# MAIN
# ==========================================================

def main():

    # ======================================================
    # PROJECT PATHS
    # ======================================================

    # IMPORTANT:
    # Use the SAME fine-tuned CNN that will be used
    # for the Hybrid V2 training features.

    MODEL_PATH = (
        "models/cnn_model_finetuned (2).keras"
    )

    # ------------------------------------------------------
    # Testing dataset
    # ------------------------------------------------------

    DATASET_DIR = (
        "dataset/Testing"
    )

    # ------------------------------------------------------
    # New output folders
    #
    # These DO NOT overwrite your old Hybrid V1 features.
    # ------------------------------------------------------

    CNN_OUTPUT_DIR = (
        "features/test_cnn_features_finetuned"
    )

    MORPH_OUTPUT_DIR = (
        "features/test_morphology_features_finetuned"
    )


    # ======================================================
    # CHECK DATASET
    # ======================================================

    if not os.path.exists(DATASET_DIR):

        raise FileNotFoundError(
            f"Testing dataset not found: {DATASET_DIR}"
        )


    # ======================================================
    # CREATE OUTPUT DIRECTORIES
    # ======================================================

    os.makedirs(
        CNN_OUTPUT_DIR,
        exist_ok=True
    )

    os.makedirs(
        MORPH_OUTPUT_DIR,
        exist_ok=True
    )


    # ======================================================
    # CLASS NAMES
    # ======================================================

    class_names = [
        "glioma",
        "meningioma",
        "notumor",
        "pituitary"
    ]


    # ======================================================
    # INITIALIZE GENERATOR
    # ======================================================

    generator = TestFeatureGenerator(
        MODEL_PATH
    )


    # ======================================================
    # STORAGE
    # ======================================================

    all_cnn_features = []

    all_morphology_features = []

    all_labels = []

    all_image_paths = []


    # ======================================================
    # PROCESS EACH CLASS
    # ======================================================

    for class_index, class_name in enumerate(
        class_names
    ):

        class_dir = os.path.join(
            DATASET_DIR,
            class_name
        )

        # --------------------------------------------------
        # Check class folder
        # --------------------------------------------------

        if not os.path.exists(class_dir):

            raise FileNotFoundError(
                f"Dataset folder not found: {class_dir}"
            )


        # --------------------------------------------------
        # Find images
        # --------------------------------------------------

        image_files = [
            f
            for f in os.listdir(class_dir)
            if f.lower().endswith(
                (
                    ".jpg",
                    ".jpeg",
                    ".png"
                )
            )
        ]

        image_files.sort()


        # --------------------------------------------------
        # Processing information
        # --------------------------------------------------

        print()
        print("=" * 60)

        print(
            f"Processing TEST class: {class_name}"
        )

        print(
            f"Class index: {class_index}"
        )

        print(
            f"Images found: {len(image_files)}"
        )

        print("=" * 60)


        # --------------------------------------------------
        # Process images
        # --------------------------------------------------

        for count, filename in enumerate(
            image_files,
            start=1
        ):

            image_path = os.path.join(
                class_dir,
                filename
            )

            try:

                (
                    cnn_features,
                    morphology_features
                ) = generator.process_image(
                    image_path
                )


                # ------------------------------------------
                # Store CNN features
                # ------------------------------------------

                all_cnn_features.append(
                    cnn_features
                )


                # ------------------------------------------
                # Store morphology features
                # ------------------------------------------

                all_morphology_features.append(
                    morphology_features
                )


                # ------------------------------------------
                # Store label
                # ------------------------------------------

                all_labels.append(
                    class_index
                )


                # ------------------------------------------
                # Store image path
                # ------------------------------------------

                all_image_paths.append(
                    image_path
                )


                # ------------------------------------------
                # Progress
                # ------------------------------------------

                if count % 100 == 0:

                    print(
                        f"Processed "
                        f"{count}/{len(image_files)}"
                    )


            except Exception as e:

                print()
                print(
                    f"ERROR processing: {image_path}"
                )

                print(
                    f"Reason: {e}"
                )


    # ======================================================
    # CONVERT TO NUMPY ARRAYS
    # ======================================================

    cnn_features = np.array(
        all_cnn_features,
        dtype="float32"
    )

    morphology_features = np.array(
        all_morphology_features,
        dtype="float32"
    )

    labels = np.array(
        all_labels,
        dtype="int64"
    )

    image_paths = np.array(
        all_image_paths
    )


    # ======================================================
    # PRINT FINAL SHAPES
    # ======================================================

    print()
    print("=" * 60)

    print(
        "Test CNN Feature Shape:",
        cnn_features.shape
    )

    print(
        "Test Morphology Feature Shape:",
        morphology_features.shape
    )

    print(
        "Test Labels Shape:",
        labels.shape
    )

    print(
        "Test Image Paths Shape:",
        image_paths.shape
    )

    print(
        "Total test images:",
        len(labels)
    )

    print("=" * 60)


    # ======================================================
    # SAVE CNN FEATURES
    # ======================================================

    np.save(
        os.path.join(
            CNN_OUTPUT_DIR,
            "cnn_features.npy"
        ),
        cnn_features
    )

    np.save(
        os.path.join(
            CNN_OUTPUT_DIR,
            "labels.npy"
        ),
        labels
    )

    np.save(
        os.path.join(
            CNN_OUTPUT_DIR,
            "image_paths.npy"
        ),
        image_paths
    )


    # ======================================================
    # SAVE MORPHOLOGY FEATURES
    # ======================================================

    np.save(
        os.path.join(
            MORPH_OUTPUT_DIR,
            "morphology_features.npy"
        ),
        morphology_features
    )

    np.save(
        os.path.join(
            MORPH_OUTPUT_DIR,
            "labels.npy"
        ),
        labels
    )

    np.save(
        os.path.join(
            MORPH_OUTPUT_DIR,
            "image_paths.npy"
        ),
        image_paths
    )


    # ======================================================
    # FINAL MESSAGE
    # ======================================================

    print()
    print("=" * 60)

    print(
        "TEST FEATURE DATASET GENERATED SUCCESSFULLY"
    )

    print("=" * 60)

    print()

    print(
        "Fine-tuned CNN test features saved to:"
    )

    print(
        CNN_OUTPUT_DIR
    )

    print()

    print(
        "Morphology test features saved to:"
    )

    print(
        MORPH_OUTPUT_DIR
    )

    print()

    print(
        f"Total test images processed: {len(labels)}"
    )

    print()

    print("=" * 60)


# ==========================================================
# RUN
# ==========================================================

if __name__ == "__main__":

    main()