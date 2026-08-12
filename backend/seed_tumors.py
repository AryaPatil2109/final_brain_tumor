from backend.app.database import SessionLocal
from backend.app.models import TumorType

tumors = [
    {
        "name": "glioma",
        "display_name": "Glioma",
        "short_description": "A tumor that develops from glial cells in the brain.",
        "description": "Gliomas are brain tumors that arise from glial cells and can vary in grade and severity.",
        "symptoms": "Headaches, seizures, nausea, vision problems, memory problems, and changes in behavior.",
        "causes": "The exact cause is often unknown. Genetic changes can contribute to tumor development.",
        "risk_factors": "Certain genetic conditions, previous radiation exposure, and increasing age.",
        "diagnosis": "MRI, neurological examination, biopsy, and other imaging tests.",
        "treatment": "Treatment may include surgery, radiation therapy, chemotherapy, targeted therapy, or a combination.",
        "prognosis": "Prognosis depends on tumor grade, location, size, molecular characteristics, and response to treatment.",
        "mri_image": None,
    },
    {
        "name": "meningioma",
        "display_name": "Meningioma",
        "short_description": "A tumor that develops from the membranes surrounding the brain and spinal cord.",
        "description": "Meningiomas develop from the meninges, the protective layers surrounding the brain and spinal cord.",
        "symptoms": "Headaches, seizures, vision problems, weakness, memory changes, and balance problems.",
        "causes": "The exact cause is generally unknown, although genetic and environmental factors may play a role.",
        "risk_factors": "Age, female sex, certain genetic conditions, and previous radiation exposure.",
        "diagnosis": "MRI or CT imaging, neurological examination, and sometimes biopsy.",
        "treatment": "Observation, surgery, radiation therapy, or a combination depending on size, location, and symptoms.",
        "prognosis": "Many meningiomas are slow-growing and have a favorable prognosis, although some can be aggressive.",
        "mri_image": None,
    },
    {
        "name": "pituitary",
        "display_name": "Pituitary Tumor",
        "short_description": "A tumor that develops in or around the pituitary gland.",
        "description": "Pituitary tumors are abnormal growths in the pituitary gland and may affect hormone production.",
        "symptoms": "Headaches, vision changes, hormonal problems, fatigue, and changes in body function.",
        "causes": "The exact cause is usually unknown.",
        "risk_factors": "Certain inherited genetic conditions and family history.",
        "diagnosis": "MRI, hormone testing, vision testing, and neurological examination.",
        "treatment": "Medication, surgery, radiation therapy, or observation depending on the tumor.",
        "prognosis": "Most pituitary tumors are treatable, with prognosis depending on tumor type, size, and hormone activity.",
        "mri_image": None,
    },
    {
        "name": "no_tumor",
        "display_name": "No Tumor",
        "short_description": "No brain tumor is detected in the MRI image.",
        "description": "The MRI image does not show evidence of one of the tumor classes supported by the system.",
        "symptoms": "No tumor-specific symptoms are associated with this classification.",
        "causes": "Not applicable when no tumor is detected.",
        "risk_factors": "Not applicable when no tumor is detected.",
        "diagnosis": "MRI analysis and clinical evaluation are used to determine whether a tumor is present.",
        "treatment": "No tumor-specific treatment is indicated based solely on this classification.",
        "prognosis": "A no-tumor classification indicates that the analyzed image was not classified as one of the supported tumor types.",
        "mri_image": None,
    },
]

db = SessionLocal()

try:
    for data in tumors:
        existing = (
            db.query(TumorType)
            .filter(TumorType.name == data["name"])
            .first()
        )

        if not existing:
            db.add(TumorType(**data))
            print(f"Added: {data['name']}")
        else:
            print(f"Already exists: {data['name']}")

    db.commit()

    print("All tumor data inserted successfully.")

finally:
    db.close()