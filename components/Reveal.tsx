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
 * Bonus: dropping framer-motion took ~34KB gzipped off nearly every route,
 * and made 83 client-component boundaries unnecessary.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  y,
}: {
  children: ReactNode;
  /** Seconds, matching the old framer-motion API. */
  delay?: number;
  className?: string;
  /** Kept for API compatibility; distance is a token now. */
  y?: number;
}) {
  const style: CSSProperties & Record<string, string | number> = {};
  if (delay) style["--rise-delay"] = `${Math.round(delay * 1000)}ms`;
  if (typeof y === "number") style["--distance-rise"] = `${y}px`;

  return (
    <div data-reveal className={className} style={style}>
      {children}
    </div>
  );
}
