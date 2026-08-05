import os
import sys
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.gradcam import GradCAM

# -----------------------------
# Paths
# -----------------------------
MODEL_PATH = "models/cnn_model.keras"
IMAGE_PATH = "dataset/Testing/glioma/Te-gl_90.jpg"

# -----------------------------
# Load model
# -----------------------------
model = load_model(MODEL_PATH)

gradcam = GradCAM(model)

# -----------------------------
# Load image
# -----------------------------
img = image.load_img(
    IMAGE_PATH,
    target_size=(224,224)
)

img_array = image.img_to_array(img)

img_array = img_array.astype("float32") / 255.0

img_array = np.expand_dims(img_array, axis=0)

# -----------------------------
# Generate heatmap
# -----------------------------
heatmap = gradcam.generate_heatmap(img_array)

# -----------------------------
# Original image
# -----------------------------
original = cv2.imread(IMAGE_PATH)

original = cv2.resize(original,(224,224))

overlay = gradcam.overlay_heatmap(
    heatmap,
    original
)

# -----------------------------
# Save
# -----------------------------
os.makedirs("outputs", exist_ok=True)

cv2.imwrite(
    "outputs/gradcam_result.jpg",
    overlay
)

print("GradCAM generated successfully.")
print("Saved to outputs/gradcam_result.jpg")