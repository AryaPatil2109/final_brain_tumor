"""
=========================================================
MRI Brain Tumor Classification Project
Configuration File
=========================================================
"""

from pathlib import Path

# =========================================================
# ROOT DIRECTORY
# =========================================================

ROOT_DIR = Path(__file__).resolve().parent.parent

# =========================================================
# DATASET
# =========================================================

DATASET_DIR = ROOT_DIR / "dataset"

TRAIN_DIR = DATASET_DIR / "Training"

TEST_DIR = DATASET_DIR / "Testing"

# =========================================================
# MODEL DIRECTORY
# =========================================================

MODEL_DIR = ROOT_DIR / "models"

CNN_MODEL = MODEL_DIR / "cnn_model.keras"

MORPH_MODEL = MODEL_DIR / "morphology_model.keras"

HYBRID_MODEL = MODEL_DIR / "hybrid_model.keras"

CLASS_NAMES_FILE = MODEL_DIR / "class_names.pkl"

# =========================================================
# OUTPUT DIRECTORY
# =========================================================

OUTPUT_DIR = ROOT_DIR / "outputs"

CNN_OUTPUT = OUTPUT_DIR / "cnn"

MORPH_OUTPUT = OUTPUT_DIR / "morphology"

HYBRID_OUTPUT = OUTPUT_DIR / "hybrid"

HEATMAP_DIR = OUTPUT_DIR / "heatmaps"

PREDICTION_DIR = OUTPUT_DIR / "predictions"

PLOT_DIR = OUTPUT_DIR / "plots"

REPORT_DIR = OUTPUT_DIR / "reports"

CONFUSION_MATRIX_DIR = OUTPUT_DIR / "confusion_matrix"

# =========================================================
# IMAGE PARAMETERS
# =========================================================

IMAGE_SIZE = (224, 224)

IMG_HEIGHT = 224

IMG_WIDTH = 224

CHANNELS = 3

# =========================================================
# TRAINING PARAMETERS
# =========================================================

BATCH_SIZE = 32

EPOCHS = 35

LEARNING_RATE = 1e-4

VALIDATION_SPLIT = 0.20

RANDOM_STATE = 42

# =========================================================
# CLASSES
# =========================================================

CLASS_NAMES = [

    "glioma",

    "meningioma",

    "pituitary",

    "notumor"

]

NUM_CLASSES = len(CLASS_NAMES)

# =========================================================
# IMAGE TYPES
# =========================================================

IMAGE_EXTENSIONS = [

    ".jpg",

    ".jpeg",

    ".png"

]

# =========================================================
# CREATE PROJECT DIRECTORIES
# =========================================================

PROJECT_FOLDERS = [

    MODEL_DIR,

    OUTPUT_DIR,

    CNN_OUTPUT,

    MORPH_OUTPUT,

    HYBRID_OUTPUT,

    HEATMAP_DIR,

    PREDICTION_DIR,

    PLOT_DIR,

    REPORT_DIR,

    CONFUSION_MATRIX_DIR

]

for folder in PROJECT_FOLDERS:

    folder.mkdir(

        parents=True,

        exist_ok=True

    )

print("Configuration Loaded Successfully")