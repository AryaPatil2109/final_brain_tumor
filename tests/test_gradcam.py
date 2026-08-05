import os
import sys
import cv2
import numpy as np
from tensorflow.keras.models import load_model

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from src.gradcam import GradCAM


MODEL_PATH = "models/cnn_model.keras"

IMAGE_PATH = "dataset/Testing/glioma"

model = load_model(MODEL_PATH)

gradcam = GradCAM(model)

image_name = os.listdir(IMAGE_PATH)[0]

image_path = os.path.join(IMAGE_PATH, image_name)

image = cv2.imread(image_path)

image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

img = cv2.resize(image, (224,224))

img = img.astype("float32") / 255.0

img = np.expand_dims(img, axis=0)

heatmap = gradcam.generate_heatmap(img)

overlay = gradcam.overlay_heatmap(
    heatmap,
    image
)

cv2.imwrite(
    "outputs/gradcam_result.jpg",
    cv2.cvtColor(
        overlay,
        cv2.COLOR_RGB2BGR
    )
)

print("GradCAM image saved successfully!")