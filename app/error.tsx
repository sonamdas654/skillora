"use client";

import Link from "next/link";

// Friendly branded error boundary — no stack traces for visitors, just a way forward.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 sm:p-10 text-center shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)]">
        <p className="text-5xl" aria-hidden>
          ⚙️
        </p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          A temporary glitch on our side — your data is safe. Try again, or head back to the
          homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
