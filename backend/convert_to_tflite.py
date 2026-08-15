import tensorflow as tf

# -----------------------------------------------------
# INPUT MODEL
# -----------------------------------------------------

MODEL_PATH = "model.h5"

# -----------------------------------------------------
# OUTPUT MODEL
# -----------------------------------------------------

OUTPUT_PATH = "brain_tumor_model.tflite"

# -----------------------------------------------------
# LOAD MODEL
# -----------------------------------------------------

print("Loading model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded successfully.")

# -----------------------------------------------------
# CONVERT
# -----------------------------------------------------

print("Converting model to TensorFlow Lite...")

converter = tf.lite.TFLiteConverter.from_keras_model(
    model
)

# Optional optimization
converter.optimizations = [
    tf.lite.Optimize.DEFAULT
]

tflite_model = converter.convert()

# -----------------------------------------------------
# SAVE
# -----------------------------------------------------

with open(
    OUTPUT_PATH,
    "wb"
) as f:
    f.write(tflite_model)

print("========================================")
print("TFLite conversion successful")
print("Saved as:")
print(OUTPUT_PATH)
print("========================================")