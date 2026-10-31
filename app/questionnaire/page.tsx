"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  questionText: string;
  category: string;
  scaleMin: number;
  scaleMax: number;
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (!res.ok) throw new Error("Failed to load questions");
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch {
        setError("Could not load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      router.push(`/results/${data.responseId}`);
    } catch {
      setError("Could not save your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-muted">Loading questions...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-surface-elevated p-8 sm:p-10 lg:p-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/specialties" className="ui-button ui-button-secondary">
            Browse specialties
          </Link>
          <div className="text-sm text-muted">
            {answeredCount === 0
              ? "No questions answered yet"
              : `${answeredCount} of ${totalCount} answered`}
          </div>
        </div>

        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Residency fit questionnaire
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          Rate each statement from 1 (strongly disagree) to 5 (strongly agree).
          Your answers shape the match score.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-5">
          {questions.map((q) => (
            <div key={q.id} className="ui-card p-5">
              <div className="mb-1 flex items-center justify-between gap-4">
                <p className="text-sm font-medium">{q.questionText}</p>
                <span className="text-xs uppercase text-muted">{q.category}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-muted">{q.scaleMin}</span>
                <input
                  type="range"
                  min={q.scaleMin}
                  max={q.scaleMax}
                  value={answers[q.id] ?? q.scaleMin}
                  onChange={(e) =>
                    handleAnswer(q.id, parseInt(e.target.value, 10))
                  }
                  className="flex-1"
                />
                <span className="text-xs text-muted">{q.scaleMax}</span>
              </div>

              <div className="mt-2 flex justify-center">
                <span className="ui-value-badge">
                  {answers[q.id] ?? q.scaleMin}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
            className="ui-button ui-button-primary"
          >
            {submitting
              ? "Saving..."
              : answeredCount === 0
                ? "Answer at least one question"
                : "See my results"}
          </button>
          {answeredCount > 0 && (
            <button
              onClick={() => setAnswers({})}
              className="ui-button ui-button-secondary"
            >
              Clear answers
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
