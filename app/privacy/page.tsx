import Link from "next/link";

export const metadata = {
  title: "Privacy notice | MedMatch Algeria",
  description:
    "How MedMatch Algeria handles questionnaire answers and result data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          Privacy
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Privacy notice
        </h1>
        <p className="mt-4 text-sm text-muted">Last updated: November 1, 2026</p>

        <div className="mt-8 space-y-8 text-base leading-8">
          <section>
            <h2 className="text-xl font-semibold">What we collect</h2>
            <p className="mt-3 text-muted">
              When you submit the questionnaire, we store the answers you
              provide, a completion status, and timestamps. We do not ask for
              your name, email address, account, precise location, or other
              identifying information in the public questionnaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Why we use it</h2>
            <p className="mt-3 text-muted">
              Your answers are used to calculate and display specialty matches.
              Aggregated or anonymized response data may also be used to
              improve the questionnaire and scoring model. The results are
              guidance only and are not medical, academic, or career advice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Results and sharing</h2>
            <p className="mt-3 text-muted">
              Results are identified by a random response ID in the result URL.
              Anyone with that URL may be able to view the associated results,
              so do not share it if you want to keep them private.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Retention and deletion</h2>
            <p className="mt-3 text-muted">
              Responses are retained for up to 90 days to support result
              retrieval and product evaluation, then deleted. The project
              operator is responsible for configuring and checking this
              deletion process in the production Firebase project. You may
              request deletion of a response sooner by providing its result
              URL to the project operator.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Your choices</h2>
            <p className="mt-3 text-muted">
              You can use the specialty explorer without submitting the
              questionnaire. Submitting answers is optional, and you must
              acknowledge this notice before answers are saved.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/questionnaire" className="ui-button ui-button-primary">
            Go to questionnaire
          </Link>
          <Link href="/" className="ui-button ui-button-secondary">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
