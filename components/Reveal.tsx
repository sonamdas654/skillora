import type { ReactNode, CSSProperties } from "react";

/**
 * Scroll entrance wrapper. Same props as before, so all ~83 call sites are
 * untouched — but this is now a *server* component with no animation library
 * behind it.
 *
 * What changed and why:
 *
 * The previous version used framer-motion's `whileInView` with
 * `initial={{ opacity: 0 }}`. That meant content was invisible until an
 * IntersectionObserver fired. If it never fired — print, reader mode, a
 * failed hydration, a headless capture — the section stayed blank forever.
 * That was not theoretical: a full-page screenshot of /how-it-works showed
 * three entire sections as empty space.
 *
 * Now the markup renders visible by default. Hiding is opt-in, applied only
 * when the boot script has set data-motion="on" (see MotionProvider), and a
 * failsafe clears it if anything goes wrong. Worst case the animation is
 * skipped; the content is always there.
 *
 * Bonus: dropping framer-motion took ~34KB gzipped off nearly every route.
 * (An earlier note here claimed it removed 83 client-component boundaries.
 * Counted from git, three components became server components — but this is
 * one of them and it is used on twenty-odd pages, which is what actually took
 * the library off nearly every route.)
 *
 * `variant` picks the entrance. One motion repeated everywhere is on this
 * project's own banned list, and for most of the build that is what shipped.
 * The four variants are defined in app/styles/motion.css; "depth" is where the
 * three-dimensional quality comes from, with no WebGL involved.
 */
export type RevealVariant = "rise" | "depth" | "lift" | "unfurl" | "fade";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  y,
  variant = "rise",
}: {
  children: ReactNode;
  /** Seconds, matching the old framer-motion API. */
  delay?: number;
  className?: string;
  /** Kept for API compatibility; distance is a token now. */
  y?: number;
  /**
   * rise    the default vertical entrance
   * depth   a short rotateX under perspective — the 3D feel, no WebGL
   * lift    scale with the rise, for panels and cards
   * unfurl  a clip-path wipe; the scope line drawing itself
   * fade    opacity only, for content already carrying a transform
   */
  variant?: RevealVariant;
}) {
  const style: CSSProperties & Record<string, string | number> = {};
  if (delay) style["--rise-delay"] = `${Math.round(delay * 1000)}ms`;
  if (typeof y === "number") style["--distance-rise"] = `${y}px`;

  return (
    <div data-reveal={variant} className={className} style={style}>
      {children}
    </div>
  );
}
