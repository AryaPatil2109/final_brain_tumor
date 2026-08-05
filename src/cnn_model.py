"""
=========================================================
CNN MODEL
MRI Brain Tumor Classification
=========================================================
"""

import tensorflow as tf

from tensorflow.keras.models import Model, load_model

from tensorflow.keras.layers import (

    Dense,

    Dropout,

    BatchNormalization,

    GlobalAveragePooling2D

)

from tensorflow.keras.applications import MobileNetV2

from tensorflow.keras.optimizers import Adam

from src.config import (

    IMAGE_SIZE,

    NUM_CLASSES,

    LEARNING_RATE,

    CNN_MODEL

)


# ==========================================================
# Build CNN Model
# ==========================================================

def build_cnn_model():

    base_model = MobileNetV2(

        weights="imagenet",

        include_top=False,

        input_shape=(

            IMAGE_SIZE[0],

            IMAGE_SIZE[1],

            3

        )

    )

    # Freeze backbone

    base_model.trainable = False

    x = base_model.output

    x = GlobalAveragePooling2D()(x)

    x = BatchNormalization()(x)

    x = Dropout(0.40)(x)

    x = Dense(

        256,

        activation="relu"

    )(x)

    x = Dropout(0.30)(x)

    output = Dense(

        NUM_CLASSES,

        activation="softmax"

    )(x)

    model = Model(

        inputs=base_model.input,

        outputs=output,

        name="BrainTumorCNN"

    )

    model.compile(

        optimizer=Adam(

            learning_rate=LEARNING_RATE

        ),

        loss="categorical_crossentropy",

        metrics=["accuracy"]

    )

    return model


# ==========================================================
# Save Model
# ==========================================================

def save_cnn_model(model):

    model.save(CNN_MODEL)

    print()

    print("CNN Model Saved Successfully")

    print(CNN_MODEL)


# ==========================================================
# Load Model
# ==========================================================

def load_cnn_model():

    model = load_model(CNN_MODEL)

    print()

    print("CNN Model Loaded Successfully")

    return model


# ==========================================================
# Model Summary
# ==========================================================

def model_summary(model):

    print()

    model.summary()

    print()


# ==========================================================
# Main
# ==========================================================

if __name__ == "__main__":

    cnn = build_cnn_model()

    model_summary(cnn)