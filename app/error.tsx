"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site, whatsappLink } from "@/lib/site";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

/**
 * Error boundary.
 *
 * This route replaces the whole page, so the header and footer are not
 * rendered — which is why the previous version looked like a different site
 * entirely. It now uses the same canvas, type scale and light as everything
 * else, and it offers a real way out rather than only "try again": the two
 * channels a stuck visitor actually uses.
 *
 * No stack traces reach the visitor; the digest is logged for correlation.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled error boundary:", error);
  }, [error]);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-canvas px-4">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="aura aura-1" />
      </div>

      <main className="relative w-full max-w-lg">
        <p className="flex items-center gap-2.5 text-micro font-mono uppercase text-ink-soft">
          <span aria-hidden className="block h-2.5 w-px bg-brand" />
          Something broke
        </p>
        <h1 className="mt-4 text-display-3 text-ink">
          A temporary fault on our side — nothing you submitted is lost.
        </h1>
        <p className="mt-3 text-body-base text-ink-soft">
          Reloading usually clears it. If it happens twice, tell us and we&apos;ll look at it
          straight away — it is a small team, so it reaches a person immediately.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3.5 text-body-base font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-5 py-3.5 text-body-base font-semibold text-ink shadow-e1 transition-colors hover:border-brand hover:text-brand"
          >
            Back to home
          </Link>
        </div>

        <div className="scope-line mt-10">
          <p className="text-micro font-mono uppercase text-ink-muted">Reach a person</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={whatsappLink("Hi — I hit an error on skilloura.com.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body-sm font-semibold text-ink transition-colors hover:text-success"
            >
              <WhatsAppIcon className="size-4 text-success" />
              WhatsApp
            </a>
            <a
              href={`mailto:${site.email}`}
              className="text-body-sm font-semibold text-ink transition-colors hover:text-brand"
            >
              {site.email}
            </a>
          </div>
          {error.digest && (
            <p className="mt-4 text-micro font-mono text-ink-muted">Reference {error.digest}</p>
          )}
        </div>
      </main>
    </div>
  );
}
