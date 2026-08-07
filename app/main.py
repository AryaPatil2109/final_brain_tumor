import os
import sys

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
import streamlit as st
from predict_page import show_predict_page

st.set_page_config(
    page_title="Brain Tumor Dual Path Detection",
    page_icon="🧠",
    layout="wide"
)

st.title("🧠 Brain Tumor Detection using Dual Path Network")

st.markdown("---")

show_predict_page()