// TypeScript mirror of the motion tokens in app/styles/palette.css and
// app/styles/theme.css. Anything that needs a duration or easing in JS reads
// it from here, so the CSS and the JS can never drift apart.
//
// If you change a value here, change it in the CSS too — and vice versa.

export const duration = {
  instant: 120,
  fast: 220,
  base: 360,
  slow: 620,
  /** One hero video clip. */
  scene: 8000,
} as const;

export const ease = {
  entrance: "cubic-bezier(0.2, 0.65, 0.3, 1)",
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  outQuint: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

/** Distance a revealing element travels, matching --distance-rise. */
export const RISE_DISTANCE_PX = 14;

/** Gap between staggered siblings, matching --stagger-step. */
export const STAGGER_STEP_MS = 70;

/**
 * How long the no-JS/failed-hydration failsafe waits before forcing every
 * pending reveal visible. Generous enough that a slow phone finishing
 * hydration still gets the animation, short enough that a broken observer
 * never leaves the page blank.
 */
export const REVEAL_FAILSAFE_MS = 3500;
