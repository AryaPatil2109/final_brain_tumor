# 🧠 Brain Tumor Dual Path Detection

An AI-powered Brain MRI classification system that uses a **Dual-Path Deep Learning Architecture** combining:

- 🧠 CNN-based deep visual features
- 🔬 Morphological image features
- 🔗 Hybrid feature fusion
- 🔥 Grad-CAM explainability
- 🛡️ Brain MRI image validation
- 📊 Comprehensive model evaluation

The system classifies Brain MRI images into four categories:

1. **Glioma**
2. **Meningioma**
3. **No Tumor**
4. **Pituitary**

The current best-performing hybrid model is **Hybrid V2**, which achieved **93.00% accuracy on an independent test dataset of 1,600 MRI images**.

The project is currently being developed from a Streamlit prototype toward a complete responsive web application using:

- **React** — Frontend
- **FastAPI** — Backend
- **PostgreSQL** — Database

---

# 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Tumor Classes](#-tumor-classes)
- [System Architecture](#-system-architecture)
- [Dual Path Architecture](#-dual-path-architecture)
- [CNN Path](#-cnn-path)
- [Morphology Path](#-morphology-path)
- [Hybrid Feature Fusion](#-hybrid-feature-fusion)
- [Dataset](#-dataset)
- [Dataset Distribution](#-dataset-distribution)
- [Data Preprocessing](#-data-preprocessing)
- [CNN Training](#-cnn-training)
- [CNN Fine-Tuning](#-cnn-fine-tuning)
- [CNN Feature Extraction](#-cnn-feature-extraction)
- [Morphological Feature Extraction](#-morphological-feature-extraction)
- [Feature Dataset](#-feature-dataset)
- [Train Validation Split](#-train-validation-split)
- [Hybrid Model Training](#-hybrid-model-training)
- [Hybrid V2 Results](#-hybrid-v2-results)
- [Hybrid V3 Experiment](#-hybrid-v3-experiment)
- [Model Comparison](#-model-comparison)
- [Confusion Matrix](#-confusion-matrix)
- [Grad-CAM Explainability](#-grad-cam-explainability)
- [Brain MRI Validation](#-brain-mri-validation)
- [Current Streamlit Application](#-current-streamlit-application)
- [Planned React Frontend](#-planned-react-frontend)
- [Planned FastAPI Backend](#-planned-fastapi-backend)
- [Planned PostgreSQL Database](#-planned-postgresql-database)
- [Tumor Information Section](#-tumor-information-section)
- [About Section](#-about-section)
- [Project Structure](#-project-structure)
- [Important Files](#-important-files)
- [Model Files](#-model-files)
- [Feature Files](#-feature-files)
- [Installation](#-installation)
- [Virtual Environment](#-virtual-environment)
- [Running the Current Application](#-running-the-current-application)
- [Feature Generation Workflow](#-feature-generation-workflow)
- [Testing Workflow](#-testing-workflow)
- [Model Evaluation](#-model-evaluation)
- [Current Performance](#-current-performance)
- [Future Morphology Improvements](#-future-morphology-improvements)
- [Future Model Improvements](#-future-model-improvements)
- [Development Roadmap](#-development-roadmap)
- [Limitations](#-limitations)
- [Medical Disclaimer](#-medical-disclaimer)
- [Project Status](#-project-status)

---

# 🧠 Project Overview

Brain tumors are abnormal growths of cells within or around the brain. Magnetic Resonance Imaging (MRI) is widely used for visualizing brain structures and identifying abnormalities.

Automatic classification of brain MRI images can assist researchers and medical professionals by providing an additional computational analysis of MRI images.

This project develops an AI-based system capable of classifying brain MRI images into four categories:

```text
                    Brain MRI Image
                           │
                           ▼
                 Image Preprocessing
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
          CNN PATH                MORPHOLOGY PATH
              │                         │
              ▼                         ▼
      Deep Visual Features      Structural Features
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                    Feature Fusion
                           │
                           ▼
                    Hybrid Model
                           │
                           ▼
                  Final Classification