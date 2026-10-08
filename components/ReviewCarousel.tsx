"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";
import { AUTOPLAY_REVIEW_MS } from "@/lib/motion/tokens";
import "./ReviewCarousel.css";

export interface Review {
  id: string;
  clientName: string;
  clientBusiness: string | null;
  rating: number;
  review: string;
}

/**
 * Client Success Stories — one review centred on the stage, with the previous
 * and next peeking in behind it.
 *
 * The shape before this put one review large beside a list of the rest. It read
 * as two unrelated things stacked, and in practice only the first review was
 * ever seen. Every review now gets the same room and the panel moves through
 * them on its own.
 *
 * Motion contract (components/motion/CONTRACT.md), all five points:
 *
 *  1. IntersectionObserver-gated — the timer does not run until the section is
 *     actually on screen, and stops again when it leaves.
 *  2. prefers-reduced-motion honoured through resolveMotionTier(): autoplay
 *     never starts, and the arrows, dots and swipe still work. Someone who has
 *     asked for less motion gets a manual carousel, not a broken one.
 *  3. One setState per advance — roughly one every seven seconds. Nothing is
 *     animated from JavaScript; the slide is CSS.
 *  4. Paused on hover, on focus within, and when the tab is hidden. Reading a
 *     review should not be interrupted because a timer expired.
 *  5. Every timer and listener is cleaned up on unmount.
 *
 * Swipe is pointer events with a distance threshold, resolved once on release.
 * Dragging does not move the card under the finger, because doing that means
 * writing a transform on every pointermove, and point 3 is the rule that keeps
 * this section cheap.
 *
 * Avatars are monograms, deliberately. Stock photography attached to a named
 * person is the one thing on a page like this that a visitor checks, and this
 * site's whole argument is that it does not fabricate proof.
 *
 * There is no category badge on the card. The reference this was built from
 * shows one ("E-Commerce Store"), but the testimonials table has no category
 * column — only id, client_name, client_business, rating, review and source,
 * where source is provenance ('client-submitted' or 'studio-written'), not a
 * service. Filling that badge would have meant inventing a label per client.
 */
export default function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);

  const count = reviews.length;
  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  // Only run while the section is on screen AND the visitor has not asked for
  // reduced motion. Both conditions, not either.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || count < 2) return;
    if (resolveMotionTier() !== "full") return;

    const observer = new IntersectionObserver(([entry]) => setAutoplay(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [count]);

  useEffect(() => {
    if (!autoplay) return;
    const tick = setInterval(() => {
      // A hidden tab or a hovering reader suspends the advance without tearing
      // down the timer, so resuming is instant.
      if (pausedRef.current || document.hidden) return;
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_REVIEW_MS);
    return () => clearInterval(tick);
  }, [autoplay, count]);

  // Arrow keys move the carousel when focus is inside it, which is what a
  // keyboard user expects of something presented as a carousel.
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (count < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    },
    [count, go, index],
  );

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    swipeRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || count < 2) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // Horizontal intent only, and far enough to be a swipe rather than a tap
    // that wandered. Otherwise a vertical scroll would flick the carousel.
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? index + 1 : index - 1);
  };

  if (count === 0) return null;

  // Shortest signed distance from the active slide, so the card that is one
  // step behind the first review is the last one, not eight steps away.
  const offsetOf = (i: number) => {
    let d = i - index;
    if (d > count / 2) d -= count;
    if (d < -count / 2) d += count;
    return d;
  };

  const positionClass = (d: number) =>
    d === 0 ? "is-active" : d === -1 ? "is-prev" : d === 1 ? "is-next" : "is-far";

  const initialsOf = (name: string) =>
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <div
      ref={sectionRef}
      className="reviews"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocusCapture={() => (pausedRef.current = true)}
      onBlurCapture={() => (pausedRef.current = false)}
      onKeyDown={onKeyDown}
    >
      <div className="reviews__head">
        <p className="reviews__eyebrow">Client reviews</p>
        <span className="reviews__rule" aria-hidden>
          <i />
          <i />
        </span>
        <h2 className="reviews__title">Client Success Stories</h2>
        <p className="reviews__intro">
          Real businesses, real results. Hear from the clients who have grown, automated and scaled
          with Skilloura.
        </p>
      </div>

      <div className="reviews__stage">
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous review"
            className="reviews__nav is-prev"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* aria-live so a screen reader is told the panel changed under it,
            rather than silently showing new text. */}
        <div
          className="reviews__track"
          aria-live="polite"
          aria-atomic="true"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeRef.current = null)}
        >
          {reviews.map((r, i) => {
            const d = offsetOf(i);
            const isActive = d === 0;
            return (
              <article
                key={r.id}
                className={`reviews__card ${positionClass(d)}`}
                aria-hidden={!isActive}
                // Only the visible review is in the accessibility tree and the
                // tab order; the others are decoration until they arrive.
                inert={!isActive}
              >
                <span className="reviews__quote" aria-hidden>
                  &ldquo;
                </span>

                <p className="reviews__stars" aria-label={`${r.rating} out of 5`}>
                  {"★".repeat(r.rating)}
                  <span>{"★".repeat(5 - r.rating)}</span>
                </p>

                <blockquote>
                  <p className="reviews__text">{r.review}</p>
                  <footer className="reviews__foot">
                    <span className="reviews__mono" aria-hidden>
                      {initialsOf(r.clientName)}
                    </span>
                    <span className="reviews__who">
                      <strong>{r.clientName}</strong>
                      {r.clientBusiness && <small>{r.clientBusiness}</small>}
                    </span>
                  </footer>
                </blockquote>
              </article>
            );
          })}
        </div>

        {count > 1 && (
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next review"
            className="reviews__nav is-next"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="reviews__controls">
          <div className="reviews__dots" role="tablist" aria-label="Choose a review">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Review ${i + 1} of ${count}, ${r.clientName}`}
                onClick={() => go(i)}
                className="reviews__dot"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
