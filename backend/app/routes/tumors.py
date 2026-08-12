from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models import TumorType


router = APIRouter(
    prefix="/api/tumors",
    tags=["Tumor Information"],
)


# =====================================================
# HELPER
# =====================================================

def tumor_to_dict(
    tumor: TumorType,
) -> dict:
    """
    Convert a TumorType database object
    into a JSON-friendly dictionary.
    """

    return {
        "id": tumor.id,

        "name": tumor.name,

        "display_name": tumor.display_name,

        "short_description": (
            tumor.short_description
        ),

        "description": (
            tumor.description
        ),

        "symptoms": tumor.symptoms,

        "causes": tumor.causes,

        "risk_factors": (
            tumor.risk_factors
        ),

        "diagnosis": tumor.diagnosis,

        "treatment": tumor.treatment,

        "prognosis": tumor.prognosis,

        "mri_image": tumor.mri_image,

        "created_at": tumor.created_at,

        "updated_at": tumor.updated_at,
    }


# =====================================================
# GET ALL TUMOR TYPES
# =====================================================

@router.get("")
def get_all_tumors(
    db: Session = Depends(get_db),
):
    """
    Return all tumor information stored
    in the tumor_types table.
    """

    tumors = (
        db.query(TumorType)
        .order_by(
            TumorType.id.asc()
        )
        .all()
    )

    return {
        "success": True,

        "count": len(tumors),

        "tumors": [
            tumor_to_dict(tumor)
            for tumor in tumors
        ],
    }


# =====================================================
# GET SINGLE TUMOR
# =====================================================

@router.get("/{tumor_name}")
def get_tumor(
    tumor_name: str,
    db: Session = Depends(get_db),
):
    """
    Return information about one tumor type.
    """

    tumor = (
        db.query(TumorType)
        .filter(
            TumorType.name
            == tumor_name.lower()
        )
        .first()
    )

    if not tumor:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=(
                f"Tumor type '{tumor_name}' "
                "was not found."
            ),
        )

    return {
        "success": True,
        "tumor": tumor_to_dict(tumor),
    }