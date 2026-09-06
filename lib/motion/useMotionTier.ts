"use client";

import { useEffect, useState } from "react";

/**
 * How much motion this visitor should get.
 *
 * - `full`    — everything: reveals, ambient loops, video, the hero depth layer.
 * - `reduced` — opacity only. No transforms, no continuous loops, no video.
 * - `off`     — static first frame. The visitor asked for no motion.
 *
 * This is the single source of truth. Every animated component reads it and
 * degrades accordingly (see components/motion/CONTRACT.md). Nothing decides
 * "am I allowed to animate" on its own.
 */
export type MotionTier = "full" | "reduced" | "off";

interface Connection {
  saveData?: boolean;
  effectiveType?: string;
}

export function resolveMotionTier(): MotionTier {
  if (typeof window === "undefined") return "full";

  // An explicit accessibility preference wins over everything else.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";

  const nav = navigator as Navigator & {
    connection?: Connection;
    deviceMemory?: number;
  };
  const conn = nav.connection;

  // Someone on a metered or genuinely slow connection should not be paying
  // for decoration.
  if (conn?.saveData) return "reduced";
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") return "reduced";

  // Low-end devices: continuous loops are what makes a cheap phone hot and
  // its scrolling janky.
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return "reduced";
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return "reduced";

  return "full";
}

/**
 * Starts at `full` so server and first client render agree — the tier is only
 * narrowed after mount, which never causes a hydration mismatch because the
 * markup is identical either way.
 */
export function useMotionTier(): MotionTier {
  const [tier, setTier] = useState<MotionTier>("full");

  useEffect(() => {
    const apply = () => setTier(resolveMotionTier());
    apply();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return tier;
}
