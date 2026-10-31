import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpecialty } from "@/src/services/firestore/specialties";

export default async function SpecialtyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Map slug to specialty ID (slug == id in seed data)
  const specialty = await getSpecialty(slug);
  if (!specialty || specialty.active === false) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/specialties" className="ui-button ui-button-secondary">
            Back to specialties
          </Link>
          <Link href="/questionnaire" className="ui-button ui-button-primary">
            Take the questionnaire
          </Link>
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          Specialty details
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {specialty.name}
        </h1>
        <p className="mt-2 text-sm text-muted capitalize">
          {specialty.category}
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-muted leading-relaxed">
              {specialty.overview}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Typical day</h2>
            <p className="mt-2 text-muted leading-relaxed">
              {specialty.typicalDay}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Residency training</h2>
            <p className="mt-2 text-muted leading-relaxed">
              {specialty.residency}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Keywords</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {(specialty.keywords || []).map((kw) => (
                <span key={kw} className="ui-chip">
                  {kw}
                </span>
              ))}
            </div>
          </section>
        </div>

        {specialty.commonDiseases && specialty.commonDiseases.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Common conditions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {specialty.commonDiseases.map((disease) => (
                <span key={disease} className="ui-chip">
                  {disease}
                </span>
              ))}
            </div>
          </section>
        )}

        {specialty.pros && specialty.pros.length > 0 && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <section>
              <h2 className="text-lg font-semibold text-emerald-700">Pros</h2>
              <ul className="mt-2 space-y-1">
                {specialty.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-0.5 text-emerald-600">+</span>
                    {p}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-red-700">Cons</h2>
              <ul className="mt-2 space-y-1">
                {specialty.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-0.5 text-red-500">-</span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          </section>
        )}

        <div className="mt-10 flex gap-3">
          <Link href="/compare" className="ui-button ui-button-secondary">
            Compare with another
          </Link>
          <Link href="/questionnaire" className="ui-button ui-button-primary">
            Get my match
          </Link>
        </div>
      </section>
    </main>
  );
}
