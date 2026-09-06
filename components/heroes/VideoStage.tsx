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
    <div className="w-full">
      <div
        ref={stageRef}
        className="overflow-hidden rounded-card border border-line-strong bg-surface shadow-e4"
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
        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-sunken px-3 py-2.5 sm:px-4">
          <p className="text-micro font-mono uppercase text-ink-soft">{scene.label}</p>
          <StageProgress count={count} index={index} animate={videoOn} />
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

/**
 * Progress ticks. The active tick's fill is a CSS animation whose duration
 * comes from a custom property — deliberately not React state, because that is
 * precisely what the old 50ms setInterval was doing twenty times a second.
 */
function StageProgress({
  count,
  index,
  animate,
}: {
  count: number;
  index: number;
  animate: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="relative block h-0.5 w-6 overflow-hidden rounded-pill bg-line-strong"
        >
          {i === index && (
            <span
              key={`${index}-${animate}`}
              className="absolute inset-y-0 left-0 block rounded-pill bg-signal"
              style={{
                animation: `stage-fill ${duration.scene}ms linear forwards`,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
