"""
=========================================================
Evaluation Module
=========================================================
"""

import os
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

from src.config import (
    REPORT_DIR,
    CONFUSION_MATRIX_DIR,
    PLOT_DIR
)


def save_history(history):

    plt.figure(figsize=(8,5))

    plt.plot(history.history["accuracy"], label="Train Accuracy")
    plt.plot(history.history["val_accuracy"], label="Validation Accuracy")

    plt.xlabel("Epoch")
    plt.ylabel("Accuracy")
    plt.title("Training Accuracy")
    plt.legend()

    plt.savefig(PLOT_DIR / "accuracy.png")

    plt.close()

    plt.figure(figsize=(8,5))

    plt.plot(history.history["loss"], label="Train Loss")
    plt.plot(history.history["val_loss"], label="Validation Loss")

    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.title("Training Loss")
    plt.legend()

    plt.savefig(PLOT_DIR / "loss.png")

    plt.close()


def save_classification_report(y_true, y_pred, class_names):

    report = classification_report(
        y_true,
        y_pred,
        target_names=class_names
    )

    with open(REPORT_DIR / "classification_report.txt","w") as f:

        f.write(report)

    print(report)


def save_confusion_matrix(y_true, y_pred, class_names):

    cm = confusion_matrix(
        y_true,
        y_pred
    )

    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=class_names
    )

    fig, ax = plt.subplots(figsize=(8, 8))

    disp.plot(
        ax=ax,
        cmap="Blues",
        colorbar=True
    )

    plt.title("CNN Confusion Matrix")

    plt.tight_layout()

    plt.savefig(
        CONFUSION_MATRIX_DIR / "cnn_confusion_matrix.png",
        dpi=300
    )

    plt.close()

    print("Confusion Matrix Saved Successfully.")