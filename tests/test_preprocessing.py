from src.preprocessing import *
from src.utils import random_image

print("=" * 60)
print("Testing Preprocessing Module")
print("=" * 60)

image_path = random_image("glioma")

print("\nImage Selected:")
print(image_path)

cnn = preprocess_for_cnn(image_path)

print("\nCNN Output")
print("Shape :", cnn.shape)
print("Min :", cnn.min())
print("Max :", cnn.max())

gray = preprocess_for_morphology(image_path)

print("\nMorphology Output")
print("Shape :", gray.shape)
print("Min :", gray.min())
print("Max :", gray.max())

print("\n✅ Preprocessing Successful")