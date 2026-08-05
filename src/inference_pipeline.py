from src.predict import BrainTumorPredictor
from src.gradcam import GradCAM
from src.morphology import MorphologyAnalyzer


class BrainTumorPipeline:

    def __init__(self, model_path):

        self.predictor = BrainTumorPredictor(model_path)

        self.gradcam = GradCAM(model_path)

        self.morphology = MorphologyAnalyzer()

    def analyze(self, image_path):

        result = {}

        # CNN Prediction
        prediction = self.predictor.predict(image_path)

        result["prediction"] = prediction

        # GradCAM
        heatmap = self.gradcam.generate(image_path)

        result["gradcam"] = heatmap

        # Morphology
        morphology = self.morphology.extract_features(image_path)

        result["morphology"] = morphology

        return result