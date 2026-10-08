"use client";

import { useEffect } from "react";
import { startRevealRegistry, disableReveals } from "@/lib/motion/revealRegistry";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";

/**
 * Installs the shared reveal observer.
 *
 * The `data-motion="on"` attribute is enabled after hydration, immediately
 * before the observer starts. This keeps server and client markup identical.
 *
 * Mount this once, high in the tree. It is deliberately render-free.
 */
export default function MotionProvider() {
  useEffect(() => {
    if (resolveMotionTier() === "off") {
      disableReveals();
      return;
    }
    // This must happen after hydration. The previous inline boot script
    // mutated <html> and reveal nodes before React attached, so React compared
    // its server markup with an already-modified DOM and raised a hydration
    // mismatch on every page load.
    document.documentElement.setAttribute("data-motion", "on");
    const stop = startRevealRegistry();
    return () => {
      stop();
      document.documentElement.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
