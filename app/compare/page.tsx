import Link from "next/link";
import CompareClient from "./CompareClient";
import { listSpecialties } from "@/src/services/firestore/specialties";

const fallbackSpecialties = [
  {
    id: "internal-medicine",
    slug: "internal-medicine",
    name: "Internal Medicine",
    category: "medical",
    overview: "Broad adult medicine and diagnostic reasoning.",
    residency: "Broad clinical reasoning, inpatient care, and multiple subspecialty rotations.",
    pros: ["Diagnostic depth", "Career flexibility", "Continuity of care"],
    cons: ["High cognitive load", "Long follow-up lists", "Stressful periods"],
    attributeScores: { lifestyle: 3, stress: 3, procedures: 2, patientContact: 4, intellectual: 5, income: 3 },
  },
  {
    id: "radiology",
    slug: "radiology",
    name: "Radiology",
    category: "diagnostic",
    overview: "Image-based diagnosis with a strong pattern-recognition focus.",
    residency: "Image interpretation, anatomy, and efficient diagnostic reporting.",
    pros: ["Imaging focus", "Diagnostic depth", "Lower patient contact"],
    cons: ["Screen-heavy work", "Concentration demands", "Can feel isolated"],
    attributeScores: { lifestyle: 4, stress: 2, procedures: 2, patientContact: 1, intellectual: 5, income: 4 },
  },
  {
    id: "general-surgery",
    slug: "general-surgery",
    name: "General Surgery",
    category: "surgical",
    overview: "Operative specialty focused on procedures and emergency care.",
    residency: "Procedurally intense training centered on operative judgment and acute care.",
    pros: ["High procedural volume", "Hands-on work", "Clear operative identity"],
    cons: ["Long hours", "High stress", "Physical fatigue"],
    attributeScores: { lifestyle: 2, stress: 5, procedures: 5, patientContact: 4, intellectual: 4, income: 4 },
  },
];

export default async function ComparePage() {
  let specialties: Awaited<ReturnType<typeof listSpecialties>> = [];
  try {
    specialties = await listSpecialties();
  } catch {
    specialties = [];
  }

  const activeSpecialties = specialties.filter((specialty) => specialty.active !== false);
  const compareSpecialties = (activeSpecialties.length > 1 ? activeSpecialties : fallbackSpecialties).map(
    (specialty) => ({
      id: specialty.id,
      slug: specialty.slug,
      name: specialty.name,
      category: specialty.category,
      overview: specialty.overview,
      residency: specialty.residency,
      pros: specialty.pros,
      cons: specialty.cons,
      attributeScores: specialty.attributeScores,
    }),
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/specialties" className="ui-button ui-button-secondary">
            Browse specialties
          </Link>
          <Link href="/questionnaire" className="ui-button ui-button-primary">
            Get my match
          </Link>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          Specialty comparison
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Compare two specialties side by side.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          Compare the dimensions that matter most when choosing a residency:
          lifestyle, stress, procedures, patient contact, intellectual depth,
          and income potential.
        </p>
        <CompareClient specialties={compareSpecialties} />
      </section>
    </main>
  );
}
