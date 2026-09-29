"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { HeroScene } from "@/lib/heroScenes";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";
import { duration } from "@/lib/motion/tokens";

/**
 * The hero stage: real footage of Skilloura's own concept builds, advancing
 * like a carousel.
 *
 * The LCP contract, stated plainly:
 *
 *   The poster <img> is the LCP element. Always. It is server-rendered
 *   alongside the headline, carries `priority`, and is present with
 *   JavaScript disabled. Video is progressive enhancement that mounts later
 *   and is never an LCP candidate.
 *
 * The previous implementation did the opposite — 651 lines of canvas painting
 * a fake "video" on a near-black background, with a 50ms setInterval driving
 * React state twenty times a second, forever, with no IntersectionObserver and
 * no reduced-motion check. Every one of those is fixed here:
 *
 *   - the scene advances on the video's own `ended` event, so scene changes
 *     cost ONE setState per ~8s rather than twenty per second
 *   - the progress ring is a pure CSS animation driven by a custom property;
 *     React is not involved in it at all
 *   - at most two <video> elements exist (current + next), and the next only
 *     starts downloading at 60% of the current clip
 *   - nothing downloads until every gate below passes
 */

const MOBILE_BREAKPOINT = 768;
const MID_BREAKPOINT = 1024;
/** Start fetching the next clip once the current one is this far through. */
const PREFETCH_AT = 0.6;

interface Connection {
  saveData?: boolean;
  effectiveType?: string;
}

/** Every one of these must pass before a single video byte is requested. */
function videoAllowed(): { allowed: boolean; rung: "hd" | "md" } {
  if (typeof window === "undefined") return { allowed: false, rung: "md" };
  if (resolveMotionTier() !== "full") return { allowed: false, rung: "md" };

  const width = window.innerWidth;
  // Under 768px there is no video at all — the poster carousel is the
  // experience. Phones pay the whole cost and see the least of it.
  if (width < MOBILE_BREAKPOINT) return { allowed: false, rung: "md" };

  const conn = (navigator as Navigator & { connection?: Connection }).connection;
  if (conn?.saveData) return { allowed: false, rung: "md" };
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) {
    return { allowed: false, rung: "md" };
  }

  return { allowed: true, rung: width >= MID_BREAKPOINT ? "hd" : "md" };
}

