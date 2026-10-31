import Link from "next/link";
import { listSpecialties } from "@/src/services/firestore/specialties";

export default async function SpecialtiesPage() {
  let specialties: Awaited<ReturnType<typeof listSpecialties>> = [];
  try {
    specialties = await listSpecialties();
  } catch {
    // Fallback if Firestore isn't reachable during dev
  }

  const display = specialties.length > 0
    ? specialties.filter((s) => s.active !== false)
    : [
        { id: "neurosurgery", slug: "neurosurgery", name: "Neurosurgery", category: "surgical", shortSummary: "Surgical specialty focused on the nervous system." },
        { id: "orthopedics", slug: "orthopedics", name: "Orthopedics", category: "surgical", shortSummary: "Musculoskeletal system: bones, joints, muscles." },
        { id: "radiology", slug: "radiology", name: "Radiology", category: "diagnostic", shortSummary: "Image-based diagnosis and intervention." },
        { id: "internal-medicine", slug: "internal-medicine", name: "Internal Medicine", category: "medical", shortSummary: "Broad adult medicine and diagnostic reasoning." },
        { id: "pediatrics", slug: "pediatrics", name: "Pediatrics", category: "medical", shortSummary: "Health of infants, children, and adolescents." },
        { id: "gynecology", slug: "gynecology", name: "Gynecology", category: "surgical", shortSummary: "Female reproductive health." },
        { id: "dermatology", slug: "dermatology", name: "Dermatology", category: "medical", shortSummary: "Skin, hair, and nail conditions." },
        { id: "cardiology", slug: "cardiology", name: "Cardiology", category: "medical", shortSummary: "Heart and cardiovascular system." },
      ];

  const categories = [...new Set(display.map((s) => s.category))];

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="ui-button ui-button-secondary">
            Back home
          </Link>
          <Link href="/questionnaire" className="ui-button ui-button-primary">
            Take the questionnaire
          </Link>
          <Link href="/compare" className="ui-button ui-button-secondary">
            Compare specialties
          </Link>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          Explore specialties
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Algerian residency specialties.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          Browse the specialties available in the Algerian residency system.
          Take the questionnaire to get personalized recommendations.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat} className="ui-chip">
              {cat}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((sp) => (
            <Link
              key={sp.id}
              href={`/specialties/${sp.slug}`}
              className="ui-card has-hover p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{sp.name}</h2>
                  <span className="mt-1 text-xs uppercase tracking-wider text-muted">
                    {sp.category}
                  </span>
                </div>
              </div>
              {sp.shortSummary && (
                <p className="text-sm text-muted leading-relaxed">
                  {sp.shortSummary}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
