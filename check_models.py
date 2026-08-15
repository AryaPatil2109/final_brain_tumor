import os
import tensorflow as tf


MODELS = [
    os.path.join(
        "models",
        "hybrid_model_v2.keras"
    ),
    os.path.join(
        "models",
        "cnn_model_finetuned (2).keras"
    ),
]


def inspect_model(model_path):
    print("\n" + "=" * 70)
    print("MODEL:", model_path)
    print("=" * 70)

    if not os.path.exists(model_path):
        print("ERROR: File not found")
        return

    try:
        model = tf.keras.models.load_model(
            model_path,
            compile=False,
        )

        print("\nModel loaded successfully.")

        print("\nINPUTS:")
        for item in model.inputs:
            print(
                "  name:",
                item.name,
                "| shape:",
                item.shape,
                "| dtype:",
                item.dtype,
            )

        print("\nOUTPUTS:")
        for item in model.outputs:
            print(
                "  name:",
                item.name,
                "| shape:",
                item.shape,
                "| dtype:",
                item.dtype,
            )

        print("\nMODEL SUMMARY:")
        model.summary()

    except Exception as exc:
        print(
            "\nERROR while loading model:",
            repr(exc),
        )


def main():
    print("TensorFlow version:")
    print(tf.__version__)

    for model_path in MODELS:
        inspect_model(model_path)


if __name__ == "__main__":
    main()