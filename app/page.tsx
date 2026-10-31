import Link from "next/link";
import { listSpecialties } from "@/src/services/firestore/specialties";

const stats = [
  { value: "50+", label: "questionnaire items planned" },
  { value: "15", label: "questions before early results" },
  { value: "100%", label: "Algeria-specific data focus" },
];

const pillars = [
  {
    title: "Questionnaire-led fit",
    description:
      "Students answer a structured Likert questionnaire that maps preferences to residency dimensions.",
  },
  {
    title: "Normalized specialty data",
    description:
      "Each specialty is scored across lifestyle, procedures, competitiveness, research, and more.",
  },
  {
    title: "Explainable rankings",
    description:
      "Results surface the why behind each recommendation, not just a percentage.",
  },
];

export default async function Home() {
  let specialties: Awaited<ReturnType<typeof listSpecialties>> = [];
  try {
    specialties = await listSpecialties();
  } catch {
    // Fallback
  }

  const displaySpecialties = specialties.length > 0
    ? specialties.filter((s) => s.active !== false).slice(0, 6)
    : [
        { id: "internal-medicine", name: "Internal Medicine" },
        { id: "radiology", name: "Radiology" },
        { id: "general-surgery", name: "General Surgery" },
      ];
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <div className="ui-surface-elevated shadow-soft flex min-h-[calc(100vh-2.5rem)] flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5 sm:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              MedMatch Algeria
            </p>
            <p className="mt-1 text-sm text-muted">
              Residency guidance built for Algerian medical students.
            </p>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#how-it-works" className="nav-link">
              How it works
            </Link>
            <Link href="#specialties" className="nav-link">
              Specialties
            </Link>
            <Link href="#why-it-matters" className="nav-link">
              Why it matters
            </Link>
            <Link href="/privacy" className="nav-link">
              Privacy
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 gap-12 px-6 py-12 sm:px-10 lg:grid-cols-[1.3fr_0.9fr] lg:px-14 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="ui-badge mb-6 w-fit">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Algeria-first residency matching
            </div>

            <h1 className="max-w-3xl text-balance text-[clamp(2.6rem,5vw,5rem)] leading-[0.95] tracking-[-0.04em] font-semibold">
              Find the residency specialty that actually fits your personality,
              preferences, and career goals.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              MedMatch Algeria is a guided decision platform for interns and
              medical students choosing residency. It combines questionnaire
              answers, normalized specialty data, and a transparent scoring
              model built for the Algerian context.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/questionnaire"
                className="ui-button ui-button-primary">
                Start questionnaire
              </Link>
              <Link
                href="/specialties"
                className="ui-button ui-button-secondary">
                Explore specialties
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="ui-card p-5">
                  <p className="text-3xl font-semibold tracking-[-0.04em]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="glass-panel rounded-[28px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Early result snapshot
              </p>
              <div className="mt-6 space-y-4">
                {displaySpecialties.slice(0, 3).map((sp, index) => (
                  <div key={sp.id || sp.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{sp.name}</span>
                      <span className="font-mono text-muted">—%</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/5 dark:bg-white/10">
                      <div
                        className="h-2 rounded-full bg-[var(--accent)]"
                        style={{ width: "0%" }}
                      />
                    </div>
                    {index < 2 ? (
                      <div className="h-px bg-[var(--border)]" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[28px] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Built for clarity
              </p>
              <p className="mt-4 text-lg leading-8">
                Students get a simple, elegant experience. Administrators get a
                structured system they can scale without rewriting the product.
              </p>
            </div>
          </aside>
        </section>

        <section
          id="how-it-works"
          className="border-t border-[var(--border)] px-6 py-12 sm:px-10 lg:px-14">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                How it works
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                A simple flow now, a scalable product later.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              The MVP should validate the user journey first, then harden the
              data model, recommendation engine, and admin workflow.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <article key={pillar.title} className="ui-card p-6">
                <p className="text-sm font-mono text-muted">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="specialties"
          className="border-t border-[var(--border)] px-6 py-12 sm:px-10 lg:px-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Specialty explorer
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                Browse the specialties students compare most.
              </h2>
            </div>
            <Link
              href="/specialties"
              className="text-sm font-semibold text-accent">
              View all specialties
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {displaySpecialties.map((specialty) => (
              <div
                key={specialty.id || specialty.name}
                className="ui-card ui-card-interactive flex items-center justify-between px-5 py-4"
              >
                <span className="font-medium">{specialty.name}</span>
                <span className="text-sm text-muted">Profile page</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="why-it-matters"
          className="border-t border-[var(--border)] px-6 py-12 sm:px-10 lg:px-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
                Why it matters
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                Every ranking should be explainable to the student and editable
                by the admin.
              </h2>
            </div>
            <p className="text-sm leading-7 text-muted sm:text-base">
              This MVP is intentionally narrow: public discovery, questionnaire,
              result snapshots, and an admin shell. That is enough to validate
              the product before we harden the Firebase and database layers.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/questionnaire"
              className="ui-button"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
              }}>
              Launch MVP flow
            </Link>
            <Link href="/admin" className="ui-button ui-button-secondary">
              Open admin shell
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
