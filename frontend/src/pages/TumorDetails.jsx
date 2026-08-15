import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  MapPin,
  Stethoscope,
  Activity,
  Scan,
  Pill,
  Info,
} from "lucide-react";

/* =========================================================
   TUMOR DATA
========================================================= */

const TUMORS = {
  glioma: {
    slug: "glioma",
    name: "Glioma",
    category: "Brain Tumor",
    type: "Glioma",

    overview:
      "Gliomas are tumors that arise from glial cells, which are supporting cells of the central nervous system. They include several different tumor types and grades, ranging from relatively slow-growing tumors to more aggressive forms.",

    whatIsIt:
      "A glioma is a primary tumor of the central nervous system that originates from glial or glial-lineage cells. Its behavior depends on the specific type, molecular characteristics, and grade of the tumor.",

    location:
      "Gliomas can occur in different parts of the brain or spinal cord. Their symptoms and effects depend strongly on the location and structures involved.",

    characteristics: [
      "Originates from glial or glial-lineage cells.",
      "Can occur in different regions of the brain and spinal cord.",
      "Tumor behavior varies considerably between grades and subtypes.",
      "Higher-grade gliomas may grow more rapidly and infiltrate surrounding brain tissue.",
      "MRI is commonly used to evaluate tumor location, size, and imaging characteristics.",
    ],

    symptoms: [
      "Headaches",
      "Seizures",
      "Nausea or vomiting",
      "Changes in vision",
      "Weakness or numbness",
      "Changes in speech, memory, or coordination",
    ],

    diagnosis:
      "Evaluation may include neurological examination and brain imaging such as MRI. Depending on the clinical situation, additional imaging, laboratory evaluation, molecular testing, or tissue sampling may be used to determine the exact tumor type and grade.",

    treatment:
      "Treatment depends on the tumor type, grade, location, molecular characteristics, and the patient's overall condition. Depending on the case, treatment may involve surgery, radiation therapy, chemotherapy or other systemic therapies, and regular follow-up imaging.",

    prognosis:
      "Prognosis varies substantially between glioma subtypes and grades. Factors such as tumor type, molecular characteristics, location, extent of treatment, and overall health influence the expected course.",

    mriAppearance:
      "On MRI, gliomas may appear as areas of abnormal signal intensity. Appearance varies with tumor type and grade. Contrast enhancement, surrounding edema, mass effect, and infiltration may be present in some tumors.",

    image: "/mri_glioma.png",
    imageCaption: "Representative glioma MRI reference image.",
  },

  meningioma: {
    slug: "meningioma",
    name: "Meningioma",
    category: "Brain Tumor",
    type: "Meningioma",

    overview:
      "Meningiomas arise from the meninges, the protective membranes surrounding the brain and spinal cord. Many meningiomas grow relatively slowly, although their behavior can vary depending on their grade and characteristics.",

    whatIsIt:
      "A meningioma is a tumor arising from cells associated with the meninges. Although many are slow-growing, a meningioma can cause symptoms when it becomes large enough to compress nearby brain tissue, nerves, or other structures.",

    location:
      "Meningiomas can develop along different surfaces of the brain and spinal cord, including areas near the skull base, convexity, falx, or other dural surfaces.",

    characteristics: [
      "Arises from tissues associated with the meninges.",
      "Often appears attached to the dura on imaging.",
      "Many meningiomas are slow-growing.",
      "Large tumors may produce pressure on adjacent brain structures.",
      "Tumor grade influences biological behavior and recurrence risk.",
    ],

    symptoms: [
      "Headaches",
      "Seizures",
      "Vision problems",
      "Weakness or numbness",
      "Balance or coordination problems",
      "Changes in cognitive function",
    ],

    diagnosis:
      "Diagnosis commonly begins with neurological assessment and MRI or other brain imaging. Imaging can demonstrate the location and structural characteristics of the lesion. Tissue examination may be performed when necessary to establish the exact pathological diagnosis and grade.",

    treatment:
      "Management depends on tumor size, location, growth rate, symptoms, grade, and the patient's overall health. Options may include observation with serial imaging, surgical removal, and radiation-based treatment in selected cases.",

    prognosis:
      "Many meningiomas have a favorable course, particularly when they are slow-growing and can be completely treated. Prognosis depends on tumor grade, location, extent of removal, and other individual factors.",

    mriAppearance:
      "Meningiomas commonly appear as well-defined extra-axial masses adjacent to the dura. They may demonstrate strong enhancement after contrast administration. Imaging appearance can vary depending on location and tumor characteristics.",

    image: "/mri_meningioma.png",
    imageCaption: "Representative meningioma MRI reference image.",
  },

  pituitary: {
    slug: "pituitary",
    name: "Pituitary Tumor",
    category: "Brain Tumor",
    type: "Pituitary Tumor",

    overview:
      "Pituitary tumors develop in or around the pituitary gland, a small gland located near the base of the brain. These tumors may affect hormone production or cause symptoms by pressing on nearby structures.",

    whatIsIt:
      "Pituitary tumors are abnormal growths involving the pituitary region. Many are benign, but they can still cause significant effects because of their location and their potential influence on hormone production.",

    location:
      "The pituitary gland is located at the base of the brain in the sellar region, close to the optic nerves and other important structures.",

    characteristics: [
      "Occurs in or around the pituitary gland.",
      "May produce excess hormones or interfere with normal hormone production.",
      "Large tumors can extend beyond the pituitary region.",
      "The optic pathways may be affected by larger lesions.",
      "MRI is particularly useful for evaluating the sellar and parasellar regions.",
    ],

    symptoms: [
      "Headaches",
      "Vision changes",
      "Hormonal problems",
      "Menstrual or reproductive changes",
      "Fatigue",
      "Changes related to abnormal hormone production",
    ],

    diagnosis:
      "Evaluation may include hormonal blood tests, neurological and visual assessment, and MRI of the pituitary region. These investigations help determine tumor size, location, and whether hormone production is affected.",

    treatment:
      "Treatment depends on tumor type, hormone activity, size, symptoms, and extension into surrounding structures. Management can include observation, medication to control hormone production, surgery, radiation therapy, or a combination of approaches.",

    prognosis:
      "Many pituitary tumors can be effectively managed. Prognosis depends on the specific tumor type, hormone activity, size, location, response to treatment, and whether surrounding structures are affected.",

    mriAppearance:
      "Pituitary tumors are evaluated primarily with dedicated MRI of the sellar region. Imaging may demonstrate an abnormal mass within or extending from the pituitary gland, with appearance varying according to tumor size and type.",

    image: "/mri_pituitary.png",
    imageCaption: "Representative pituitary tumor MRI reference image.",
  },

  notumor: {
    slug: "notumor",
    name: "No Tumor",
    category: "Classification Result",
    type: "No Tumor",

    overview:
      "The No Tumor class represents MRI images that do not show the tumor pattern associated with the three tumor categories used by this educational classification system.",

    whatIsIt:
      "No Tumor is a classification category rather than a tumor diagnosis. It indicates that the analyzed image was classified as not belonging to the glioma, meningioma, or pituitary tumor categories.",

    location:
      "No specific tumor location applies because this classification represents an image without the target tumor pattern.",

    characteristics: [
      "Represents the non-tumor class used by the AI classifier.",
      "No target brain tumor pattern is identified by the classification system.",
      "MRI appearance can vary considerably between individuals.",
      "A model classification should not be interpreted as definitive clinical confirmation.",
      "Clinical interpretation should be performed by appropriately qualified professionals.",
    ],

    symptoms: [
      "No tumor-specific symptoms are associated with this classification.",
      "Symptoms may still occur for many other medical reasons.",
    ],

    diagnosis:
      "A No Tumor AI classification does not replace professional radiological or clinical assessment. If symptoms or other concerns are present, the MRI should be evaluated in the appropriate clinical context.",

    treatment:
      "There is no tumor-specific treatment associated with this classification. Any symptoms or abnormalities identified clinically should be evaluated independently by an appropriate healthcare professional.",

    prognosis:
      "The No Tumor classification does not establish an overall health prognosis. It only describes the classification result produced for the analyzed image.",

    mriAppearance:
      "The reference image represents the non-tumor class used for educational demonstration. Normal brain MRI appearances vary depending on imaging sequence, patient anatomy, and acquisition parameters.",

    image: "/mri_notumor.png",
    imageCaption: "Representative No Tumor MRI reference image.",
  },
};

