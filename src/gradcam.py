import cv2
import numpy as np
import tensorflow as tf


class GradCAM:

    def __init__(self, model, last_conv_layer="out_relu"):
        self.model = model
        self.last_conv_layer = last_conv_layer

    def generate_heatmap(self, img_array):

        grad_model = tf.keras.models.Model(
            inputs=self.model.inputs,
            outputs=[
                self.model.get_layer(self.last_conv_layer).output,
                self.model.output
            ]
        )

        with tf.GradientTape() as tape:

            conv_outputs, predictions = grad_model(img_array)

            predicted_class = tf.argmax(predictions[0])

            loss = predictions[:, predicted_class]

        grads = tape.gradient(loss, conv_outputs)

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        conv_outputs = conv_outputs[0]

        heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)

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