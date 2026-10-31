export interface ScoringResult {
  specialtyId: string;
  specialtyName: string;
  specialtySlug: string;
  matchScore: number; // 0-100
  topAttributes: { attribute: string; score: number; preference: number }[];
}

// Map question traitIds to attribute IDs used in scoring models
const TRAIT_TO_ATTRIBUTE: Record<string, string> = {
  lifestyle: "lifestyle",
  stress: "stress",
  procedures: "procedures",
  patientContact: "patientContact",
  intellectual: "intellectual",
  income: "income",
};

// Specialty attribute profiles on a 1-5 scale
// These represent how much each specialty embodies each attribute
// 1 = very low presence of the attribute, 5 = very high
const SPECIALTY_ATTRIBUTE_PROFILES: Record<string, Record<string, number>> = {
  "medecine-interne": {
    lifestyle: 3,
    stress: 3,
    procedures: 2,
    patientContact: 5,
    intellectual: 5,
    income: 3,
  },
  "cardiologie": {
    lifestyle: 2,
    stress: 4,
    procedures: 4,
    patientContact: 3,
    intellectual: 4,
    income: 4,
  },
  "pneumologie": {
    lifestyle: 3,
    stress: 3,
    procedures: 3,
    patientContact: 3,
    intellectual: 5,
    income: 3,
  },
  "nephrologie": {
    lifestyle: 4,
    stress: 3,
    procedures: 1,
    patientContact: 5,
    intellectual: 5,
    income: 3,
  },
  "gastro-enterologie": {
    lifestyle: 2,
    stress: 4,
    procedures: 5,
    patientContact: 2,
    intellectual: 4,
    income: 4,
  },
  "endocrinologie": {
    lifestyle: 5,
    stress: 1,
    procedures: 2,
    patientContact: 4,
    intellectual: 5,
    income: 3,
  },
  "rhumatologie": {
    lifestyle: 5,
    stress: 1,
    procedures: 2,
    patientContact: 4,
    intellectual: 4,
    income: 3,
  },
  "hematologie": {
    lifestyle: 2,
    stress: 4,
    procedures: 2,
    patientContact: 3,
    intellectual: 5,
    income: 4,
  },
  "carcinologie-medicale": {
    lifestyle: 2,
    stress: 4,
    procedures: 2,
    patientContact: 3,
    intellectual: 5,
    income: 4,
  },
  "dermatologie": {
    lifestyle: 5,
    stress: 1,
    procedures: 3,
    patientContact: 3,
    intellectual: 3,
    income: 4,
  },
  "ophtalmologie": {
    lifestyle: 4,
    stress: 3,
    procedures: 5,
    patientContact: 2,
    intellectual: 4,
    income: 4,
  },
  "orl": {
    lifestyle: 3,
    stress: 4,
    procedures: 5,
    patientContact: 2,
    intellectual: 3,
    income: 4,
  },
  "stomatologie": {
    lifestyle: 4,
    stress: 1,
    procedures: 4,
    patientContact: 3,
    intellectual: 2,
    income: 3,
  },
  "neurologie": {
    lifestyle: 3,
    stress: 4,
    procedures: 1,
    patientContact: 4,
    intellectual: 5,
    income: 3,
  },
  "anesthesie-reanimation": {
    lifestyle: 1,
    stress: 5,
    procedures: 5,
    patientContact: 2,
    intellectual: 4,
    income: 5,
  },
  "medecine-urgence": {
    lifestyle: 1,
    stress: 5,
    procedures: 3,
    patientContact: 3,
    intellectual: 3,
    income: 4,
  },
  "medecine-generale": {
    lifestyle: 4,
    stress: 2,
    procedures: 1,
    patientContact: 5,
    intellectual: 3,
    income: 2,
  },
  "pediatrie": {
    lifestyle: 4,
    stress: 4,
    procedures: 2,
    patientContact: 5,
    intellectual: 3,
    income: 2,
  },
  "gynecologie-obstetrique": {
    lifestyle: 2,
    stress: 5,
    procedures: 4,
    patientContact: 5,
    intellectual: 3,
    income: 4,
  },
  "psychiatrie": {
    lifestyle: 4,
    stress: 3,
    procedures: 1,
    patientContact: 5,
    intellectual: 4,
    income: 2,
  },
  "medecine-physique-readaptation": {
    lifestyle: 4,
    stress: 2,
    procedures: 2,
    patientContact: 4,
    intellectual: 3,
    income: 2,
  },
  "allergologie": {
    lifestyle: 5,
    stress: 1,
    procedures: 2,
    patientContact: 4,
    intellectual: 4,
    income: 3,
  },
  "chirurgie-generale": {
    lifestyle: 2,
    stress: 4,
    procedures: 5,
    patientContact: 2,
    intellectual: 3,
    income: 4,
  },
  "chirurgie-vasculaire": {
    lifestyle: 3,
    stress: 4,
    procedures: 5,
    patientContact: 2,
    intellectual: 3,
    income: 4,
  },
  "chirurgie-thoracique-cv": {
    lifestyle: 1,
    stress: 5,
    procedures: 5,
    patientContact: 2,
    intellectual: 4,
    income: 5,
  },
  "chirurgie-digestive": {
    lifestyle: 2,
    stress: 4,
    procedures: 5,
    patientContact: 2,
    intellectual: 3,
    income: 5,
  },
  "neurochirurgie": {
    lifestyle: 1,
    stress: 5,
    procedures: 5,
    patientContact: 2,
    intellectual: 5,
    income: 5,
  },
  "urologie": {
    lifestyle: 4,
    stress: 3,
    procedures: 4,
    patientContact: 2,
    intellectual: 3,
    income: 5,
  },
  "chirurgie-orthopedique": {
    lifestyle: 3,
    stress: 4,
    procedures: 5,
    patientContact: 3,
    intellectual: 3,
    income: 4,
  },
  "chirurgie-plastique": {
    lifestyle: 4,
    stress: 3,
    procedures: 5,
    patientContact: 3,
    intellectual: 3,
    income: 5,
  },
  "chirurgie-pediatricienne": {
    lifestyle: 3,
    stress: 4,
    procedures: 3,
    patientContact: 5,
    intellectual: 3,
    income: 3,
  },
  "radiologie": {
    lifestyle: 4,
    stress: 2,
    procedures: 3,
    patientContact: 1,
    intellectual: 5,
    income: 4,
  },
  "anatomie-pathologique": {
    lifestyle: 4,
    stress: 2,
    procedures: 1,
    patientContact: 1,
    intellectual: 5,
    income: 3,
  },
  "biologie-medicale": {
    lifestyle: 4,
    stress: 2,
    procedures: 1,
    patientContact: 1,
    intellectual: 5,
    income: 3,
  },
  "medecine-legale": {
    lifestyle: 3,
    stress: 2,
    procedures: 1,
    patientContact: 2,
    intellectual: 4,
    income: 3,
  },
  "medecine-du-travail": {
    lifestyle: 5,
    stress: 1,
    procedures: 1,
    patientContact: 3,
    intellectual: 3,
    income: 3,
  },
  "epidemiologie-sante-publique": {
    lifestyle: 5,
    stress: 1,
    procedures: 1,
    patientContact: 1,
    intellectual: 4,
    income: 2,
  },
};

