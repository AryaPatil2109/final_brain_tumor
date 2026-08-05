import cv2
import numpy as np


class MorphologyAnalyzer:

    def __init__(self):
        pass

    def preprocess(self, image):
        """
        Convert RGB image to grayscale and apply Gaussian blur.
        """
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        return blur

    def segment(self, image):
        """
        Segment the tumor region using Otsu thresholding
        followed by morphological opening.
        """
        blur = self.preprocess(image)

        _, thresh = cv2.threshold(
            blur,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        kernel = np.ones((3, 3), np.uint8)

        opening = cv2.morphologyEx(
            thresh,
            cv2.MORPH_OPEN,
            kernel,
            iterations=2
        )

        return opening

    def contours(self, mask):
        """
        Find external contours.
        """
        contours, _ = cv2.findContours(
            mask,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        return contours

    def contour_count(self, mask):
        """
        Number of detected tumor contours.
        """
        return len(self.contours(mask))

    def tumor_area(self, mask):
        """
        Total segmented tumor area (pixels).
        """
        return int(np.sum(mask > 0))

    def largest_contour_area(self, mask):
        """
        Area of the largest contour.
        """
        contours = self.contours(mask)

        if len(contours) == 0:
            return 0

        return max(cv2.contourArea(c) for c in contours)

    def bounding_box(self, mask):
        """
        Bounding box around largest contour.
        """
        contours = self.contours(mask)

        if len(contours) == 0:
            return None

        largest = max(contours, key=cv2.contourArea)

        x, y, w, h = cv2.boundingRect(largest)

        return (x, y, w, h)

    def draw_contours(self, image):
        """
        Draw contours on the original image.
        """
        mask = self.segment(image)

        contours = self.contours(mask)

        output = image.copy()

        cv2.drawContours(
            output,
            contours,
            -1,
            (255, 0, 0),
            2
        )

        return output, mask

    def extract_features(self, image):
        """
        Extract morphological features for the Hybrid Model.
        """

        mask = self.segment(image)

        features = {

            "tumor_area": self.tumor_area(mask),

            "largest_contour_area": self.largest_contour_area(mask),

            "contour_count": self.contour_count(mask),

            "bounding_box": self.bounding_box(mask)

        }

        return features