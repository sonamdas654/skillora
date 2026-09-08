"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";
import { AUTOPLAY_REVIEW_MS } from "@/lib/motion/tokens";

export interface Review {
  id: string;
  clientName: string;
  clientBusiness: string | null;
  rating: number;
  review: string;
}

/**
 * Client reviews as one advancing panel, not a grid.
 *
 * The previous shape put one review large beside a list of the rest. It read
 * as two unrelated things stacked, and only the first review was ever really
 * seen. This gives every review the same room and moves through them on its
 * own, which is what the owner asked for after looking at it.
 *
 * Motion contract (components/motion/CONTRACT.md), all five points:
 *
 *  1. IntersectionObserver-gated — the timer does not run until the section is
 *     actually on screen, and stops again when it leaves.
 *  2. prefers-reduced-motion honoured through resolveMotionTier(): autoplay
 *     never starts, and the arrows and dots still work. Someone who has asked
 *     for less motion gets a manual carousel, not a broken one.
 *  3. One setState per advance — roughly one every seven seconds. Nothing is
 *     animated from JavaScript; the crossfade is CSS.
 *  4. Paused on hover, on focus within, and when the tab is hidden. Reading a
 *     review should not be interrupted because a timer expired.
 *  5. Every timer and listener is cleaned up on unmount.
 *
 * Avatars are monograms, deliberately. Stock photography attached to a named
 * person is the one thing on a page like this that a visitor checks, and this
 * site's whole argument is that it does not fabricate proof.
 */
export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const count = reviews.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  // Only run while the section is on screen AND the visitor has not asked for
  // reduced motion. Both conditions, not either.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || count < 2) return;
    if (resolveMotionTier() !== "full") return;

    const observer = new IntersectionObserver(
      ([entry]) => setAutoplay(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!autoplay) return;
    const tick = setInterval(() => {
      // A hidden tab or a hovering reader suspends the advance without
      // tearing down the timer, so resuming is instant.
      if (pausedRef.current || document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_REVIEW_MS);
    return () => clearInterval(tick);
  }, [autoplay, count]);

  if (count === 0) return null;
  const active = reviews[index];
  const initials = active.clientName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      ref={sectionRef}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        {/* Monogram, in the arch the reference used for a portrait. */}
        <div className="mx-auto w-full max-w-[18rem] lg:mx-0">
          <div
            className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-t-[10rem] rounded-b-card border border-line bg-surface-sunken"
            aria-hidden
          >
            <div className="aura aura-1 absolute inset-0 opacity-70" />
            <span
              key={active.id}
              className="relative font-display text-[5.5rem] font-semibold leading-none text-brand"
            >
              {initials}
            </span>
          </div>
        </div>

        {/* The review itself. aria-live so a screen reader is told when the
            panel changes under it rather than silently showing new text. */}
        <div aria-live="polite" aria-atomic="true">
          <p className="font-accent text-display-1 leading-none text-brand/25" aria-hidden>
            &ldquo;
          </p>
          <blockquote key={active.id} className="-mt-6 sm:-mt-8">
            <p className="font-mono text-body-sm text-warning" aria-label={`${active.rating} out of 5`}>
              {"★".repeat(active.rating)}
              <span className="text-line-strong">{"★".repeat(5 - active.rating)}</span>
            </p>
            <p className="mt-4 max-w-2xl text-title-2 leading-relaxed text-ink sm:text-title-1">
              {active.review}
            </p>
            <footer className="mt-7 border-t border-line-strong pt-4">
              <p className="text-body-base font-semibold text-ink">{active.clientName}</p>
              {active.clientBusiness && (
                <p className="mt-0.5 font-mono text-micro uppercase text-ink-muted">
                  {active.clientBusiness}
                </p>
              )}
            </footer>
          </blockquote>

          {count > 1 && (
            <div className="mt-8 flex items-center gap-5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="Previous review"
                  className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:border-brand hover:text-brand"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="Next review"
                  className="grid size-11 place-items-center rounded-full bg-brand text-on-brand transition-colors hover:bg-brand-deep"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2" role="tablist" aria-label="Choose a review">
                {reviews.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Review ${i + 1} of ${count}, ${r.clientName}`}
                    onClick={() => go(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-7 bg-brand" : "w-1.5 bg-line-strong hover:bg-brand/50"
                    }`}
                  />
                ))}
              </div>

              <span className="ml-auto font-mono text-micro text-ink-muted">
                {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
