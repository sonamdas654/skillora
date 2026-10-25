"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroScenes } from "@/lib/heroScenes";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";

const INTERVAL_MS = 5200;

export default function PremiumShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || resolveMotionTier() === "off") return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % heroScenes.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="premium-showcase"
      aria-roledescription="carousel"
      aria-label="Featured Skilloura builds"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="premium-showcase__stage">
        {heroScenes.map((scene, sceneIndex) => {
          const rawOffset = (sceneIndex - index + heroScenes.length) % heroScenes.length;
          const offset = rawOffset > Math.floor(heroScenes.length / 2)
            ? rawOffset - heroScenes.length
            : rawOffset;
          const position = Math.max(-2, Math.min(2, offset));

          return (
            <button
              key={scene.id}
              type="button"
              className={`premium-showcase__card is-pos-${position}`}
              aria-label={`Show ${scene.label}`}
              aria-current={offset === 0}
              aria-hidden={Math.abs(offset) > 2}
              tabIndex={Math.abs(offset) <= 1 ? 0 : -1}
              onClick={() => setIndex(sceneIndex)}
            >
              <span className="premium-showcase__chrome" aria-hidden>
                <i /><i /><i />
              </span>
              {/* Only the front slide is preloaded.

                  priority was already correctly limited to slide 0 — but
                  loading="eager" emits a preload link of its own in Next 16,
                  so all five posters were going out at highest priority on
                  every homepage load. Measured on a throttled mobile profile
                  that left the LCP image queued behind five fonts and six
                  other images on a 1.6 Mbps link, and LCP landed at 5.1s
                  against a 2.5s target.

                  The neighbours are still rendered, still in the DOM, still
                  visible in the stack — they just stop competing with the one
                  slide that decides LCP. They sit inside the viewport, so the
                  browser still fetches them straight away; it simply does so
                  at normal priority. The blur placeholder covers the gap so
                  nothing flashes empty while they arrive. */}
              <Image
                src={scene.poster.webp.src}
                alt={offset === 0 ? scene.caption : ""}
                fill
                priority={sceneIndex === 0}
                placeholder="blur"
                blurDataURL={scene.blurDataURL}
                sizes="(max-width: 899px) 78vw, 42vw"
                className="premium-showcase__slide"
              />
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">{heroScenes[index].label}</p>
    </div>
  );
}
