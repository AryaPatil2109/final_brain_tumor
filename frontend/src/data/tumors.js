/**
 * Tumor data for NeuroScan AI
 * Source: Brain Tumor Dual Path Classification System
 * Classes: glioma, meningioma, pituitary, notumor
 *
 * TODO: Replace with GET /api/tumors from FastAPI/PostgreSQL
 */

export const tumors = [
  {
    slug: "glioma",
    name: "Glioma",
    shortDescription:
      "A tumor arising from glial cells of the brain and spinal cord.",
    type: "Primary Brain Tumor",
    category: "Malignant / Benign (varies by grade)",
    color: "#1769AA",
    overview:
      "Gliomas are a broad category of brain tumors that arise from the supportive (glial) cells of the central nervous system. They account for approximately 33% of all brain tumors and can occur anywhere in the brain or spinal cord. Gliomas are classified by the type of glial cell involved and by grade (I–IV), with grade IV glioblastoma being the most aggressive.",
    whatIsIt:
      "Gliomas originate from glial cells — the non-neuronal cells in the brain that provide structural support and protection to neurons. Common types include astrocytomas, oligodendrogliomas, and glioblastomas. The grade of a glioma reflects how quickly the tumor grows and how aggressive it is.",
    characteristics: [
      "Arise from supportive glial cells of the CNS",
      "Classified by grade (I–IV) based on aggressiveness",
      "Can be primary (originate in brain) or secondary",
      "May occur in cerebral hemispheres, brainstem, or cerebellum",
      "Grade IV glioblastoma (GBM) is the most common and aggressive type",
      "Can be either malignant or benign depending on grade",
    ],
    symptoms: [
      { icon: "🧠", label: "Persistent or worsening headaches" },
      { icon: "⚡", label: "Seizures or convulsions" },
      { icon: "👁️", label: "Vision or hearing problems" },
      { icon: "💬", label: "Speech or language difficulties" },
      { icon: "🤲", label: "Weakness or numbness in limbs" },
      { icon: "🧩", label: "Cognitive changes or memory problems" },
      { icon: "🤢", label: "Nausea and vomiting" },
      { icon: "⚖️", label: "Balance and coordination problems" },
    ],
    diagnosis:
      "Diagnosis involves a combination of neurological examination, brain MRI with and without contrast, CT scanning, and in many cases, surgical biopsy for histopathological confirmation. Advanced imaging techniques including MR spectroscopy and perfusion imaging may be used to assess tumor characteristics.",
    treatment:
      "Treatment depends on grade, location, and patient factors. Options include surgical resection (where safe), radiation therapy, chemotherapy (temozolomide for GBM), targeted therapy, and clinical trials. A multidisciplinary oncology team determines the optimal treatment plan.",
    mriAppearance:
      "On MRI, gliomas often appear as poorly defined regions with surrounding edema. Higher-grade gliomas typically show ring-like enhancement with contrast agents. T2/FLAIR sequences are particularly useful for delineating tumor extent and edema.",
    prognosis:
      "Prognosis varies significantly by grade. Low-grade gliomas may have a more favorable outlook with appropriate management, while high-grade glioblastoma has a more guarded prognosis. Treatment advances continue to evolve in this area.",
    image: "/mri_glioma.png",
    imageCaption: "Representative brain MRI — Glioma (T1 contrast-enhanced)",
  },
  {
    slug: "meningioma",
    name: "Meningioma",
    shortDescription:
      "A tumor arising from the meninges, the protective membranes surrounding the brain and spinal cord.",
    type: "Primary Brain Tumor",
    category: "Usually Benign (Grade I–III)",
    color: "#0F9D9A",
    overview:
      "Meningiomas are the most common type of primary brain tumor, accounting for approximately 37% of all primary brain tumors. They arise from the meninges — the three layers of tissue (dura mater, arachnoid, pia mater) that cover the brain and spinal cord. The large majority of meningiomas are benign (Grade I), though some are atypical (Grade II) or malignant (Grade III).",
    whatIsIt:
      "Meningiomas originate from meningothelial cells in the arachnoid layer of the meninges. They are typically slow-growing and often discovered incidentally on imaging. Because they grow from the membrane surrounding the brain rather than within it, many meningiomas can be completely surgically removed.",
    characteristics: [
      "Most common type of primary brain tumor",
      "Arise from the arachnoid layer of the meninges",
      "Typically slow-growing and often benign (Grade I)",
      "More common in women than men",
      "Can occur anywhere along the meninges",
      "Often discovered incidentally on brain imaging",
      "May cause symptoms by compressing adjacent brain tissue",
      "Atypical (Grade II) and malignant (Grade III) forms exist",
    ],
    symptoms: [
      { icon: "🧠", label: "Headaches, especially in the morning" },
      { icon: "👁️", label: "Vision changes or loss" },
      { icon: "👂", label: "Hearing loss (for certain locations)" },
      { icon: "⚡", label: "Seizures" },
      { icon: "💬", label: "Weakness or numbness" },
      { icon: "🧩", label: "Memory or concentration difficulties" },
      { icon: "🤲", label: "Loss of smell (olfactory meningioma)" },
      { icon: "⚖️", label: "Balance problems" },
    ],
    diagnosis:
      "Meningiomas are typically identified on MRI with gadolinium contrast, which shows characteristic homogeneous enhancement. A 'dural tail' sign — enhancement extending along the dura — is a classic imaging feature. CT may reveal calcification. Biopsy or surgical resection provides histopathological confirmation.",
    treatment:
      "Small, asymptomatic meningiomas may be managed with active surveillance and periodic imaging. Symptomatic or growing tumors are typically treated with surgical resection. Stereotactic radiosurgery (e.g., Gamma Knife) is an option for smaller or surgically inaccessible tumors. Radiation therapy may be used for higher-grade or recurrent tumors.",
    mriAppearance:
      "Meningiomas typically appear as well-defined, extra-axial masses that enhance homogeneously with contrast. A characteristic 'dural tail' of enhancement along the adjacent meninges is commonly seen. They may cause displacement of adjacent brain structures.",
    prognosis:
      "For Grade I (benign) meningiomas, the prognosis after complete surgical resection is generally favorable, with a low recurrence rate. Higher-grade meningiomas carry a higher risk of recurrence and may require additional treatment.",
    image: "/mri_meningioma.png",
    imageCaption: "Representative brain MRI — Meningioma (T1 contrast-enhanced)",
  },
  {
    slug: "pituitary",
    name: "Pituitary Tumor",
    shortDescription:
      "A tumor arising from the pituitary gland, a small hormone-producing gland at the base of the brain.",
    type: "Pituitary/Sellar Region Tumor",
    category: "Usually Benign (Adenoma)",
    color: "#1769AA",
    overview:
      "Pituitary tumors (pituitary adenomas) are abnormal growths that develop in the pituitary gland. The pituitary gland is a small, pea-sized structure at the base of the brain that controls hormone production for many body functions. Pituitary adenomas are almost always benign and are classified by size (microadenoma < 10mm, macroadenoma ≥ 10mm) and by whether they produce excess hormones (functional) or not (non-functional).",
    whatIsIt:
      "Pituitary adenomas originate from the cells of the anterior pituitary gland. They can be hormone-secreting (causing hormonal disorders such as acromegaly, Cushing's disease, or hyperprolactinemia) or non-secreting. Because of their central location near the optic chiasm, they can cause characteristic visual field defects.",
    characteristics: [
      "Arise from the anterior pituitary gland",
      "Located at the base of the brain (sella turcica)",
      "Almost always benign (adenomas)",
      "Classified as micro (< 10mm) or macroadenoma (≥ 10mm)",
      "May be hormone-secreting (functional) or non-secreting",
      "Can compress the optic chiasm causing visual field defects",
      "May cause hypopituitarism by compressing normal pituitary tissue",
      "Prolactinoma is the most common functioning type",
    ],
    symptoms: [
      { icon: "👁️", label: "Peripheral vision loss (bitemporal hemianopia)" },
      { icon: "🧠", label: "Headaches" },
      { icon: "⚖️", label: "Hormonal imbalances (depends on tumor type)" },
      {
        icon: "📈",
        label: "Acromegaly (excess growth hormone — abnormal growth)",
      },
      { icon: "🌙", label: "Fatigue and weakness" },
      { icon: "💊", label: "Nausea and vomiting" },
      { icon: "🌡️", label: "Weight changes" },
      { icon: "💉", label: "Infertility or sexual dysfunction" },
    ],
    diagnosis:
      "MRI of the pituitary with gadolinium contrast is the primary imaging modality. Hormone blood tests are essential to identify functional tumors. A formal visual field examination (perimetry) is performed when optic chiasm compression is suspected. Biopsy is typically obtained at the time of surgical resection.",
    treatment:
      "Treatment depends on tumor type, size, and hormonal function. Prolactinomas are typically managed with dopamine agonist medications (cabergoline, bromocriptine). Other functioning and non-functioning tumors are often treated with trans-sphenoidal surgical resection. Radiation therapy (including stereotactic radiosurgery) may be used for residual or recurrent disease.",
    mriAppearance:
      "Pituitary microadenomas appear as small hypointense lesions within the pituitary gland on T1-weighted contrast MRI. Macroadenomas appear as larger sellar masses that may extend superiorly (suprasellar extension) toward the optic chiasm or laterally into the cavernous sinus.",
    prognosis:
      "Most pituitary tumors are benign with a favorable prognosis after appropriate treatment. Functional tumors may require ongoing medical management and monitoring. Recurrence can occur and long-term follow-up is standard practice.",
    image: "/mri_pituitary.png",
    imageCaption: "Representative brain MRI — Pituitary Tumor (T1 contrast-enhanced)",
  },
  {
    slug: "notumor",
    name: "No Tumor",
    shortDescription:
      "Brain MRI scan classified as showing no detectable tumor.",
    type: "Normal / No Pathology Detected",
    category: "Normal Brain MRI",
    color: "#0F9D9A",
    overview:
      "A 'No Tumor' classification indicates that the AI model did not detect imaging features characteristic of glioma, meningioma, or pituitary tumor in the submitted MRI scan. This classification is provided for educational and research purposes only and does not constitute a clinical evaluation of a brain MRI.",
    whatIsIt:
      "In the context of this classification system, 'No Tumor' refers to brain MRI images that do not display the visual characteristics associated with the three tumor classes in the training dataset. A normal brain MRI shows the expected structures of the brain without identifiable masses, abnormal enhancement, or significant structural abnormalities associated with the three tumor types.",
    characteristics: [
      "No detectable tumor features in the AI classification output",
      "Normal brain parenchymal appearance (in most cases)",
      "No significant mass effect or midline shift",
      "No abnormal contrast enhancement pattern",
      "Normal ventricular size and configuration",
      "Expected gray and white matter differentiation",
    ],
    symptoms: [
      { icon: "✅", label: "No tumor-related symptoms expected" },
      { icon: "ℹ️", label: "Other conditions may still be present" },
      {
        icon: "🏥",
        label: "Professional evaluation needed for complete assessment",
      },
    ],
    diagnosis:
      "A 'No Tumor' result from this AI system does not replace professional clinical evaluation. Brain MRI interpretation by a qualified radiologist or neuroradiologist is required for any clinical assessment. Other pathological processes not covered by this model (vascular disease, infection, trauma, demyelination, etc.) are not evaluated by this system.",
    treatment:
      "No tumor-specific treatment is applicable based on this classification. Any brain-related symptoms should be evaluated by a qualified healthcare professional regardless of this AI classification.",
    mriAppearance:
      "Normal brain MRI images show symmetric brain structures, clear gray-white matter differentiation, normal ventricular system, and no abnormal signal intensities or enhancement patterns. Representative images in the training dataset show brains without detectable masses.",
    prognosis:
      "An AI 'No Tumor' classification does not provide clinical prognostic information. Complete medical evaluation is essential for any health concerns.",
    image: "/mri_notumor.png",
    imageCaption: "Representative brain MRI — Normal Brain (T1 sequence)",
  },
];

/**
 * Get all tumors (used for Tumor Guide page)
 * @returns {Array} All tumor objects
 */
export const getAllTumors = () => tumors;

/**
 * Get a single tumor by slug
 * @param {string} slug - Tumor slug (e.g. "glioma")
 * @returns {Object|null} Tumor object or null
 */
export const getTumorBySlug = (slug) =>
  tumors.find((t) => t.slug === slug) || null;

/**
 * Display name mapping for model output classes
 * Maps raw model class names to display names
 */
export const CLASS_DISPLAY_NAMES = {
  glioma: "Glioma",
  meningioma: "Meningioma",
  pituitary: "Pituitary Tumor",
  notumor: "No Tumor",
};

export default tumors;
