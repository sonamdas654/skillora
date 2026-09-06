"use client";

import { useEffect, useRef } from "react";
import { resolveMotionTier } from "./useMotionTier";

/**
 * The only sanctioned requestAnimationFrame loop in this codebase.
 *
 * It exists because the previous implementation had two components driving
 * React state from a timer — a 50ms setInterval calling setProgress (20
 * re-renders a second) and a rAF calling setProgress (60 a second) — both
 * running forever, off-screen, and with no reduced-motion check. That is the
 * single biggest reason the old build felt janky and drained batteries.
 *
 * The rules this enforces for you:
 *  - the loop only runs while the element is on screen
 *  - it pauses when the tab is hidden
 *  - it never starts at all when the visitor has asked for less motion
 *  - per-frame values go to a ref/CSS custom property, never to setState
 *
 * `onFrame` receives elapsed milliseconds since the loop (re)started. Write
 * to the DOM inside it. Do not call setState inside it.
 */
export function useRafLoop(
  targetRef: React.RefObject<HTMLElement | null>,
  onFrame: (elapsedMs: number) => void,
  { enabled = true }: { enabled?: boolean } = {}
) {
  // Kept in a ref so a new inline callback on every render does not restart
  // the loop. Synced in an effect, never during render.
  const callbackRef = useRef(onFrame);
  useEffect(() => {
    callbackRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;
    if (resolveMotionTier() !== "full") return;

    let frame = 0;
    let startedAt = 0;
    let onScreen = false;
    let running = false;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      callbackRef.current(now - startedAt);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      startedAt = 0;
      el.style.willChange = "transform, opacity";
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
      el.style.willChange = "";
    };

    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    if (process.env.NODE_ENV !== "production") {
      const w = window as Window & { __motionLoops?: number };
      w.__motionLoops = (w.__motionLoops ?? 0) + 1;
    }

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (process.env.NODE_ENV !== "production") {
        const w = window as Window & { __motionLoops?: number };
        w.__motionLoops = Math.max(0, (w.__motionLoops ?? 1) - 1);
      }
    };
  }, [targetRef, enabled]);
}
