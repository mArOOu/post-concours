import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          About
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Built for Algerian residency decisions.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          MedMatch Algeria is designed to help medical students choose a
          specialty using Algerian data, resident feedback, and a transparent
          matching model. The MVP validates the experience first, then we harden
          the content model and scoring engine behind it.
        </p>
        <div className="mt-8">
          <Link href="/" className="ui-button ui-button-primary">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
