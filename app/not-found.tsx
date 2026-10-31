import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Page not found.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          The path you requested does not exist yet. Return home to continue
          exploring the MedMatch Algeria MVP.
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
