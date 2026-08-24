import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image


class GradCAM:

    def __init__(self, model, last_conv_layer="out_relu"):
        self.model = model
        self.last_conv_layer = last_conv_layer

        # Get the target convolutional layer
        out_relu_layer = self.model.get_layer(self.last_conv_layer)
        out_relu_output_shape = out_relu_layer.output.shape

        # 1. Part 1 Model: Input -> Last Conv Layer
        # Runs outside GradientTape, preventing gradient tracking overhead for the heavy base network.
        self.part_1_model = tf.keras.models.Model(
            inputs=self.model.inputs,
            outputs=out_relu_layer.output
        )

        # 2. Part 2 Model: Last Conv Layer -> Output Class Scores
        # Runs inside GradientTape. Since it only contains a few lightweight head layers, 
        # the memory tracked by GradientTape is virtually zero.
        part_2_input = tf.keras.Input(shape=out_relu_output_shape[1:], name="part_2_input")
        x = part_2_input
        out_relu_idx = self.model.layers.index(out_relu_layer)
        for layer in self.model.layers[out_relu_idx + 1:]:
            x = layer(x)

        self.part_2_model = tf.keras.models.Model(
            inputs=part_2_input,
            outputs=x
        )

    def generate_heatmap(self, img_array):
        # Step 1: Run feature extraction (99% of the model) outside the GradientTape.
        conv_outputs = self.part_1_model(img_array)

        # Step 2: Run only the classification head inside the GradientTape.
        with tf.GradientTape() as tape:
            tape.watch(conv_outputs)
            predictions = self.part_2_model(conv_outputs)
            predicted_class = tf.argmax(predictions[0])
            loss = predictions[:, predicted_class]

        grads = tape.gradient(loss, conv_outputs)

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        conv_outputs_val = conv_outputs[0]

        heatmap = tf.reduce_sum(conv_outputs_val * pooled_grads, axis=-1)

        heatmap = tf.maximum(heatmap, 0)

        heatmap /= tf.reduce_max(heatmap) + 1e-10

        return heatmap.numpy()

    def overlay_heatmap(self, heatmap, original_image, alpha=0.4):

        heatmap = cv2.resize(
            heatmap,
            (original_image.shape[1], original_image.shape[0])
        )

        heatmap = np.uint8(255 * heatmap)

        heatmap = cv2.applyColorMap(
            heatmap,
            cv2.COLORMAP_JET
        )

        overlay = cv2.addWeighted(
            original_image,
            1 - alpha,
            heatmap,
            alpha,
            0
        )

        return overlay

    def create_gradcam(self, image_path):

        img = image.load_img(
            image_path,
            target_size=(224, 224)
        )

        img_array = image.img_to_array(img)

        img_array = img_array.astype("float32")

        img_array /= 255.0

        img_array = np.expand_dims(
            img_array,
            axis=0
        )

        heatmap = self.generate_heatmap(img_array)

        original = cv2.imread(image_path)

        original = cv2.cvtColor(
            original,
            cv2.COLOR_BGR2RGB
        )

        overlay = self.overlay_heatmap(
            heatmap,
            original
        )

        return overlay