export function computeScoresWithQuestions(
  answers: Record<string, number>,
  scoringModel: { weights: Record<string, number> },
  specialties: { id: string; name: string; slug: string; attributeScores?: Record<string, number> }[],
  questions: { id: string; traitIds?: string[]; weight?: number; reverseScored?: boolean }[],
): ScoringResult[] {
  // 1. Compute user's attribute preference scores from answers
  const userAttrRaw: Record<string, { sum: number; weight: number }> = {};

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null || answer === 0) continue;

    const traitIds = Array.isArray(question.traitIds) ? question.traitIds : [];
    const weight = typeof question.weight === "number" && question.weight > 0 ? question.weight : 1;
    const normalizedAnswer = question.reverseScored ? 6 - answer : answer;

    for (const traitId of traitIds) {
      const attrId = TRAIT_TO_ATTRIBUTE[traitId] || traitId;
      if (!attrId) continue;

      if (!userAttrRaw[attrId]) {
        userAttrRaw[attrId] = { sum: 0, weight: 0 };
      }
      userAttrRaw[attrId].sum += normalizedAnswer * weight;
      userAttrRaw[attrId].weight += weight;
    }
  }

  // Normalize user attribute scores to 1-5 scale
  const userAttributes: Record<string, number> = {};
  for (const attrId of Object.keys(userAttrRaw)) {
    const data = userAttrRaw[attrId];
    if (data.weight > 0) {
      userAttributes[attrId] = data.sum / data.weight;
    }
  }

  // 2. Compute match score for each specialty
  const modelWeights = scoringModel.weights;
  const totalModelWeight = Object.values(modelWeights).reduce((a, b) => a + b, 0);

  const results: ScoringResult[] = specialties.map((sp) => {
    // Use Firestore attributeScores first, then hardcoded fallback
    const profile = sp.attributeScores ?? SPECIALTY_ATTRIBUTE_PROFILES[sp.id] ?? {};
    let weightedDiff = 0;
    const topAttributes: { attribute: string; score: number; preference: number }[] = [];

    for (const [attrId, modelWeight] of Object.entries(modelWeights)) {
      const userScore = userAttributes[attrId] ?? 3;
      const specialtyScore = profile[attrId] ?? 3;
      const diff = Math.abs(userScore - specialtyScore);
      weightedDiff += diff * modelWeight;

      topAttributes.push({
        attribute: attrId,
        score: specialtyScore,
        preference: Math.round(userScore * 10) / 10,
      });
    }

    // Match score: 100 - (weighted_diff / max_possible) * 100
    const maxPossibleDiff = totalModelWeight * 4; // max diff is 4 on 1-5 scale
    const rawScore = 100 - (weightedDiff / maxPossibleDiff) * 100;
    const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    return {
      specialtyId: sp.id,
      specialtyName: sp.name,
      specialtySlug: sp.slug,
      matchScore,
      topAttributes: topAttributes.sort((a, b) => b.score - a.score).slice(0, 3),
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