export default function VideoStage({ scenes }: { scenes: HeroScene[] }) {
  const [index, setIndex] = useState(0);
  // null = poster-only. Set once, in the idle callback, never during render
  // or synchronously inside an effect.
  const [videoMode, setVideoMode] = useState<{ rung: "hd" | "md" } | null>(null);
  const videoOn = videoMode !== null;

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // Once a session falls back to posters it stays there. No retry loop, no
  // state churn, no chance of a stalled network thrashing the hero.
  const failedRef = useRef(false);
  const prefetchedRef = useRef<number | null>(null);

  const count = scenes.length;
  const advance = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  /**
   * Jump to a scene the visitor picked from the rail.
   *
   * The clip that was playing is rewound rather than left mid-way, so coming
   * back to it later starts from the beginning instead of the two seconds that
   * happened to be left. Guarded on `paused` because a video that never
   * mounted — poster-only, reduced motion, slow connection — has no element to
   * rewind, and this must not throw in that case.
   */
  const select = useCallback(
    (next: number) => {
      setIndex((current) => {
        if (next === current) return current;
        const leaving = videoRefs.current[current];
        if (leaving) {
          try {
            leaving.pause();
            leaving.currentTime = 0;
          } catch {
            /* not all states allow a seek; the crossfade covers it */
          }
        }
        const arriving = videoRefs.current[next];
        if (arriving) {
          arriving.currentTime = 0;
          void arriving.play().catch(() => {});
        }
        return next;
      });
    },
    []
  );

  // Decide whether video is allowed, then mount it only when the browser is
  // otherwise idle.
  useEffect(() => {
    if (count === 0) return;
    const { allowed, rung } = videoAllowed();
    if (!allowed) return;

    let cancelled = false;
    const mount = () => {
      if (!cancelled && !failedRef.current) setVideoMode({ rung });
    };

    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(mount, { timeout: 2500 })
      : window.setTimeout(mount, 1200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [count]);

  // Poster-only mode still needs to advance, so the hero is never static.
  useEffect(() => {
    if (videoOn || count === 0) return;
    if (resolveMotionTier() === "off") return;
    const timer = setInterval(advance, duration.scene);
    return () => clearInterval(timer);
  }, [videoOn, advance, count]);

  // Play the current clip, pause the rest, and warm up the next one late.
  useEffect(() => {
    if (!videoOn) return;
    const current = videoRefs.current[index];
    if (!current) return;

    prefetchedRef.current = null;
    current.currentTime = 0;
    current.play().catch(() => {
      failedRef.current = true;
      setVideoMode(null);
    });

    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) v.pause();
    });
  }, [index, videoOn]);

  // Pause everything when the tab is hidden or the hero scrolls away — a hero
  // that keeps decoding video while someone reads the footer is exactly the
  // kind of waste this rebuild exists to remove.
  useEffect(() => {
    if (!videoOn) return;
    const stage = stageRef.current;
    if (!stage) return;

    let onScreen = true;
    const sync = () => {
      const v = videoRefs.current[index];
      if (!v) return;
      if (onScreen && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(stage);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [videoOn, index]);

  const handleTimeUpdate = (i: number) => {
    if (i !== index) return;
    const v = videoRefs.current[i];
    if (!v || !v.duration) return;
    if (v.currentTime / v.duration < PREFETCH_AT) return;

    const next = (i + 1) % count;
    if (prefetchedRef.current === next) return;
    prefetchedRef.current = next;
    const nextEl = videoRefs.current[next];
    if (nextEl && nextEl.preload !== "auto") {
      nextEl.preload = "auto";
      nextEl.load();
    }
  };

  if (count === 0) return null;
  const scene = scenes[index];

  return (
    <div className="min-w-0 w-full max-w-full">
      {/* No hard border, a deeper radius, and the aura sitting behind rather
          than beside. The old frame — border-line-strong on a flat surface with
          a bordered strip beneath — read as a boxed square sitting on the page.
          A carousel should look like something moving through a window. */}
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-panel opacity-70 blur-2xl"
          style={{
            background:
              "linear-gradient(112deg, rgb(224 145 63 / 0.30), rgb(220 106 82 / 0.22), rgb(14 82 87 / 0.24))",
          }}
          aria-hidden
        />
        <div
          ref={stageRef}
          className="overflow-hidden rounded-panel bg-surface shadow-e4 ring-1 ring-ink/5"
        >
        <div
          className="relative isolate"
          style={{ aspectRatio: `${scene.width} / ${scene.height}` }}
        >
        {/* LCP element. Server-rendered, priority, present without JS. */}
        {scenes.map((s, i) => (
          <Image
            key={s.id}
            src={s.poster.webp.src}
            alt={s.caption}
            fill
            sizes="(max-width: 1023px) 100vw, 46vw"
            priority={i === 0}
            placeholder="blur"
            blurDataURL={s.blurDataURL}
            className="absolute inset-0 object-cover transition-opacity"
            style={{
              opacity: i === index ? 1 : 0,
              transitionDuration: `${duration.slow}ms`,
            }}
          />
        ))}

        {/* Video mounts on top only once every gate has passed. */}
        {videoOn &&
          scenes.map((s, i) => (
            <video
              key={s.id}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 size-full object-cover transition-opacity"
              style={{
                opacity: i === index ? 1 : 0,
                transitionDuration: `${duration.slow}ms`,
              }}
              // muted + playsInline are what make autoplay legal at all; without
              // playsInline iOS takes the video fullscreen the moment it starts.
              muted
              playsInline
              autoPlay={i === index}
              preload={i === index ? "auto" : "none"}
              poster={s.poster.jpg.src}
              disablePictureInPicture
              aria-hidden
              tabIndex={-1}
              onEnded={() => i === index && advance()}
              onTimeUpdate={() => handleTimeUpdate(i)}
              onError={() => {
                failedRef.current = true;
                setVideoMode(null);
              }}
              onStalled={() => {
                failedRef.current = true;
                setVideoMode(null);
              }}
            >
              <source src={s.sources[videoMode.rung].webm.src} type="video/webm" />
              <source src={s.sources[videoMode.rung].mp4.src} type="video/mp4" />
            </video>
          ))}

        </div>

        {/* Label and progress sit BELOW the footage, not over it. Overlaid on
            the video they collided with whatever the demo happened to be
            showing — and no scrim fixes that when the footage itself varies
            from a dark restaurant site to a white dashboard. */}
        {/* A rail, not a caption bar. Every scene is nameable and clickable,
            so this is a carousel a visitor can steer rather than a slideshow
            they can only wait through. The active tick still fills in CSS. */}
        <div className="flex items-center gap-2 bg-surface-sunken px-2.5 py-2 sm:px-3">
          <button
            type="button"
            onClick={() => select((index - 1 + count) % count)}
            aria-label="Previous build"
            className="grid size-7 shrink-0 place-items-center rounded-pill text-ink-soft transition-colors hover:bg-ink/5 hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => select(i)}
                aria-current={i === index}
                className={`group relative shrink-0 rounded-pill px-2.5 py-1 text-micro font-mono uppercase transition-colors ${
                  i === index
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink-soft"
                }`}
              >
                {s.label}
                <span className="absolute inset-x-2.5 bottom-0 block h-0.5 overflow-hidden rounded-pill bg-line-strong opacity-0 transition-opacity group-hover:opacity-100" />
                {i === index && (
                  <span className="absolute inset-x-2.5 bottom-0 block h-0.5 overflow-hidden rounded-pill bg-line-strong opacity-100">
                    <span
                      key={`${index}-${videoOn}`}
                      className="absolute inset-y-0 left-0 block rounded-pill bg-signal"
                      style={{ animation: `stage-fill ${duration.scene}ms linear forwards` }}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => select((index + 1) % count)}
            aria-label="Next build"
            className="grid size-7 shrink-0 place-items-center rounded-pill text-ink-soft transition-colors hover:bg-ink/5 hover:text-brand"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        </div>
      </div>

      <p className="mt-3 text-body-sm text-ink-soft">
        {scene.caption}{" "}
        <a href={scene.route} className="font-semibold text-brand underline-offset-4 hover:underline">
          Open this build
        </a>
      </p>
    </div>
  );
}
