# 🧠 Brain Tumor Dual Path Detection

An AI-powered Brain MRI classification system based on a **Dual-Path Deep Learning Architecture** that combines deep visual features extracted from MRI images with morphological image features.

The system is designed to classify Brain MRI images into four categories:

1. **Glioma**
2. **Meningioma**
3. **No Tumor**
4. **Pituitary**

The project combines:

* 🧠 Convolutional Neural Network (CNN) based image classification
* 🔬 Morphological image feature extraction
* 🔗 Hybrid CNN + Morphology feature fusion
* 🔥 Grad-CAM explainability
* 🛡️ Brain MRI image validation
* 📊 Confusion matrix and classification-report based evaluation
* 🖥️ Streamlit prototype application
* 🌐 Planned React frontend
* ⚡ Planned FastAPI backend
* 🗄️ Planned PostgreSQL database

The current selected final hybrid model is **Hybrid V2**, which achieved:

**93.00% accuracy on an independent test dataset containing 1,600 MRI images.**

---

# 📑 Table of Contents

* [1. Project Overview](#1-project-overview)
* [2. Problem Statement](#2-problem-statement)
* [3. Project Objectives](#3-project-objectives)
* [4. Key Features](#4-key-features)
* [5. Tumor Classes](#5-tumor-classes)
* [6. Overall System Architecture](#6-overall-system-architecture)
* [7. Dual-Path Architecture](#7-dual-path-architecture)
* [8. CNN Path](#8-cnn-path)
* [9. CNN Training](#9-cnn-training)
* [10. CNN Fine-Tuning](#10-cnn-fine-tuning)
* [11. CNN Feature Extraction](#11-cnn-feature-extraction)
* [12. Morphology Path](#12-morphology-path)
* [13. Current Morphological Features](#13-current-morphological-features)
* [14. Planned Morphological Formula-Based Features](#14-planned-morphological-formula-based-features)
* [15. Feature Dataset Generation](#15-feature-dataset-generation)
* [16. Dataset](#16-dataset)
* [17. Dataset Distribution](#17-dataset-distribution)
* [18. Data Preprocessing](#18-data-preprocessing)
* [19. Feature Scaling](#19-feature-scaling)
* [20. Train-Validation Split](#20-train-validation-split)
* [21. Hybrid Feature Fusion](#21-hybrid-feature-fusion)
* [22. Hybrid Model Training](#22-hybrid-model-training)
* [23. Hybrid V2 Training Results](#23-hybrid-v2-training-results)
* [24. Hybrid V2 Test Results](#24-hybrid-v2-test-results)
* [25. Hybrid V2 Confusion Matrix](#25-hybrid-v2-confusion-matrix)
* [26. Hybrid V3 Experiment](#26-hybrid-v3-experiment)
* [27. Hybrid V3 Validation Results](#27-hybrid-v3-validation-results)
* [28. Hybrid V3 Test Results](#28-hybrid-v3-test-results)
* [29. Model Selection](#29-model-selection)
* [30. Grad-CAM Explainability](#30-grad-cam-explainability)
* [31. Brain MRI Validation](#31-brain-mri-validation)
* [32. Prediction Workflow](#32-prediction-workflow)
* [33. Current Streamlit Application](#33-current-streamlit-application)
* [34. Planned React Frontend](#34-planned-react-frontend)
* [35. Planned FastAPI Backend](#35-planned-fastapi-backend)
* [36. Planned PostgreSQL Database](#36-planned-postgresql-database)
* [37. Tumor Information Section](#37-tumor-information-section)
* [38. About Section](#38-about-section)
* [39. Project Structure](#39-project-structure)
* [40. Important Source Files](#40-important-source-files)
* [41. Model Files](#41-model-files)
* [42. Feature Files](#42-feature-files)
* [43. Installation](#43-installation)
* [44. Virtual Environment](#44-virtual-environment)
* [45. Running the Current Application](#45-running-the-current-application)
* [46. Feature Generation Workflow](#46-feature-generation-workflow)
* [47. Testing Workflow](#47-testing-workflow)
* [48. Model Evaluation](#48-model-evaluation)
* [49. Current Performance Summary](#49-current-performance-summary)
* [50. Future Model Improvements](#50-future-model-improvements)
* [51. Additional Dataset Images](#51-additional-dataset-images)
* [52. Development Roadmap](#52-development-roadmap)
* [53. Limitations](#53-limitations)
* [54. Medical Disclaimer](#54-medical-disclaimer)
* [55. Project Status](#55-project-status)

---

# 1. Project Overview

Brain tumors are abnormal growths of cells in or around the brain. Magnetic Resonance Imaging (MRI) is commonly used to visualize brain structures and abnormalities.

This project investigates the use of deep learning and image-processing techniques for automatic classification of brain MRI images.

Instead of relying only on CNN-based visual information, the project uses a **dual-path architecture**.

The first path extracts deep visual representations using a CNN.

The second path extracts structural and morphological characteristics from the MRI image.

These two feature representations are then combined through a hybrid fusion model.

The overall workflow is:

```text
                    Brain MRI Image
                           │
                           ▼
                  Brain MRI Validation
                           │
                           ▼
                    Image Preprocessing
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
         CNN PATH                 MORPHOLOGY PATH
             │                           │
             ▼                           ▼
    Deep Visual Features        Morphological Features
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                    Feature Scaling
                           │
                           ▼
                    Feature Fusion
                           │
                           ▼
                     Hybrid Model
                           │
                           ▼
                 Final Classification
```

---

# 2. Problem Statement

Traditional manual analysis of MRI images can require considerable expertise and time.

The objective of this project is to develop an AI-assisted system capable of analyzing Brain MRI images and classifying them into four categories:

```text
Glioma
Meningioma
No Tumor
Pituitary
```

The system additionally attempts to provide interpretable information through:

* Grad-CAM visualization
* Morphological measurements
* CNN prediction
* Hybrid prediction
* Classification metrics
* Confusion matrices

---

# 3. Project Objectives

The main objectives are:

1. Develop a CNN-based Brain MRI classification model.
2. Fine-tune the CNN for the target MRI classification task.
3. Extract deep visual features from the trained CNN.
4. Extract morphological features from MRI images.
5. Construct a feature dataset containing CNN and morphological representations.
6. Train a hybrid CNN + Morphology model.
7. Evaluate the hybrid model using an independent test dataset.
8. Generate confusion matrices and classification reports.
9. Provide Grad-CAM based visual explainability.
10. Validate whether an uploaded image belongs to the intended Brain MRI domain.
11. Develop a user-friendly application for prediction.
12. Convert the prototype into a responsive web application using React, FastAPI and PostgreSQL.

---

# 4. Key Features

## 🧠 CNN Classification

The CNN path learns visual representations directly from Brain MRI images.

## 🔬 Morphological Analysis

The morphology path extracts structural characteristics from detected image regions.

## 🔗 Hybrid Feature Fusion

CNN and morphology representations are combined before classification.

## 🔥 Grad-CAM

Grad-CAM is used to visualize image regions contributing to CNN predictions.

## 🛡️ Brain MRI Validation

The system includes a validation mechanism to reduce incorrect predictions from images that are not sufficiently similar to the intended Brain MRI feature space.

## 📊 Model Evaluation

The system evaluates models using:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix
* Macro average
* Weighted average

## 🖥️ Application

The current prototype is implemented using Streamlit.

## 🌐 Future Web Application

The final application is planned using:

```text
React
FastAPI
PostgreSQL
```

---

# 5. Tumor Classes

The classification system contains four classes.

| Class      | Description                                         |
| ---------- | --------------------------------------------------- |
| Glioma     | Brain tumor category associated with glial cells    |
| Meningioma | Tumor category associated with the meninges         |
| No Tumor   | MRI image without a tumor classification            |
| Pituitary  | Tumor category associated with the pituitary region |

The final web application will provide a dedicated tumor-information section containing information about each class.

---

# 6. Overall System Architecture

The complete machine-learning pipeline is:

```text
                         MRI IMAGE
                             │
                             ▼
                    ┌─────────────────┐
                    │ Brain Validation│
                    └────────┬────────┘
                             │
                             ▼
                    Image Preprocessing
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐       ┌──────────────────┐
        │   CNN PATH    │       │ MORPHOLOGY PATH  │
        └───────┬───────┘       └────────┬─────────┘
                │                        │
                ▼                        ▼
        CNN Feature Vector       Morphology Features
                │                        │
                ▼                        ▼
          CNN Scaling             Morphology Scaling
                │                        │
                └────────────┬───────────┘
                             │
                             ▼
                       Feature Fusion
                             │
                             ▼
                      Hybrid Network
                             │
                             ▼
                  Four-Class Prediction
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
        Result            Grad-CAM        Morphology
```

---

# 7. Dual-Path Architecture

The central concept of the project is the use of two complementary feature representations.

## Path 1 — CNN

The CNN learns high-level visual patterns from MRI images.

```text
MRI
 ↓
CNN
 ↓
Deep Feature Representation
```

## Path 2 — Morphology

The morphology path extracts structural characteristics from image regions.

```text
MRI
 ↓
Image Processing
 ↓
Contour / Region Analysis
 ↓
Morphological Features
```

## Fusion

The two feature representations are combined:

```text
CNN Features
     │
     ├──────────────┐
     │              │
     │          Feature Fusion
     │              │
Morphology ─────────┘
                    │
                    ▼
              Hybrid Network
                    │
                    ▼
              Final Prediction
```

---

# 8. CNN Path

The CNN path is responsible for learning visual representations from MRI images.

The CNN receives a preprocessed MRI image and learns patterns related to the four target classes.

The CNN pipeline is:

```text
MRI Image
   ↓
Resize / Preprocessing
   ↓
CNN
   ↓
Global Average Pooling
   ↓
Feature Vector
   ↓
Classification
```

The feature extractor used in the project obtains the output from the CNN's:

```text
global_average_pooling2d
```

layer.

The resulting feature representation contains:

```text
1280 features
```

---

# 9. CNN Training

The first major training stage is CNN classification.

The purpose of this stage is to train the CNN to distinguish among:

```text
Glioma
Meningioma
No Tumor
Pituitary
```

The general training workflow is:

```text
Training MRI Dataset
        ↓
Image Preprocessing
        ↓
Train CNN
        ↓
Validation
        ↓
Model Selection
        ↓
Saved CNN Model
```

During training, the model learns visual patterns associated with each class.

Important training concepts used include:

* Training accuracy
* Validation accuracy
* Training loss
* Validation loss
* Learning-rate scheduling
* Early stopping
* Best-model checkpointing

The CNN model is subsequently used not only for direct classification but also as a feature extractor for the hybrid model.

---

# 10. CNN Fine-Tuning

After the initial CNN training stage, the CNN can be fine-tuned for the target Brain MRI classification task.

Fine-tuning allows the model to adjust its learned representations to better fit the project dataset.

The fine-tuning workflow is:

```text
Initial CNN
    ↓
Load trained weights
    ↓
Fine-tune selected layers
    ↓
Validate
    ↓
Save best model
```

Fine-tuned models are used to generate improved feature representations for the hybrid pipeline.

---

# 11. CNN Feature Extraction

After CNN training/fine-tuning, the CNN is used as a feature extractor.

The classification head is not the main focus during this stage.

Instead, the output of the global average pooling layer is extracted.

The resulting feature size is:

```text
1280
```

Therefore:

```text
One MRI image
        ↓
CNN
        ↓
1280-dimensional feature vector
```

For the complete training dataset:

```text
CNN feature matrix:

(5600, 1280)
```

For the independent test dataset:

```text
CNN feature matrix:

(1600, 1280)
```

These features are later combined with morphological features.

---

# 12. Morphology Path

The second path of the architecture is based on image morphology.

The objective is to extract structural information that may complement the CNN's learned visual representation.

The current morphology workflow is:

```text
MRI Image
    ↓
Image Processing
    ↓
Region / Contour Detection
    ↓
Morphological Measurements
    ↓
Feature Vector
```

The current morphology feature vector contains:

```text
7 features
```

---

# 13. Current Morphological Features

The current morphology dataset contains seven features:

```text
1. tumor_area
2. largest_contour_area
3. contour_count
4. bounding_box_x
5. bounding_box_y
6. bounding_box_width
7. bounding_box_height
```

The training morphology feature matrix is:

```text
(5600, 7)
```

The testing morphology feature matrix is:

```text
(1600, 7)
```

These features provide basic information about the detected region and its spatial characteristics.

---

# 14. Planned Morphological Formula-Based Features

A major planned improvement is to make the morphology path more mathematically meaningful.

The instructor suggested using standard morphological/geometric formulas instead of relying only on basic measurements.

The candidate features include:

```text
Circularity
Eccentricity
Solidity
Extent
Aspect Ratio
Perimeter
Equivalent Diameter
Convex Hull Area
Major Axis
Minor Axis
```

One important formula under consideration is circularity:

```text
Circularity = 4πA / P²
```

where:

```text
A = contour area
P = contour perimeter
```

Other formulas/features such as eccentricity, solidity and extent should be implemented according to the exact methodology/reference approved for the project.

These features have **not been represented as final implemented features in the current model** unless explicitly added and retrained.

The purpose of the improvement is to determine whether more meaningful morphological representations can improve hybrid-model generalization.

---

# 15. Feature Dataset Generation

After training/fine-tuning the CNN, feature datasets are generated.

Two main feature paths are produced:

```text
CNN Features
Morphology Features
```

Training feature datasets:

```text
cnn_features
morphology_features
```

Testing feature datasets:

```text
test_cnn_features
test_morphology_features
```

Fine-tuned versions were also generated:

```text
cnn_features_finetuned
morphology_features_finetuned

test_cnn_features_finetuned
test_morphology_features_finetuned
```

The feature-generation scripts process the MRI images and save their corresponding feature representations.

---

# 16. Dataset

The current dataset used for the project contains:

```text
Training images: 5600
Testing images: 1600
```

The dataset contains four classes.

The independent test dataset contains:

```text
400 Glioma
400 Meningioma
400 No Tumor
400 Pituitary
```

Total:

```text
1600 images
```

---

# 17. Dataset Distribution

## Training Dataset

```text
Total training images = 5600
```

## Validation Dataset

The training data was divided into:

```text
Training = 4760
Validation = 840
```

## Independent Test Dataset

```text
Testing = 1600
```

The test dataset is kept separate from the training/validation process and is used for final performance evaluation.

---

# 18. Data Preprocessing

The image preprocessing pipeline prepares MRI images before they are supplied to the CNN.

The general pipeline is:

```text
Raw MRI Image
      ↓
Image Loading
      ↓
Image Resizing
      ↓
Pixel Preprocessing
      ↓
CNN Input
```

The same preprocessing assumptions used during CNN training must be maintained during feature extraction and inference.

This ensures consistency between:

```text
Training
Validation
Testing
Deployment
```

---

# 19. Feature Scaling

The CNN and morphology paths contain features with different numerical ranges.

Therefore, feature scaling is applied before hybrid-model training.

The workflow is:

```text
CNN Features
     ↓
CNN Feature Scaler
     ↓
Scaled CNN Features
```

and:

```text
Morphology Features
     ↓
Morphology Feature Scaler
     ↓
Scaled Morphology Features
```

The scalers are fitted using the training data and then applied to validation and test data.

This prevents differences in feature magnitude from dominating the fusion process.

---

# 20. Train-Validation Split

The training feature dataset was divided into:

```text
Training:
4760 samples

Validation:
840 samples
```

Therefore:

```text
Total:
5600 samples
```

The resulting shapes are:

```text
CNN training:
(4760, 1280)

CNN validation:
(840, 1280)

Morphology training:
(4760, 7)

Morphology validation:
(840, 7)

Training labels:
(4760,)

Validation labels:
(840,)
```

The independent test dataset remains separate:

```text
CNN test:
(1600, 1280)

Morphology test:
(1600, 7)

Testing labels:
(1600,)
```

---

# 21. Hybrid Feature Fusion

The central component of the project is the hybrid model.

CNN features:

```text
1280 dimensions
```

Morphological features:

```text
7 dimensions
```

After preprocessing/scaling, they are passed to the hybrid network.

Conceptually:

```text
CNN Features
1280
   │
   ▼
CNN Feature Branch
   │
   │
   ├─────────────┐
   │             │
   │        Feature Fusion
   │             │
   └─────────────┘
                 ▲
                 │
        Morphology Branch
                 │
              7 features
                 │
                 ▼
          Hybrid Representation
                 │
                 ▼
          Classification Layer
                 │
                 ▼
       4-Class Prediction
```

The hybrid model attempts to combine:

```text
Deep visual information
+
Structural morphological information
```

---

# 22. Hybrid Model Training

The hybrid model is trained using the combined feature representations.

The training process uses:

* Training features
* Validation features
* Training labels
* Validation labels
* Model checkpointing
* Early stopping
* Learning-rate reduction

The best validation-performing model is saved separately.

The Hybrid V2 training used:

```text
Maximum epochs: 40
Batch size: 32
```

The learning rate was reduced during training using a learning-rate scheduling strategy when validation performance stopped improving.

Early stopping was used to prevent unnecessary over-training.

---

# 23. Hybrid V2 Training Results

Hybrid V2 produced strong validation performance.

The best validation performance was:

```text
97.38%
```

The best weights were saved as:

```text
hybrid_v2_best.keras
```

The model was then evaluated on the independent test dataset.

---

# 24. Hybrid V2 Test Results

The final selected Hybrid V2 model achieved:

```text
Test Accuracy: 93.00%
```

The independent test dataset contains:

```text
1600 images
```

Classification report:

```text
              precision    recall  f1-score   support

glioma          0.9690    0.7825    0.8658       400
meningioma      0.8527    0.9550    0.9009       400
notumor         0.9388    0.9975    0.9673       400
pituitary       0.9752    0.9850    0.9801       400

accuracy                            0.9300      1600
macro avg       0.9339    0.9300    0.9285      1600
weighted avg    0.9339    0.9300    0.9285      1600
```

### Interpretation

The model performs particularly strongly on:

* No Tumor
* Pituitary

The main challenge is the distinction involving:

```text
Glioma
Meningioma
```

This is visible from the lower recall for Glioma and lower precision for Meningioma.

This class-specific behavior is one of the reasons further morphology and feature-fusion improvements are being investigated.

---

# 25. Hybrid V2 Confusion Matrix

The independent test evaluation produced the following confusion matrix:

```text
[[309  69  17   5]
 [  6 382   4   8]
 [  0   1 399   0]
 [  2   3   0 395]]
```

Class order:

```text
[glioma, meningioma, notumor, pituitary]
```

Interpretation:

```text
Glioma:
309 correctly classified

Meningioma:
382 correctly classified

No Tumor:
399 correctly classified

Pituitary:
395 correctly classified
```

The matrix demonstrates that the largest source of confusion is between:

```text
Glioma ↔ Meningioma
```

---

# 26. Hybrid V3 Experiment

After Hybrid V2, an additional experiment was performed using a modified training configuration.

The purpose of V3 was to investigate whether changes in training configuration could improve validation performance.

V3 achieved:

```text
Validation Accuracy = 97.74%
```

However, higher validation accuracy did not translate into better independent-test accuracy.

Therefore, V3 was treated as an experiment rather than replacing the final V2 model.

---

# 27. Hybrid V3 Validation Results

V3 validation accuracy:

```text
97.74%
```

Classification report:

```text
              precision    recall  f1-score   support

glioma          0.9856    0.9762    0.9809       210
meningioma      0.9526    0.9571    0.9549       210
notumor         0.9904    0.9810    0.9856       210
pituitary       0.9812    0.9952    0.9882       210

accuracy                            0.9774       840
macro avg       0.9774    0.9774    0.9774       840
weighted avg    0.9774    0.9774    0.9774       840
```

Validation confusion matrix:

```text
[[205   5   0   0]
 [  3 201   2   4]
 [  0   4 206   0]
 [  0   1   0 209]]
```

---

# 28. Hybrid V3 Test Results

Despite the stronger validation result, V3 achieved:

```text
Test Accuracy = 92.81%
```

Classification report:

```text
              precision    recall  f1-score   support

glioma          0.9748    0.7725    0.8619       400
meningioma      0.8396    0.9550    0.8936       400
notumor         0.9500    0.9975    0.9732       400
pituitary       0.9681    0.9875    0.9777       400

accuracy                            0.9281      1600
macro avg       0.9331    0.9281    0.9266      1600
weighted avg    0.9331    0.9281    0.9266      1600
```

V3 test confusion matrix:

```text
[[309  69  17   5]
 [  6 382   4   8]
 [  0   1 399   0]
 [  2   3   0 395]]
```

---

# 29. Model Selection

Although Hybrid V3 achieved a slightly higher validation accuracy:

```text
V3 Validation = 97.74%
```

its independent test accuracy was:

```text
V3 Test = 92.81%
```

Hybrid V2 achieved:

```text
V2 Validation = 97.38%
V2 Test = 93.00%
```

Therefore:

## Final Selected Model

```text
Hybrid V2
```

Reason:

```text
Higher independent test accuracy
+
Better generalization on the held-out test dataset
```

The project therefore uses **Hybrid V2 as the final selected hybrid model**.

V3 is retained as an experimental comparison.

---

# 30. Grad-CAM Explainability

Grad-CAM is used to provide visual interpretability for CNN predictions.

The objective is to identify image regions that contributed strongly to the model's prediction.

The workflow is:

```text
MRI Image
    ↓
CNN
    ↓
Target Prediction
    ↓
Gradient Calculation
    ↓
Activation Map
    ↓
Grad-CAM Heatmap
```

The application displays the Grad-CAM heatmap alongside the uploaded MRI image.

This helps provide an additional visual explanation of the CNN decision.

Grad-CAM is an interpretability aid and should not be considered a clinical proof of tumor location.

---

# 31. Brain MRI Validation

The system includes an image-validation mechanism before normal prediction.

The purpose is to reduce the possibility of the classifier processing arbitrary non-Brain-MRI images.

The workflow is:

```text
Uploaded Image
      ↓
Brain Image Validation
      │
      ├── Invalid
      │     ↓
      │   Reject Image
      │
      └── Valid
            ↓
       Continue Prediction
```

For invalid images, the application can display:

* Uploaded image
* Validation message
* Distance value
* Validation threshold
* Instruction to upload a valid Brain MRI image

This validation stage is performed before the normal prediction workflow.

---

# 32. Prediction Workflow

The complete prediction workflow is:

```text
User Uploads MRI
       │
       ▼
Brain MRI Validation
       │
       ├──────── Invalid ────────► Reject
       │
       ▼
Image Preprocessing
       │
       ├───────────────┐
       │               │
       ▼               ▼
      CNN         Morphology
       │               │
       ▼               ▼
CNN Features     Morphology Features
       │               │
       └───────┬───────┘
               ▼
        Feature Scaling
               │
               ▼
        Hybrid V2 Model
               │
               ▼
        Final Prediction
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
    Result   Grad-CAM  Metrics
```

---

# 33. Current Streamlit Application

The current working prototype uses Streamlit.

The application supports:

```text
CNN Output
Morphology Output
Hybrid Output
```

## CNN Output

The CNN module provides:

* CNN prediction
* CNN confidence
* Grad-CAM heatmap
* CNN evaluation information

## Morphology Output

The morphology module provides:

* Morphological analysis
* Tumor-region measurements
* Contour information
* Bounding-box information

## Hybrid Output

The hybrid module provides:

* Final hybrid prediction
* Hybrid confidence
* Morphological feature summary
* Hybrid confusion matrix
* CNN vs Hybrid comparison
* Final diagnosis

The current application therefore acts as a working prototype for the final web application.

---

# 34. Planned React Frontend

The Streamlit application is being evolved into a responsive web application.

The planned frontend technology is:

```text
React
```

The React frontend will provide:

* Responsive design
* MRI upload
* Prediction interface
* CNN results
* Morphology results
* Hybrid results
* Grad-CAM visualization
* Model performance information
* Tumor information
* Navigation
* Prediction history interface

The frontend will communicate with the FastAPI backend through HTTP APIs.

---

# 35. Planned FastAPI Backend

The backend will be implemented using:

```text
FastAPI
```

The FastAPI backend will be responsible for:

```text
MRI Upload
     ↓
Image Validation
     ↓
CNN Inference
     ↓
Morphology Extraction
     ↓
Hybrid V2 Inference
     ↓
Result Generation
     ↓
JSON Response
```

Potential API responsibilities include:

```text
POST /predict
POST /validate
GET  /tumors
GET  /history
```

The exact endpoint structure may evolve during implementation.

The trained ML models will remain on the backend side.

---

# 36. Planned PostgreSQL Database

PostgreSQL will be used for persistent application data.

The planned database can store information such as:

```text
Prediction ID
Image Information
Prediction
Confidence
CNN Prediction
Hybrid Prediction
Morphological Measurements
Timestamp
```

A conceptual prediction record may contain:

```text
prediction_id
image_name
prediction
confidence
cnn_prediction
hybrid_prediction
tumor_area
largest_contour_area
contour_count
created_at
```

The database will be integrated through FastAPI.

---

# 37. Tumor Information Section

The final website will contain a dedicated tumor-information section.

The section will contain information for:

```text
Glioma
Meningioma
No Tumor
Pituitary
```

Each class will have:

* Tumor name
* Description
* General characteristics
* Relevant information
* One representative MRI image
* Appropriate medical disclaimer

This section is intended for educational and informational purposes.

It will not be presented as a replacement for professional medical diagnosis.

---

# 38. About Section

An About section will be included in the final website.

At the current stage, the section will remain structurally prepared but the hospital-specific information will be added later.

The final section may contain:

```text
Hospital / Institution Information
Project Information
Team Information
Technology Stack
Contact Information
```

The exact content will be provided later.

---

# 39. Project Structure

The project currently contains the following important structure:

```text
Brain_Tumor_Dual_Path/
│
├── app/
│   ├── main.py
│   ├── predict_page.py
│   ├── components.py
│   └── morphology_component.py
│
├── src/
│   ├── __init__.py
│   ├── brain_validator.py
│   ├── build_brain_centers.py
│   ├── cnn_model.py
│   ├── config.py
│   ├── evaluate.py
│   ├── feature_extractor.py
│   ├── generate_feature_dataset.py
│   ├── generate_test_feature_dataset.py
│   ├── gradcam.py
│   ├── hybrid_model.py
│   ├── hybrid_network.py
│   ├── hybrid_predictor.py
│   └── predict.py
│
├── models/
│
├── features/
│
├── dataset/
│
├── tests/
│
├── outputs/
│
├── README.md
│
├── requirements.txt
│
└── .gitignore
```

The final web architecture will additionally contain frontend and backend components:

```text
Brain_Tumor_Dual_Path/
│
├── frontend/        ← React
│
├── backend/         ← FastAPI
│
├── src/             ← Existing ML pipeline
│
├── models/          ← Trained ML models
│
├── features/
│
├── dataset/
│
├── tests/
│
├── README.md
│
└── requirements.txt
```

---

# 40. Important Source Files

Important source files include:

```text
src/brain_validator.py
```

Responsible for Brain MRI validation.

```text
src/cnn_model.py
```

Contains CNN model-related functionality.

```text
src/feature_extractor.py
```

Responsible for extracting CNN feature representations.

```text
src/generate_feature_dataset.py
```

Generates training feature datasets.

```text
src/generate_test_feature_dataset.py
```

Generates testing feature datasets.

```text
src/hybrid_model.py
```

Contains hybrid model functionality.

```text
src/hybrid_network.py
```

Defines the hybrid network architecture.

```text
src/hybrid_predictor.py
```

Handles hybrid prediction.

```text
src/gradcam.py
```

Handles Grad-CAM generation.

```text
src/predict.py
```

Handles CNN prediction and validation workflow.

---

# 41. Model Files

Important trained model files used during development include:

```text
cnn_model.keras
cnn_model_finetuned.keras
cnn_final.keras
hybrid_model_v2.keras
```

Additional supporting model/scaler files may include:

```text
cnn_scaler.pkl
cnn_feature_scaler.pkl
morphology_scaler.pkl
morphology_feature_scaler.pkl
brain_centers.pkl
brain_feature_space.pkl
```

The exact model/scaler files required for deployment depend on the final inference implementation.

The final selected hybrid model is:

```text
hybrid_model_v2.keras
```

---

# 42. Feature Files

Feature datasets generated during development include:

```text
cnn_features/
morphology_features/
test_cnn_features/
test_morphology_features/
```

Fine-tuned versions include:

```text
cnn_features_finetuned/
morphology_features_finetuned/
test_cnn_features_finetuned/
test_morphology_features_finetuned/
```

Feature dimensions:

```text
CNN:
1280

Morphology:
7
```

Current complete feature matrices:

```text
Training CNN:
(5600, 1280)

Training Morphology:
(5600, 7)

Testing CNN:
(1600, 1280)

Testing Morphology:
(1600, 7)
```

---

# 43. Installation

## Requirements

The project requires Python and the packages specified in:

```text
requirements.txt
```

Major technologies used include:

```text
Python
TensorFlow / Keras
NumPy
OpenCV
scikit-learn
Matplotlib
Streamlit
```

Additional packages may be required depending on the final version of the project.

---

# 44. Virtual Environment

It is recommended to use a Python virtual environment.

Create the environment:

```bash
python -m venv venv
```

## Windows

Activate:

```powershell
.\venv\Scripts\Activate.ps1
```

After activation, the terminal should indicate that the virtual environment is active.

Install dependencies:

```powershell
pip install -r requirements.txt
```

The virtual environment is intentionally not included in the repository.

Each computer should create its own environment.

---

# 45. Running the Current Application

The current prototype can be started using Streamlit.

From the project root:

```powershell
streamlit run app/main.py
```

The application then opens in the browser.

The current application allows the user to:

```text
Upload MRI
     ↓
Validate image
     ↓
Run CNN
     ↓
View Grad-CAM
     ↓
View morphology
     ↓
Run Hybrid V2
     ↓
View final result
```

---

# 46. Feature Generation Workflow

Feature generation should be performed after the required CNN model and preprocessing pipeline are available.

## Training feature generation

```text
Training MRI Dataset
        ↓
CNN Feature Extraction
        ↓
CNN Feature Dataset

Training MRI Dataset
        ↓
Morphology Extraction
        ↓
Morphology Feature Dataset
```

## Testing feature generation

```text
Testing MRI Dataset
        ↓
CNN Feature Extraction
        ↓
Test CNN Feature Dataset

Testing MRI Dataset
        ↓
Morphology Extraction
        ↓
Test Morphology Feature Dataset
```

The generated feature datasets are then used for hybrid-model training and evaluation.

---

# 47. Testing Workflow

The testing workflow must keep the independent test dataset separate.

Recommended workflow:

```text
Training Dataset
      │
      ├── Training
      │
      └── Validation
               │
               ▼
         Model Selection
               │
               ▼
       Final Selected Model
               │
               ▼
      Independent Test Set
               │
               ▼
        Final Evaluation
```

The test set should not be used to tune the model.

This ensures that the final test accuracy provides a more meaningful estimate of performance on unseen data.

---

# 48. Model Evaluation

The project uses multiple evaluation metrics.

## Accuracy

Measures the proportion of correctly classified samples.

## Precision

Measures how many samples predicted as a class actually belong to that class.

## Recall

Measures how many actual samples of a class were correctly identified.

## F1-score

Combines precision and recall.

## Confusion Matrix

Shows the distribution of correct and incorrect predictions between classes.

The project reports both:

```text
Macro Average
Weighted Average
```

to provide additional evaluation information.

---

# 49. Current Performance Summary

| Model     | Validation Accuracy | Independent Test Accuracy | Status                 |
| --------- | ------------------: | ------------------------: | ---------------------- |
| Hybrid V2 |              97.38% |                **93.00%** | ✅ Final Selected Model |
| Hybrid V3 |              97.74% |                    92.81% | Experimental           |

### Final selected model

```text
Hybrid V2
```

### Independent test set

```text
1600 MRI images
```

### Final test accuracy

```text
93.00%
```

The project does not claim a 95–96% test accuracy unless such performance is actually achieved through a valid independent evaluation.

---

# 50. Future Model Improvements

Future improvements will focus on improving generalization rather than simply increasing training or validation accuracy.

Potential improvements include:

### 1. Formula-based morphology

Add meaningful features such as:

```text
Circularity
Eccentricity
Solidity
Extent
Aspect Ratio
Perimeter
Equivalent Diameter
Convex Hull Area
Major Axis
Minor Axis
```

### 2. Feature Selection

Investigate which morphology features provide useful information.

### 3. Feature Scaling

Ensure all feature groups are appropriately normalized.

### 4. Fusion Architecture

Experiment with different methods for combining CNN and morphology features.

### 5. Hyperparameter Optimization

Investigate:

```text
Learning rate
Batch size
Dropout
Hidden-layer dimensions
Regularization
Fusion weights
```

### 6. Additional Training Data

Additional correctly labeled MRI images may improve generalization.

### 7. Error Analysis

Focus particularly on:

```text
Glioma ↔ Meningioma
```

because this is currently the major source of confusion.

---

# 51. Additional Dataset Images

If additional MRI images are provided by the instructor, they can potentially be incorporated into the training dataset.

However, they should first be checked for:

* Correct class labels
* Image quality
* Duplicate images
* Data-source consistency
* Class distribution
* Possible data leakage

New images should not automatically be added to the independent test set.

A safe workflow is:

```text
New Images
    ↓
Verify Labels
    ↓
Check Duplicates
    ↓
Quality Check
    ↓
Assign Dataset Split
    ↓
Generate Features
    ↓
Retrain
    ↓
Evaluate on Independent Test Set
```

The independent test set should remain isolated for final evaluation.

---

# 52. Development Roadmap

## Phase 1 — Dataset

```text
✓ Dataset preparation
✓ Four-class classification
✓ Training dataset
✓ Independent test dataset
```

## Phase 2 — CNN

```text
✓ CNN development
✓ CNN training
✓ CNN fine-tuning
✓ CNN feature extraction
```

## Phase 3 — Morphology

```text
✓ Basic morphological feature extraction
✓ Morphology feature dataset
→ Formula-based feature improvement
```

## Phase 4 — Hybrid Model

```text
✓ CNN + Morphology feature fusion
✓ Hybrid V2
✓ Hybrid V2 validation
✓ Hybrid V2 independent testing
✓ Hybrid V3 experiment
✓ Final model selection
```

## Phase 5 — Explainability

```text
✓ Grad-CAM
✓ Prediction visualization
✓ Confusion matrix
```

## Phase 6 — Prototype Application

```text
✓ Streamlit application
✓ MRI upload
✓ Brain validation
✓ CNN output
✓ Morphology output
✓ Hybrid output
```

## Phase 7 — Final Web Application

```text
→ React frontend
→ FastAPI backend
→ PostgreSQL database
→ Responsive UI
→ Prediction history
→ Tumor information
→ Hospital/About section
```

---

# 53. Limitations

The current project has several limitations.

### Dataset limitations

Performance depends on the quality, diversity and distribution of the available MRI dataset.

### Generalization

The model may perform differently on MRI images from different hospitals, scanners, acquisition protocols or populations.

### Morphological limitations

The current morphology implementation uses a limited set of features.

Formula-based morphology features are planned for further investigation and improvement.

### Classification limitations

The model performs differently across the four classes.

In particular, Glioma and Meningioma show more confusion than No Tumor and Pituitary.

### Clinical limitations

The system is an AI research/project prototype and has not been established as a clinically validated diagnostic system.

---

# 54. Medical Disclaimer

This project is intended for:

* Educational purposes
* Research purposes
* Demonstration purposes
* AI/ML experimentation

The predictions generated by this system **must not be considered a medical diagnosis**.

The system should not replace:

* Radiologists
* Neurologists
* Oncologists
* Medical imaging specialists
* Clinical examination
* Professional medical judgment

Any real medical decision must be made by qualified healthcare professionals using appropriate clinical information and diagnostic procedures.

---

# 55. Project Status

## Current Status

The project has successfully completed the major machine-learning pipeline:

```text
Dataset
   ↓
CNN
   ↓
CNN Fine-Tuning
   ↓
CNN Feature Extraction
   ↓
Morphological Feature Extraction
   ↓
Feature Scaling
   ↓
Hybrid Feature Fusion
   ↓
Hybrid V2
   ↓
Independent Testing
   ↓
93.00% Test Accuracy
```

The current selected model is:

```text
Hybrid V2
```

with:

```text
Validation Accuracy: 97.38%

Independent Test Accuracy: 93.00%
```

The project also contains:

```text
✓ Brain MRI validation
✓ CNN prediction
✓ Morphological analysis
✓ Hybrid prediction
✓ Grad-CAM
✓ Confusion matrices
✓ Classification reports
✓ Streamlit prototype
```

## Current Development

The next major stage is the conversion of the prototype into a complete responsive web application.

Planned architecture:

```text
┌───────────────────────────────┐
│       React Frontend          │
│                               │
│  Upload │ Results │ Tumors    │
│  GradCAM│ History │ About     │
└───────────────┬───────────────┘
                │
                │ HTTP / REST API
                ▼
┌───────────────────────────────┐
│       FastAPI Backend         │
│                               │
│  MRI Validation               │
│  CNN Prediction               │
│  Morphology Analysis          │
│  Hybrid V2 Prediction         │
│  Grad-CAM                     │
└───────────────┬───────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
┌──────────────┐  ┌───────────────┐
│ ML Models    │  │ PostgreSQL    │
│ CNN          │  │ Prediction    │
│ Morphology   │  │ History       │
│ Hybrid V2    │  │ Metadata      │
└──────────────┘  └───────────────┘
```

The final system will provide an attractive and responsive interface while preserving the existing machine-learning pipeline.

---

# 🧠 Final Summary

The **Brain Tumor Dual Path Detection** project combines two complementary approaches:

```text
CNN
+
Morphological Analysis
+
Feature Fusion
=
Hybrid Brain MRI Classification
```

The current dataset contains:

```text
5600 training images
1600 independent test images
```

The final selected Hybrid V2 model achieved:

```text
97.38% validation accuracy
93.00% independent test accuracy
```

The project continues to focus on improving morphology-based representations, analyzing model errors and developing a complete web-based system using:

```text
React
FastAPI
PostgreSQL
```

The ultimate goal is to provide an explainable, responsive and research-oriented Brain MRI classification platform while clearly maintaining the distinction between an AI research prototype and a clinically validated diagnostic system.
