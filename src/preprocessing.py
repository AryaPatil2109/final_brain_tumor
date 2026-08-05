"""
=========================================================
Image Preprocessing Module
=========================================================
"""

import cv2
import numpy as np

from src.config import *
from src.utils import read_image


# =========================================================
# Resize Image
# =========================================================

def resize_image(image):

    return cv2.resize(
        image,
        IMAGE_SIZE,
        interpolation=cv2.INTER_AREA
    )


# =========================================================
# Noise Removal
# =========================================================

def remove_noise(image):

    return cv2.fastNlMeansDenoisingColored(
        image,
        None,
        10,
        10,
        7,
        21
    )


# =========================================================
# CLAHE
# =========================================================

def apply_clahe(image):

    lab = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2LAB
    )

    l, a, b = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    l = clahe.apply(l)

    lab = cv2.merge((l, a, b))

    image = cv2.cvtColor(
        lab,
        cv2.COLOR_LAB2RGB
    )

    return image


# =========================================================
# Normalize
# =========================================================

def normalize_image(image):

    image = image.astype(np.float32)

    image /= 255.0

    return image


# =========================================================
# RGB → Gray
# =========================================================

def rgb_to_gray(image):

    return cv2.cvtColor(
        image,
        cv2.COLOR_RGB2GRAY
    )


# =========================================================
# Histogram Equalization
# =========================================================

def histogram_equalization(gray):

    return cv2.equalizeHist(gray)


# =========================================================
# Complete CNN Pipeline
# =========================================================

def preprocess_for_cnn(image_path):

    image = read_image(image_path)

    image = resize_image(image)

    image = remove_noise(image)

    image = apply_clahe(image)

    image = normalize_image(image)

    return image


# =========================================================
# Complete Morphology Pipeline
# =========================================================

def preprocess_for_morphology(image_path):

    image = read_image(image_path)

    image = resize_image(image)

    image = remove_noise(image)

    image = apply_clahe(image)

    gray = rgb_to_gray(image)

    gray = histogram_equalization(gray)

    return gray


# =========================================================
# Display Helper
# =========================================================

def prepare_display(image):

    image = np.clip(image, 0, 1)

    image = (image * 255).astype(np.uint8)

    return image