/* =========================================================
   NORMALIZE SLUG
========================================================= */

function normalizeSlug(value) {
  if (!value) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* =========================================================
   INFORMATION SECTION
========================================================= */

function InfoSection({ title, icon, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
      }}
      style={{
        background: "rgba(15,40,90,0.82)",
        border: "1px solid rgba(0,212,255,0.2)",
        borderRadius: "16px",
        padding: "1.5rem",
        marginBottom: "1.2rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "9px",
            background: "rgba(0,212,255,0.1)",
            color: "#00d4ff",
          }}
        >
          {icon}
        </span>

        <h2
          style={{
            margin: 0,
            color: "#e2f0ff",
            fontSize: "1.05rem",
            fontWeight: 800,
          }}
        >
          {title}
        </h2>
      </div>

      <div
        style={{
          color: "rgba(190,215,240,0.78)",
          fontSize: "0.94rem",
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </motion.section>
  );
}

/* =========================================================
   TUMOR DETAILS PAGE
========================================================= */

export default function TumorDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const normalizedSlug = normalizeSlug(slug);
  const tumor = TUMORS[normalizedSlug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [normalizedSlug]);

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!tumor) {
    return (
      <main
        style={{
          minHeight: "70vh",
          background: "#061624",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div>
          <Brain
            size={56}
            color="#00d4ff"
            strokeWidth={1.25}
          />

          <h1
            style={{
              color: "#e2f0ff",
              marginTop: "1rem",
            }}
          >
            Tumor information not found
          </h1>

          <p
            style={{
              color: "rgba(160,200,240,0.65)",
              marginBottom: "1.5rem",
            }}
          >
            No tumor information exists for "{slug}".
          </p>

          <Link
            to="/tumors"
            className="btn-primary"
          >
            Back to Tumor Guide
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#061624",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <section
        style={{
          background:
            "linear-gradient(160deg, rgba(0,100,200,0.14) 0%, #020b18 70%)",
          borderBottom:
            "1px solid rgba(0,212,255,0.22)",
          padding: "2rem 0 2rem",
        }}
      >
        <div
          className="container-md"
          style={{
            padding: "0 1.5rem",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/tumors")}
            className="btn-ghost"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "1.2rem",
              padding: "0.4rem 0",
            }}
          >
            <ArrowLeft size={16} />
            Back to Tumor Guide
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, var(--color-blue-600), var(--color-teal-600))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Brain
                size={27}
                color="#ffffff"
              />
            </div>

            <div>
              <div
                style={{
                  color: "#00d4ff",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.3rem",
                }}
              >
                {tumor.category}
              </div>

              <h1
                style={{
                  margin: 0,
                  color: "#e2f0ff",
                  fontSize:
                    "clamp(1.7rem, 4vw, 2.5rem)",
                  fontWeight: 850,
                  lineHeight: 1.15,
                }}
              >
                {tumor.name}
              </h1>

              <p
                style={{
                  margin: "0.45rem 0 0",
                  color:
                    "rgba(160,200,240,0.65)",
                  fontSize: "0.95rem",
                }}
              >
                Complete educational tumor information
                and representative MRI reference
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className="container-md"
        style={{
          padding: "2.5rem 1.5rem 4rem",
        }}
      >
        <div
          className="tumor-detail-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "340px 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <motion.aside
            className="tumor-sidebar"
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.45,
            }}
            style={{
              position: "sticky",
              top: "90px",
            }}
          >
            {/* MRI IMAGE CARD */}

            <div
              style={{
                background:
                  "rgba(8,27,53,0.95)",
                border:
                  "1px solid rgba(0,212,255,0.2)",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "0.9rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#e2f0ff",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  letterSpacing: "0.05em",
                }}
              >
                <Scan
                  size={17}
                  color="#00d4ff"
                />
                MRI REFERENCE
              </div>

              <div
                style={{
                  width: "100%",
                  background: "#020914",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={tumor.image}
                  alt={`${tumor.name} MRI reference`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "0.85rem 1rem",
                  color:
                    "rgba(160,200,240,0.55)",
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                {tumor.imageCaption}
              </div>
            </div>

            {/* CLASSIFICATION CARD */}

            <div
              style={{
                background:
                  "rgba(15,40,90,0.88)",
                border:
                  "1px solid rgba(0,212,255,0.22)",
                borderRadius: "14px",
                padding: "1.25rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    color:
                      "rgba(160,200,240,0.55)",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Classification
                </div>

                <div
                  style={{
                    color: "#e2f0ff",
                    fontWeight: 700,
                  }}
                >
                  {tumor.category}
                </div>
              </div>

              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    color:
                      "rgba(160,200,240,0.55)",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Tumor Type
                </div>

                <div
                  style={{
                    color: "#e2f0ff",
                    fontWeight: 700,
                  }}
                >
                  {tumor.type}
                </div>
              </div>

              <div>
                <div
                  style={{
                    color:
                      "rgba(160,200,240,0.55)",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.3rem",
                  }}
                >
                  Common Location
                </div>

                <div
                  style={{
                    color:
                      "rgba(190,215,240,0.78)",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                  }}
                >
                  {tumor.location}
                </div>
              </div>
            </div>

            {/* ANALYZE BUTTON */}

            <Link
              to="/analysis"
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              Analyze an MRI
            </Link>
          </motion.aside>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div>
            {/* OVERVIEW */}

            <InfoSection
              title="Overview"
              icon={<Info size={17} />}
              delay={0}
            >
              <p style={{ margin: 0 }}>
                {tumor.overview}
              </p>
            </InfoSection>

            {/* WHAT IS IT */}

            <InfoSection
              title="What Is It?"
              icon={<Brain size={17} />}
              delay={0.05}
            >
              <p style={{ margin: 0 }}>
                {tumor.whatIsIt}
              </p>
            </InfoSection>

            {/* LOCATION */}

            <InfoSection
              title="Common Location"
              icon={<MapPin size={17} />}
              delay={0.1}
            >
              <p style={{ margin: 0 }}>
                {tumor.location}
              </p>
            </InfoSection>

            {/* CHARACTERISTICS */}

            <InfoSection
              title="Key Characteristics"
              icon={<CheckCircle2 size={17} />}
              delay={0.15}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                {tumor.characteristics.map(
                  (item, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.65rem",
                        padding:
                          "0.7rem 0.8rem",
                        background:
                          "rgba(6,22,36,0.75)",
                        border:
                          "1px solid rgba(0,212,255,0.15)",
                        borderRadius: "9px",
                      }}
                    >
                      <CheckCircle2
                        size={17}
                        color="#00d4ff"
                        style={{
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      />

                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </InfoSection>

            {/* SYMPTOMS */}

            <InfoSection
              title="Common Symptoms"
              icon={<Activity size={17} />}
              delay={0.2}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "0.65rem",
                }}
              >
                {tumor.symptoms.map(
                  (symptom, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.55rem",
                        padding:
                          "0.75rem 0.85rem",
                        background:
                          "rgba(6,182,212,0.07)",
                        border:
                          "1px solid rgba(6,182,212,0.18)",
                        borderRadius: "9px",
                        color: "#e2f0ff",
                      }}
                    >
                      <CheckCircle2
                        size={16}
                        color="#00d4ff"
                        style={{
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      />

                      <span>{symptom}</span>
                    </div>
                  )
                )}
              </div>
            </InfoSection>

            {/* DIAGNOSIS */}

            <InfoSection
              title="Diagnosis"
              icon={<Stethoscope size={17} />}
              delay={0.25}
            >
              <p style={{ margin: 0 }}>
                {tumor.diagnosis}
              </p>
            </InfoSection>

            {/* TREATMENT */}

            <InfoSection
              title="Treatment Overview"
              icon={<Pill size={17} />}
              delay={0.3}
            >
              <p style={{ margin: 0 }}>
                {tumor.treatment}
              </p>
            </InfoSection>

            {/* PROGNOSIS */}

            <InfoSection
              title="General Information"
              icon={<Info size={17} />}
              delay={0.35}
            >
              <p style={{ margin: 0 }}>
                {tumor.prognosis}
              </p>
            </InfoSection>

            {/* MRI */}

            <InfoSection
              title="MRI Appearance"
              icon={<Scan size={17} />}
              delay={0.4}
            >
              <p style={{ margin: 0 }}>
                {tumor.mriAppearance}
              </p>

              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.9rem 1rem",
                  background:
                    "rgba(0,212,255,0.06)",
                  border:
                    "1px solid rgba(0,212,255,0.18)",
                  borderRadius: "9px",
                  color: "#5edcff",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                <strong>
                  MRI Reference Notice:
                </strong>{" "}
                The image displayed on this page is a
                representative educational reference.
                Actual MRI appearances can vary according
                to the patient, imaging sequence,
                acquisition parameters, tumor type, and
                tumor grade.
              </div>
            </InfoSection>

            {/* DISCLAIMER */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.45,
              }}
              style={{
                marginTop: "1.5rem",
                padding: "1.1rem 1.2rem",
                background:
                  "rgba(0,212,255,0.045)",
                border:
                  "1px solid rgba(0,212,255,0.18)",
                borderRadius: "12px",
                color:
                  "rgba(160,200,240,0.65)",
                fontSize: "0.82rem",
                lineHeight: 1.65,
              }}
            >
              <strong
                style={{
                  color: "#e2f0ff",
                }}
              >
                Educational / Research Use Only
              </strong>

              <br />

              This information is intended for educational
              and research demonstration purposes only. The
              AI classification and information presented
              here are not a medical diagnosis and should
              not replace evaluation by a qualified
              healthcare professional.
            </motion.div>
          </div>
        </div>
      </div>

      {/* RESPONSIVE */}
      <style>{`
        @media (max-width: 850px) {
          .tumor-detail-grid {
            grid-template-columns: 1fr !important;
          }

          .tumor-sidebar {
            position: static !important;
          }
        }

        @media (max-width: 600px) {
          .tumor-detail-grid {
            gap: 1rem !important;
          }
        }
      `}</style>
    </main>
  );
}