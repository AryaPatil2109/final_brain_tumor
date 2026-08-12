import os
import uuid
from pathlib import Path

from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi import status

from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import Prediction
from backend.app.models import User
from backend.app.security import get_current_user
from backend.app.services.predictor import BrainTumorMLService


router = APIRouter(
    prefix="/api",
    tags=["Prediction"],
)


# =====================================================
# ML SERVICE
# =====================================================

ml_service = BrainTumorMLService()


# =====================================================
# DIRECTORIES
# =====================================================

UPLOAD_DIR = Path("backend/uploads")

GRADCAM_DIR = Path(
    "backend/static/gradcam"
)


UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

GRADCAM_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =====================================================
# ALLOWED IMAGE TYPES
# =====================================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
}


# =====================================================
# HELPER
# =====================================================

def prediction_to_dict(
    prediction: Prediction,
) -> dict:
    """
    Convert a Prediction database object
    into a JSON-friendly dictionary.
    """

    return {
        "id": prediction.id,

        "user_id": prediction.user_id,

        "prediction": prediction.prediction,

        "confidence": prediction.confidence,

        "image_url": prediction.image_path,

        "gradcam_url": prediction.gradcam_path,

        "created_at": prediction.created_at,
    }


# =====================================================
# PREDICTION
# =====================================================

@router.post("/predict")
async def predict_mri(
    file: UploadFile = File(...),
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    """
    Upload an MRI image, run the complete ML pipeline,
    generate Grad-CAM and save the prediction.
    """

    # -------------------------------------------------
    # 1. Validate uploaded file
    # -------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file was uploaded.",
        )


    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only JPG, JPEG and PNG "
                "MRI images are supported."
            ),
        )


    # -------------------------------------------------
    # 2. Generate unique filename
    # -------------------------------------------------

    unique_id = uuid.uuid4().hex

    image_filename = (
        f"{unique_id}{extension}"
    )

    image_path = (
        UPLOAD_DIR / image_filename
    )


    # -------------------------------------------------
    # 3. Save uploaded MRI
    # -------------------------------------------------

    try:

        with open(
            image_path,
            "wb",
        ) as buffer:

            while True:

                chunk = await file.read(
                    1024 * 1024
                )

                if not chunk:
                    break

                buffer.write(chunk)

    except Exception as exc:

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to save uploaded image: "
                f"{exc}"
            ),
        )


    # -------------------------------------------------
    # 4. Run ML prediction
    # -------------------------------------------------

    try:

        result = ml_service.predict(
            str(image_path)
        )

    except Exception as exc:

        if image_path.exists():

            os.remove(image_path)

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Prediction failed: "
                f"{exc}"
            ),
        )


    # -------------------------------------------------
    # 5. Original image URL
    # -------------------------------------------------

    image_url = (
        f"/uploads/{image_filename}"
    )


    # -------------------------------------------------
    # 6. Invalid/non-brain image
    # -------------------------------------------------

    if not result.get(
        "valid_brain",
        False,
    ):

        return {
            "success": True,

            "prediction_id": None,

            "user_id": current_user.id,

            "prediction": result.get(
                "prediction"
            ),

            "confidence": result.get(
                "confidence"
            ),

            "probabilities": result.get(
                "probabilities"
            ),

            "cnn": result.get(
                "cnn"
            ),

            "validation": result.get(
                "validation"
            ),

            "morphology": result.get(
                "morphology"
            ),

            "image_url": image_url,

            "gradcam_url": None,

            "gradcam_error": None,

            "valid_brain": False,
        }


    # -------------------------------------------------
    # 7. Generate Grad-CAM
    # -------------------------------------------------

    gradcam_filename = (
        f"{unique_id}_gradcam.jpg"
    )

    gradcam_path = (
        GRADCAM_DIR / gradcam_filename
    )

    gradcam_url = None
    gradcam_error = None


    try:

        ml_service.generate_gradcam(
            str(image_path),
            str(gradcam_path),
        )

        gradcam_url = (
            f"/static/gradcam/"
            f"{gradcam_filename}"
        )

    except Exception as exc:

        gradcam_error = str(exc)


    # -------------------------------------------------
    # 8. Save prediction to PostgreSQL
    # -------------------------------------------------

    try:

        prediction_value = result.get(
            "prediction",
            "Unknown",
        )

        confidence_value = result.get(
            "confidence",
            0.0,
        )


        prediction_record = Prediction(
            user_id=current_user.id,

            prediction=str(
                prediction_value
            ),

            confidence=float(
                confidence_value
            ),

            image_path=image_url,

            gradcam_path=gradcam_url,
        )


        db.add(
            prediction_record
        )

        db.commit()

        db.refresh(
            prediction_record
        )

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Prediction was completed, "
                "but saving the prediction "
                f"to the database failed: {exc}"
            ),
        )


    # -------------------------------------------------
    # 9. Final response
    # -------------------------------------------------

    return {
        "success": True,

        "prediction_id": (
            prediction_record.id
        ),

        "user_id": (
            current_user.id
        ),

        "prediction": result.get(
            "prediction"
        ),

        "confidence": result.get(
            "confidence"
        ),

        "probabilities": result.get(
            "probabilities"
        ),

        "cnn": result.get(
            "cnn"
        ),

        "validation": result.get(
            "validation"
        ),

        "morphology": result.get(
            "morphology"
        ),

        "image_url": image_url,

        "gradcam_url": gradcam_url,

        "gradcam_error": gradcam_error,

        "valid_brain": result.get(
            "valid_brain",
            True,
        ),
    }


# =====================================================
# PREDICTION HISTORY
# =====================================================

@router.get("/predictions/history")
def get_prediction_history(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    """
    Return prediction history belonging only
    to the currently authenticated user.
    """

    predictions = (
        db.query(Prediction)
        .filter(
            Prediction.user_id
            == current_user.id
        )
        .order_by(
            Prediction.created_at.desc()
        )
        .all()
    )


    return {
        "success": True,

        "count": len(predictions),

        "predictions": [
            prediction_to_dict(
                prediction
            )
            for prediction in predictions
        ],
    }


# =====================================================
# SINGLE PREDICTION
# =====================================================

@router.get(
    "/predictions/{prediction_id}"
)
def get_prediction(
    prediction_id: int,

    current_user: User = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db),
):
    """
    Return one prediction belonging to the
    currently authenticated user.
    """

    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id,

            Prediction.user_id
            == current_user.id,
        )
        .first()
    )


    if not prediction:

        raise HTTPException(
            status_code=(
                status.HTTP_404_NOT_FOUND
            ),
            detail="Prediction not found.",
        )


    return {
        "success": True,

        "prediction": prediction_to_dict(
            prediction
        ),
    }