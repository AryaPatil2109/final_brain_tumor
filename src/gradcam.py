import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image


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