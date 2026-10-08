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

---

## Reveal variants

`Reveal` takes a `variant`. Four exist, and four is the number on purpose — a
system with a dozen entrances has no vocabulary, it has noise.

| Variant | Motion | Use for |
|---|---|---|
| `rise` | translateY, the default | Text blocks, headings, general content |
| `depth` | short `rotateX` under `perspective` | Where the page should feel three-dimensional |
| `lift` | scale with the rise | Cards and panels — things that read as objects |
| `unfurl` | `clip-path` wipe | Rules and ledgers; the scope line drawing itself |
| `fade` | opacity only | Content already carrying its own transform |

**Why this exists.** For most of the rebuild there was exactly one reveal — a
translateY fade — used on all ~83 call sites. "Repeated fade-up as the only
reveal" is on this project's own banned list, and shipping it anyway is what the
banned list was written to prevent.

**`depth` is where the 3D comes from, and it is deliberately not WebGL.** The
plan set a ceiling: if the homepage's first-load JS exceeded 180 kB gzipped,
`three` and `@react-three/fiber` come out and the CSS approach ships as the real
thing. The homepage measures 237 kB without any of it, so the ceiling decided —
and `three` is now uninstalled. A `rotateX` under `perspective` is one
compositor-friendly transform, costs no JavaScript, and works on every device
including the ones that would never have run a shader.

### The rule when applying one

**No two consecutive sections on a page use the same variant.** That is the same
rule the layout primitives follow, for the same reason: repetition is what made
the old site read as a template.

### One hard-won constraint

**Never put the hide state's clipping on the element the observer watches.**

`unfurl` originally hid with `clip-path: inset(0 100% 0 0)`. A target clipped to
zero width is a target the IntersectionObserver may never report as
intersecting — and that observer is the only thing that removes the hide state.
The hide state prevented its own removal. `tools/qa/reveal-check.mjs` caught it:
one ledger on a case study stayed hidden after a full scroll.

The hide state is now opacity alone; the wipe lives in the keyframe, which runs
only after the element has been marked done. `reveal-check.mjs` was also
extended to look for clip-path, because an opacity-only check calls a
clipped-to-nothing element perfectly visible.
