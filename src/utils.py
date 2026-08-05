"""
=========================================================
Utility Functions
MRI Brain Tumor Classification
=========================================================
"""

from pathlib import Path
import random
import cv2
import numpy as np

from src.config import *


# =====================================================
# Check Dataset Exists
# =====================================================

def check_dataset():

    if not TRAIN_DIR.exists():
        raise FileNotFoundError(f"Training folder not found:\n{TRAIN_DIR}")

    if not TEST_DIR.exists():
        raise FileNotFoundError(f"Testing folder not found:\n{TEST_DIR}")

    print("✅ Dataset Found")


# =====================================================
# Check Classes
# =====================================================

def check_classes():

    print("\nChecking Dataset Classes...\n")

    for cls in CLASS_NAMES:

        train = TRAIN_DIR / cls
        test = TEST_DIR / cls

        print(f"{cls}")

        print("Training :", train.exists())

        print("Testing  :", test.exists())

        print("-"*40)


# =====================================================
# Count Images
# =====================================================

def count_images(folder):

    total = 0

    for ext in IMAGE_EXTENSIONS:

        total += len(list(folder.glob(f"*{ext}")))

    return total


# =====================================================
# Dataset Summary
# =====================================================

def dataset_summary():

    print("\n========== DATASET SUMMARY ==========\n")

    train_total = 0
    test_total = 0

    for cls in CLASS_NAMES:

        train_count = count_images(TRAIN_DIR / cls)

        test_count = count_images(TEST_DIR / cls)

        train_total += train_count

        test_total += test_count

        print(f"{cls}")

        print(f"Training : {train_count}")

        print(f"Testing  : {test_count}")

        print()

    print("--------------------------------")

    print("Total Training :", train_total)

    print("Total Testing  :", test_total)


# =====================================================
# Get Random Image
# =====================================================

def random_image(class_name):

    folder = TRAIN_DIR / class_name

    images = []

    for ext in IMAGE_EXTENSIONS:

        images.extend(folder.glob(f"*{ext}"))

    return random.choice(images)


# =====================================================
# Read Image
# =====================================================

def read_image(image_path):
    """
    Read image safely even if the file path contains Unicode characters.
    """

    image_path = str(image_path)

    image = cv2.imdecode(
        np.fromfile(image_path, dtype=np.uint8),
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise Exception(f"Unable to read image:\n{image_path}")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    return image
# =====================================================
# Image Information
# =====================================================

def image_info(image):

    print()

    print("Height :", image.shape[0])

    print("Width  :", image.shape[1])

    print("Channel:", image.shape[2])

    print("Datatype:", image.dtype)


# =====================================================
# Normalize
# =====================================================

def normalize(image):

    return image.astype(np.float32)/255.0