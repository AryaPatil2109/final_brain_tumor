class HybridDecision:

    def __init__(self):
        pass

    def analyze(
        self,
        prediction,
        confidence,
        contour_count,
        tumor_area
    ):

        confidence_level = ""

        if confidence >= 90:
            confidence_level = "Very High"

        elif confidence >= 75:
            confidence_level = "High"

        elif confidence >= 60:
            confidence_level = "Medium"

        else:
            confidence_level = "Low"

        tumor_detected = contour_count > 0 and tumor_area > 500

        if prediction == "notumor":

            if tumor_detected:
                final_decision = "Suspicious Region Found (Review Recommended)"
            else:
                final_decision = "No Tumor"

        else:

            if tumor_detected:
                final_decision = prediction
            else:
                final_decision = prediction + " (Low Morphological Evidence)"

        return {
            "prediction": prediction,
            "confidence": confidence,
            "confidence_level": confidence_level,
            "tumor_detected": tumor_detected,
            "tumor_area": tumor_area,
            "contours": contour_count,
            "final_decision": final_decision
        }