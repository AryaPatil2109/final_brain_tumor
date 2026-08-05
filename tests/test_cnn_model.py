from src.cnn_model import *

import tensorflow as tf

print("="*60)

print("Testing CNN Model")

print("="*60)

cnn = build_cnn_model()

print()

print("Input Shape")

print(cnn.input_shape)

print()

print("Output Shape")

print(cnn.output_shape)

print()

print("Model Summary")

cnn.summary()

print()

dummy = tf.random.normal(

    (

        1,

        224,

        224,

        3

    )

)

prediction = cnn.predict(dummy)

print()

print("Prediction Shape")

print(prediction.shape)

print()

print("Prediction")

print(prediction)

print()

print("CNN Model Test Passed Successfully")