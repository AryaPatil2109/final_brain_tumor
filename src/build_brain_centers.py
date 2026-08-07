import os
import pickle
import numpy as np

from tqdm import tqdm
from scipy.spatial.distance import cosine

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from src.feature_extractor import CNNFeatureExtractor

MODEL_PATH = "models/cnn_model.keras"
TRAIN_DIR = "dataset/Training"
SAVE_PATH = "models/brain_centers.pkl"


cnn = load_model(MODEL_PATH)

extractor = CNNFeatureExtractor(cnn)

brain_centers = {}

thresholds = {}

for class_name in os.listdir(TRAIN_DIR):

    class_path = os.path.join(TRAIN_DIR, class_name)

    if not os.path.isdir(class_path):
        continue

    print(f"\nProcessing {class_name}")

    features = []

    for img_name in tqdm(os.listdir(class_path)):

        img_path = os.path.join(class_path, img_name)

        try:

            img = image.load_img(
                img_path,
                target_size=(224,224)
            )

            img = image.img_to_array(img)

            img = img.astype("float32") / 255.0

            img = np.expand_dims(img, axis=0)

            feature = extractor.extract(img)

            features.append(feature)

        except:
            continue

    features = np.array(features)

    center = np.mean(features, axis=0)

    distances = []

    for f in features:

        distances.append(
            cosine(f, center)
        )

    threshold = np.percentile(
        distances,
        95
    )

    brain_centers[class_name] = center

    thresholds[class_name] = threshold

    print(
        class_name,
        threshold
    )


with open(
    SAVE_PATH,
    "wb"
) as f:

    pickle.dump(
        {
            "centers": brain_centers,
            "thresholds": thresholds
        },
        f
    )

print("\nBrain Centers Saved Successfully.")