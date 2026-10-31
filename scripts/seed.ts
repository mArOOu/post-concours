import {
  createAttributeDefinition,
  createScoringModel,
  getAttributeDefinition,
  getScoringModel,
} from "@/src/services/firestore/settings";
import {
  createQuestion,
  getQuestion,
} from "@/src/services/firestore/questions";
import {
  createSpecialty,
  getSpecialty,
} from "@/src/services/firestore/specialties";

async function ensureValue<T>(
  getter: Promise<T | null>,
  creator: () => Promise<T>,
) {
  const existing = await getter;
  if (existing) {
    return existing;
  }

  return creator();
}

async function main() {
  const specialties = [
    {
      id: "internal-medicine",
      slug: "internal-medicine",
      name: "Internal Medicine",
      category: "medical",
      overview:
        "Broad adult medicine focused on diagnosis, longitudinal care, and complex decision-making.",
      typicalDay:
        "A typical day mixes outpatient follow-up, ward rounds, consultations, and diagnostic workups.",
      residency:
        "Residency emphasizes broad clinical reasoning, inpatient care, and exposure to multiple subspecialties.",
      pros: [
        "Strong diagnostic depth",
        "Wide career flexibility",
        "High continuity of care",
      ],
      cons: [
        "Heavy cognitive load",
        "Long follow-up lists",
        "Can be stressful",
      ],
      commonDiseases: [
        "Diabetes",
        "Hypertension",
        "Heart failure",
        "Pneumonia",
        "Kidney disease",
      ],
      faqIds: [],
      residentInterviewIds: [],
      active: true,
      shortSummary: "Broad adult medicine and diagnostic reasoning.",
      keywords: ["diagnosis", "follow-up", "medical"],
      createdBy: "seed",
      updatedBy: "seed",
      source: "seed",
      reviewStatus: "published" as const,
    },
    {
      id: "radiology",
      slug: "radiology",
      name: "Radiology",
      category: "diagnostic",
      overview:
        "Image-based specialty focused on interpretation, pattern recognition, and rapid consultation.",
      typicalDay:
        "A typical day centers on reading studies, discussing findings, and supporting other services.",
      residency:
        "Residency develops image interpretation, anatomy knowledge, and efficient diagnostic reporting.",
      pros: [
        "Strong imaging focus",
        "Lower patient contact",
        "Good diagnostic depth",
      ],
      cons: [
        "Screen-heavy work",
        "High concentration demands",
        "Can be isolated",
      ],
      commonDiseases: [
        "Stroke",
        "Lung nodules",
        "Fractures",
        "Tumors",
        "Abdominal pathology",
      ],
      faqIds: [],
      residentInterviewIds: [],
      active: true,
      shortSummary:
        "Interpretation-driven specialty with strong imaging demand.",
      keywords: ["imaging", "diagnosis", "anatomy"],
      createdBy: "seed",
      updatedBy: "seed",
      source: "seed",
      reviewStatus: "published" as const,
    },
    {
      id: "general-surgery",
      slug: "general-surgery",
      name: "General Surgery",
      category: "surgical",
      overview:
        "Operative specialty focused on procedures, emergencies, and hands-on care.",
      typicalDay:
        "A typical day includes operating room time, ward rounds, emergency cases, and postoperative follow-up.",
      residency:
        "Residency is procedurally intense, physically demanding, and centered on operative judgment.",
      pros: [
        "High procedural volume",
        "Strong hands-on work",
        "Clear operative identity",
      ],
      cons: ["Long hours", "High stress", "Physical fatigue"],
      commonDiseases: [
        "Appendicitis",
        "Bowel obstruction",
        "Hernias",
        "Gallbladder disease",
        "Trauma",
      ],
      faqIds: [],
      residentInterviewIds: [],
      active: true,
      shortSummary: "Operative specialty with emergencies and procedures.",
      keywords: ["surgery", "procedures", "emergency"],
      createdBy: "seed",
      updatedBy: "seed",
      source: "seed",
      reviewStatus: "published" as const,
    },
  ];

  const questions = [
    {
      id: "q001",
      questionText: "I want a strong work-life balance.",
      category: "Lifestyle",
      traitIds: ["lifestyle"],
      weight: 3,
      reverseScored: false,
      scaleMin: 1,
      scaleMax: 5,
      active: true,
    },
    {
      id: "q002",
      questionText: "I can tolerate high stress in a specialty.",
      category: "Stress",
      traitIds: ["stress"],
      weight: 3,
      reverseScored: false,
      scaleMin: 1,
      scaleMax: 5,
      active: true,
    },
    {
      id: "q003",
      questionText: "I want surgery-heavy work.",
      category: "Procedures",
      traitIds: ["procedures"],
      weight: 3,
      reverseScored: false,
      scaleMin: 1,
      scaleMax: 5,
      active: true,
    },
    {
      id: "q004",
      questionText: "I want a specialty that uses imaging heavily.",
      category: "Knowledge Requirements",
      traitIds: ["intellectual"],
      weight: 2,
      reverseScored: false,
      scaleMin: 1,
      scaleMax: 5,
      active: true,
    },
    {
      id: "q005",
      questionText:
        "I want a specialty that requires strong patient communication.",
      category: "Personality Fit",
      traitIds: ["patientContact"],
      weight: 2,
      reverseScored: false,
      scaleMin: 1,
      scaleMax: 5,
      active: true,
    },
  ];

  const attributeDefinitions = [
    {
      id: "lifestyle",
      name: "Equilibre vié / Lifestyle",
      description:
        "How much the specialty affects day-to-day flexibility, stability, and personal time.",
      scaleMin: 1,
      scaleMax: 5,
      category: "Lifestyle",
      active: true,
    },
    {
      id: "stress",
      name: "Niveau de stress / Stress",
      description:
        "Overall psychological pressure and urgency in the specialty.",
      scaleMin: 1,
      scaleMax: 5,
      category: "Stress",
      active: true,
    },
    {
      id: "procedures",
      name: "Travail manuel / Procedures",
      description: "Level of hands-on clinical procedures performed routinely.",
      scaleMin: 1,
      scaleMax: 5,
      category: "Procedures",
      active: true,
    },
    {
      id: "patientContact",
      name: "Contact patient / Patient Contact",
      description: "How much direct patient interaction the specialty requires.",
      scaleMin: 1,
      scaleMax: 5,
      category: "Clinical",
      active: true,
    },
    {
      id: "intellectual",
      name: "Profondeur intellectuelle / Intellectual",
      description: "How much deep analytical thinking and complex knowledge the specialty demands.",
      scaleMin: 1,
      scaleMax: 5,
      category: "Intellectual",
      active: true,
    },
    {
      id: "income",
      name: "Potentiel de revenu / Income",
      description: "Overall earning potential of the specialty.",
      scaleMin: 1,
      scaleMax: 5,
      category: "Career",
      active: true,
    },
  ];

  const scoringModels = [
    {
      id: "baseline-v1",
      name: "Baseline Scoring Model",
      version: "1.0.0",
      description: "Initial weighted model for residency matching in the MVP.",
      weights: {
        lifestyle: 0.2,
        stress: 0.15,
        procedures: 0.2,
        patientContact: 0.15,
        intellectual: 0.15,
        income: 0.15,
      },
      active: true,
    },
  ];

  for (const specialty of specialties) {
    await ensureValue(getSpecialty(specialty.id), () =>
      createSpecialty(specialty),
    );
  }

  for (const question of questions) {
    await ensureValue(getQuestion(question.id), () => createQuestion(question));
  }

  for (const attributeDefinition of attributeDefinitions) {
    await ensureValue(getAttributeDefinition(attributeDefinition.id), () =>
      createAttributeDefinition(attributeDefinition),
    );
  }

  for (const scoringModel of scoringModels) {
    await ensureValue(getScoringModel(scoringModel.id), () =>
      createScoringModel(scoringModel),
    );
  }

  console.log("Seed completed successfully.");
}

main().catch((error) => {
  console.error("Seed failed.", error);
  process.exitCode = 1;
});
