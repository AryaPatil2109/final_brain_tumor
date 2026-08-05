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