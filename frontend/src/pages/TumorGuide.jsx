import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  ShieldCheck,
  ArrowRight,
  Brain,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   TUMOR INFORMATION
========================================================= */

const TUMORS = [
  {
    slug: "glioma",
    name: "Glioma",
    category: "Brain Tumor",
    type: "Glioma",

    shortDescription:
      "A tumor that develops from glial cells in the brain and spinal cord.",

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

  {
    slug: "meningioma",
    name: "Meningioma",
    category: "Brain Tumor",
    type: "Meningioma",

    shortDescription:
      "A tumor that develops from the membranes surrounding the brain and spinal cord.",

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

  {
    slug: "pituitary",
    name: "Pituitary Tumor",
    category: "Brain Tumor",
    type: "Pituitary Tumor",

    shortDescription:
      "A tumor that develops in or around the pituitary gland.",

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

  {
    slug: "notumor",
    name: "No Tumor",
    category: "Classification Result",
    type: "No Tumor",

    shortDescription:
      "No brain tumor is detected in the MRI image used for this classification.",

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
];

/* =========================================================
   TUMOR CARD
========================================================= */

function TumorCard({ tumor, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        y: -5,
        boxShadow: "0 18px 45px rgba(0, 212, 255, 0.12)",
      }}
      style={{
        background:
          "linear-gradient(145deg, rgba(15,40,90,0.96), rgba(8,29,60,0.96))",
        border: "1px solid rgba(0,212,255,0.22)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 12px 35px rgba(0,0,0,0.28)",
        display: "flex",
        flexDirection: "column",
        minHeight: "570px",
        height: "100%",
      }}
    >
      {/* =====================================================
          MRI IMAGE
      ===================================================== */}

      <div
        style={{
          height: "190px",
          background: "#061624",
          overflow: "hidden",
          position: "relative",
          borderBottom: "1px solid rgba(0,212,255,0.16)",
        }}
      >
        <img
          src={tumor.image}
          alt={`${tumor.name} MRI reference`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "12px",
            padding: "0.45rem 0.7rem",
            borderRadius: "999px",
            background: "rgba(6,22,36,0.88)",
            border: "1px solid rgba(0,212,255,0.25)",
            color: "#ffffff",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.04em",
          }}
        >
          MRI REFERENCE
        </div>
      </div>

      {/* =====================================================
          CARD CONTENT
      ===================================================== */}

      <div
        style={{
          padding: "1.4rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* CATEGORY */}

        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 800,
            color: "#00d4ff",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.5rem",
          }}
        >
          {tumor.category}
        </div>

        {/* TITLE */}

        <h2
          style={{
            margin: "0 0 0.75rem",
            color: "#ffffff",
            fontSize: "1.55rem",
            lineHeight: 1.2,
            fontWeight: 800,
          }}
        >
          {tumor.name}
        </h2>

        {/* DESCRIPTION */}

        <p
          style={{
            color: "rgba(190,215,240,0.78)",
            lineHeight: 1.65,
            fontSize: "0.92rem",
            margin: 0,
          }}
        >
          {tumor.shortDescription}
        </p>

        {/* ===================================================
            COMMON SYMPTOMS
        =================================================== */}

        <div
          style={{
            marginTop: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "#e2f0ff",
              fontWeight: 800,
              fontSize: "0.82rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.7rem",
            }}
          >
            <CheckCircle2 size={17} color="#00d4ff" />
            Common Symptoms
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {tumor.symptoms.slice(0, 3).map((symptom, index) => (
              <li
                key={`${tumor.slug}-symptom-${index}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.55rem",
                  color: "rgba(185,210,235,0.78)",
                  fontSize: "0.9rem",
                  lineHeight: 1.45,
                }}
              >
                <span
                  style={{
                    color: "#00d4ff",
                    fontWeight: 900,
                    flexShrink: 0,
                    fontSize: "1rem",
                  }}
                >
                  ✓
                </span>

                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          style={{
            marginTop: "auto",
            paddingTop: "1.1rem",
            borderTop: "1px solid rgba(0,212,255,0.14)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link
            to={`/tumors/${tumor.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              minHeight: "48px",
              padding: "0.75rem 1.2rem",
              border: "1px solid rgba(0,212,255,0.6)",
              borderRadius: "10px",
              color: "#00d4ff",
              background: "rgba(0,212,255,0.04)",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.background =
                "rgba(0,212,255,0.12)";
              event.currentTarget.style.boxShadow =
                "0 0 22px rgba(0,212,255,0.16)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background =
                "rgba(0,212,255,0.04)";
              event.currentTarget.style.boxShadow = "none";
            }}
          >
            View Details
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TumorGuide() {
  const [query, setQuery] = useState("");

  const filteredTumors = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
      return TUMORS;
    }

    return TUMORS.filter((tumor) => {
      const searchableText = [
        tumor.name,
        tumor.type,
        tumor.category,
        tumor.shortDescription,
        tumor.overview,
        tumor.whatIsIt,
        tumor.location,
        ...tumor.characteristics,
        ...tumor.symptoms,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [query]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#061624",
        color: "#e2f0ff",
        paddingTop: "80px",
        overflowX: "hidden",
      }}
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,22,36,0.90), rgba(6,22,36,0.97)), url('/brain_neural_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderBottom: "1px solid rgba(0,212,255,0.18)",
          padding: "4rem 1.5rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}

        <div
          style={{
            position: "absolute",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "rgba(0,188,255,0.035)",
            top: "-190px",
            right: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(35,115,255,0.025)",
            bottom: "-180px",
            left: "-100px",
            pointerEvents: "none",
          }}
        />

        <div
          className="tumor-guide-container"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1100px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* BADGE */}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                background: "rgba(15,40,90,0.78)",
                border: "1px solid rgba(0,212,255,0.28)",
                color: "#18c8f5",
                fontSize: "0.82rem",
                fontWeight: 700,
                marginBottom: "1.2rem",
              }}
            >
              <BookOpen size={15} />
              Educational Reference
            </div>

            {/* TITLE */}

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                lineHeight: 1.1,
                fontWeight: 850,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                textShadow: "0 2px 20px rgba(0,212,255,0.12)",
              }}
            >
              Brain Tumor Guide
            </h1>

            {/* DESCRIPTION */}

            <p
              style={{
                maxWidth: "720px",
                margin: "1.1rem auto 0",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "rgba(190,220,245,0.78)",
              }}
            >
              Explore the four classification categories used by the
              NeuroScan AI system. Each category includes an MRI reference,
              overview, characteristics, common symptoms, diagnosis,
              treatment overview, MRI appearance, and general information.
            </p>

            {/* SEARCH */}

            <div
              style={{
                maxWidth: "500px",
                margin: "2rem auto 0",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "rgba(15,40,90,0.86)",
                border: "1px solid rgba(0,212,255,0.28)",
                borderRadius: "14px",
                padding: "0.8rem 1rem",
                boxShadow: "0 12px 35px rgba(0,0,0,0.28)",
              }}
            >
              <Search size={19} color="#18c8f5" />

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tumor types..."
                aria-label="Search tumor types"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#e2f0ff",
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                }}
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    border: "none",
                    background: "rgba(0,212,255,0.10)",
                    color: "#b8d8ee",
                    borderRadius: "8px",
                    padding: "0.35rem 0.55rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section
        className="tumor-guide-container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2.75rem 1.5rem 4rem",
        }}
      >
        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Tumor Categories
            </div>

            <div
              style={{
                marginTop: "0.3rem",
                fontSize: "0.9rem",
                color: "rgba(160,200,240,0.65)",
              }}
            >
              Showing{" "}
              <strong style={{ color: "#00d4ff" }}>
                {filteredTumors.length}
              </strong>{" "}
              of{" "}
              <strong style={{ color: "#00d4ff" }}>
                {TUMORS.length}
              </strong>{" "}
              categories
            </div>
          </div>

          {/* EDUCATIONAL BADGE */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.5rem 0.8rem",
              background: "rgba(15,40,90,0.8)",
              border: "1px solid rgba(0,212,255,0.2)",
              borderRadius: "999px",
              color: "rgba(160,200,240,0.75)",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={15} color="#08a6d8" />
            Educational use only
          </div>
        </div>

        {/* ===================================================
            CARDS
        =================================================== */}

        {filteredTumors.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "1.35rem",
              alignItems: "stretch",
            }}
          >
            {filteredTumors.map((tumor, index) => (
              <TumorCard
                key={tumor.slug}
                tumor={tumor}
                delay={index * 0.08}
              />
            ))}
          </motion.div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 1rem",
              color: "rgba(160,200,240,0.65)",
            }}
          >
            <Search
              size={42}
              color="#08a6d8"
              style={{ marginBottom: "1rem" }}
            />

            <h3
              style={{
                margin: "0 0 0.5rem",
                color: "#e2f0ff",
              }}
            >
              No tumor types found
            </h3>

            <p style={{ margin: 0 }}>
              Try a different search term.
            </p>
          </div>
        )}

        {/* ===================================================
            DISCLAIMER
        =================================================== */}

        <div
          style={{
            marginTop: "2.5rem",
            padding: "1rem 1.2rem",
            background: "rgba(15,40,90,0.65)",
            border: "1px solid rgba(0,212,255,0.18)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.7rem",
            color: "rgba(160,200,240,0.65)",
            fontSize: "0.82rem",
            lineHeight: 1.6,
          }}
        >
          <Brain
            size={18}
            color="#08a6d8"
            style={{
              flexShrink: 0,
              marginTop: "2px",
            }}
          />

          <span>
            This information is provided for educational and research
            demonstration purposes only. It is not a substitute for
            professional medical diagnosis or treatment.
          </span>
        </div>
      </section>

      {/* =====================================================
          RESPONSIVE STYLES
      ===================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .tumor-guide-container {
          width: 100%;
        }

        @media (max-width: 1100px) {
          .tumor-guide-container {
            max-width: 100%;
          }

          .tumor-guide-container > div[style*="grid-template-columns"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 700px) {
          .tumor-guide-container > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }

        input::placeholder {
          color: rgba(190,220,245,0.55);
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </main>
  );
}