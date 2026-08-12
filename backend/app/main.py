from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.routes.auth import router as auth_router
from backend.app.routes.prediction import router as prediction_router
from backend.app.routes.tumors import router as tumor_router


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="Brain Tumor Dual Path API",
    description="Backend API for Brain MRI tumor analysis",
    version="1.0.0",
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# =====================================================
# STATIC FILES
# =====================================================

# Generated Grad-CAM images
app.mount(
    "/static",
    StaticFiles(
        directory="backend/static"
    ),
    name="static",
)


# Uploaded MRI images
app.mount(
    "/uploads",
    StaticFiles(
        directory="backend/uploads"
    ),
    name="uploads",
)


# =====================================================
# API ROUTES
# =====================================================

app.include_router(
    auth_router
)

app.include_router(
    prediction_router
)

app.include_router(
    tumor_router
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {
        "message": "Brain Tumor Dual Path API",
        "status": "running",
    }


# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Brain Tumor Dual Path API",
    }