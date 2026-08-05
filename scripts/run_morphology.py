import os
import sys
import cv2

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.morphology import MorphologyAnalyzer

IMAGE_PATH = "dataset/Testing/glioma/Te-gl_90.jpg"

image = cv2.imread(IMAGE_PATH)

morph = MorphologyAnalyzer()

contour_image, mask = morph.draw_contours(image)

os.makedirs("outputs", exist_ok=True)

cv2.imwrite("outputs/mask.jpg", mask)

cv2.imwrite("outputs/contours.jpg", contour_image)

print("Morphology completed successfully.")

print("Mask saved      : outputs/mask.jpg")

print("Contours saved  : outputs/contours.jpg")