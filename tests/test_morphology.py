import os
import sys
import cv2

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from src.morphology import MorphologyAnalyzer


IMAGE_FOLDER = "dataset/Testing/glioma"

image_name = os.listdir(IMAGE_FOLDER)[0]

image_path = os.path.join(
    IMAGE_FOLDER,
    image_name
)

image = cv2.imread(image_path)

image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

analyzer = MorphologyAnalyzer()

contour_image, mask = analyzer.draw_contours(image)

cv2.imwrite(
    "outputs/mask.jpg",
    cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
)

cv2.imwrite(
    "outputs/contours.jpg",
    cv2.cvtColor(contour_image, cv2.COLOR_RGB2BGR)
)

print("Morphology completed successfully.")