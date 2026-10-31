"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-5 py-8 sm:px-8 lg:px-10">
      <section className="ui-error-state w-full p-8 sm:p-10 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
          Something went wrong
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          We could not load this screen.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          Please try again. If the problem persists, refresh the page or return
          to the home screen.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="ui-button ui-button-primary"
            onClick={reset}>
            Try again
          </button>
          <Link href="/" className="ui-button ui-button-secondary">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
