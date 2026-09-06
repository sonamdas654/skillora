# Motion contract

Every animated component in this codebase satisfies all eight rules below.
A component that cannot does not ship.

This exists because of a real regression, not as theory. The previous build
had `HeroVideoCarousel` running a 50 ms `setInterval` that called `setProgress`
— twenty React re-renders per second, forever — and `ExecutionBlueprintStage`
calling `setProgress` inside `requestAnimationFrame`, sixty per second. Neither
checked `prefers-reduced-motion`. Neither stopped when scrolled off screen.
Both kept running while the visitor read the footer.

---

## The rules

**1. No `setState` faster than 4 Hz.**
Per-frame values go to a ref or a CSS custom property. `setState` is for
discrete changes only — the active scene index, the open tab, the current step.
If a number changes every frame, it is not React state.

**2. Gate on `IntersectionObserver`.**
Nothing animates before its element is on screen, and it stops on exit — not
just "runs once". Use `useRafLoop`, which does this for you.

**3. Read the motion tier and degrade.**
`useMotionTier()` returns `full | reduced | off`.
`full` gets everything. `reduced` gets opacity changes only — no transforms, no
loops, no video. `off` gets a static first frame. There is no fourth option and
no component-local override.

**4. Pause when the tab is hidden, clean up on unmount.**
`document.visibilitychange` stops the loop; the effect's teardown cancels the
frame, disconnects observers and clears `will-change`.

**5. Animate `transform`, `opacity` and `filter` only.**
Never `width`, `height`, `top`, `left` or `box-shadow` — they force layout or
paint on every frame. Set `will-change` when a loop starts and clear it when it
stops; leaving it on permanently costs memory on every layer.

**6. Contain the work.**
A section with a live loop carries `contain: paint`. Below-the-fold sections
carry `content-visibility: auto` with a `contain-intrinsic-size`.

**7. Mobile tiers down by default.**
Coarse pointer plus a viewport under 768 px means static, unless there is a
specific reason otherwise written in the component.

**8. Stay inside the budget.**
At most **two** concurrent `requestAnimationFrame` loops per viewport, and at
most **one** canvas or WebGL context per page. In development `useRafLoop`
tracks `window.__motionLoops` so this is checkable rather than assumed.

---

## Reveals are not covered by this

`Reveal` is deliberately CSS-only and has no runtime loop. It renders content
**visible by default**; hiding is opt-in via `data-motion="on"`, which the boot
script sets before paint only when the visitor has not asked for reduced
motion, and a failsafe clears it after 3.5 s if hydration never happens.

That ordering matters. The old framer-motion version started at `opacity: 0`
and depended on an observer firing to become visible — so print, reader mode,
a headless capture or a failed hydration left whole sections permanently blank.
Animation is the enhancement. Readable content is the precondition.

---

## Why there is no animation library

`framer-motion` was a dependency used by exactly one 29-line component. Every
motion this site needs — entrance reveals, hover lift, the scope-line motif,
the hero crossfade, scroll-linked depth — is CSS, or a single `useRafLoop`.
Removing it took roughly 34 KB gzipped off nearly every route and turned 83
client-component boundaries back into server components.

GSAP and ScrollTrigger were considered and rejected: about 70 KB gzipped for a
second animation runtime competing with React's scheduler, buying capabilities
this site does not use. Lenis was rejected outright — smooth-scroll hijacking
fights `scroll-behavior: smooth`, breaks the skip link and anchor navigation,
and is a known INP hazard on mid-range Android. On a lead-generation site the
scroll *is* the conversion path.

If a future signature moment genuinely cannot be built without a library, add
it then, for that one thing, lazily.
