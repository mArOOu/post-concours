import Link from "next/link";
import { getResponse } from "@/src/services/firestore/responses";
import { computeScoresWithQuestions } from "@/src/services/firestore/scoring";
import { listQuestions } from "@/src/services/firestore/questions";
import { getScoringModel } from "@/src/services/firestore/settings";
import { listSpecialties } from "@/src/services/firestore/specialties";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ responseId: string }>;
}) {
  const { responseId } = await params;

  let results: Awaited<ReturnType<typeof computeScoresWithQuestions>> = [];
  let error: string | null = null;

  try {
    const response = await getResponse(responseId);
    if (!response) {
      error = "Response not found";
    } else {
      const [questions, scoringModel, specialties] = await Promise.all([
        listQuestions(),
        getScoringModel("baseline-v1"),
        listSpecialties(),
      ]);

      if (!scoringModel) {
        error = "Scoring model not found";
      } else {
        results = computeScoresWithQuestions(
          response.answers,
          scoringModel,
          specialties.map((s) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            attributeScores: s.attributeScores,
          })),
          questions,
        );
      }
    }
  } catch {
    error = "Failed to load results";
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/questionnaire" className="ui-button ui-button-secondary">
            Retake questionnaire
          </Link>
          <Link href="/specialties" className="ui-button ui-button-secondary">
            Browse specialties
          </Link>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center">
            <p className="text-lg font-medium text-red-700">{error}</p>
            <p className="mt-2 text-sm text-muted">
              Your data may not have loaded correctly.
            </p>
            <Link href="/questionnaire" className="ui-button mt-4 ui-button-primary">
              Try again
            </Link>
          </div>
        ) : results.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-muted">Computing results...</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
              Your results
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Your residency match snapshot
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              Based on your answers, here are the specialties that best match
              your preferences. Scores are relative — the higher the better.
            </p>

            <div className="mt-8 space-y-4">
              {results.map((result) => (
                <Link
                  key={result.specialtyId}
                  href={`/specialties/${result.specialtySlug}`}
                  className="ui-card has-hover p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {result.specialtyName}
                      </h2>
                      <div className="mt-1">
                        {result.topAttributes.map((attr) => (
                          <div key={attr.attribute} className="mt-1 text-sm text-muted">
                            <span className="text-xs uppercase tracking-wider">
                              {attr.attribute}:
                            </span>{" "}
                            You: {attr.preference} / Specialty: {attr.score}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="ui-score-badge">{result.matchScore}%</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <Link href="/questionnaire" className="ui-button ui-button-secondary">
                Retake questionnaire
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
