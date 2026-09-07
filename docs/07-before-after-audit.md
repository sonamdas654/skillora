# Before and after

*Written 2026-09-07, comparing `main` with `redesign/measured-light` at
19 commits. Every figure below is measured or counted from the repository. Where
an earlier claim turned out to be wrong, the correction is stated rather than
quietly dropped.*

---

## The shape of the change

| | |
|---|---|
| Commits | 19 |
| Files changed | 151 |
| Lines | +11,738 / −4,486 |
| Public routes | 64 → 66 page files, 82 indexable URLs in the sitemap |
| Dependencies removed | `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`, `@splinetool/react-spline` |
| Dependencies added | `playwright`, `ffmpeg-static`, `axe-core` (all dev-only) |

Six runtime dependencies out, three development dependencies in. Nothing was
added to what a visitor downloads.

---

## Performance

The single largest defect found was not visual. Three of the most important
pages carried `force-dynamic` **and** a `cookies()`-bound Supabase client, which
opts a route into dynamic rendering regardless of any revalidate setting. Every
request re-rendered from scratch.

| Route | Before | After |
|---|---|---|
| `/` | **7.15s** TTFB | 0.009s |
| `/blog` | **7.39s** | ISR |
| `/portfolio` | **7.17s** | ISR |
| `/about` (already static) | 0.67s | — |
| `/services` (already static) | 0.27s | — |

Deleting `force-dynamic` alone would not have fixed it. The fix was a
cookie-free `lib/supabase/public.ts` for public content reads.

### Core Web Vitals now

Measured on a production build with Chromium at 412×915, 4× CPU throttling and a
1.6 Mbps / 150 ms connection — a mid-range Android on a typical Indian mobile
network. Median of three valid runs per route.

| Route | LCP | CLS | JS (wire) | Total |
|---|---|---|---|---|
| `/get-started` | 1.06s | 0 | 286 kB | 458 kB |
| `/case-studies` | 1.86s | 0.0003 | 249 kB | 472 kB |
| `/about` | 1.86s | 0.0002 | 249 kB | 470 kB |
| `/blog` | 1.85s | 0.0001 | 261 kB | 516 kB |
| `/contact` | 1.83s | 0 | 250 kB | 470 kB |
| `/portfolio` | 2.01s | 0 | 252 kB | 565 kB |
| `/` | **2.29s** | 0 | 237 kB | 623 kB |

Every route under Google's 2.5s "good" threshold, with layout shift at or near
zero. The homepage was 3.44s until the header logo stopped claiming a `priority`
preload and the font files stopped all being preloaded at once.

**No before-figures exist for LCP.** The measurement tool was built during this
work, so there is nothing honest to compare against. Saying "we improved LCP by
N%" would require a number nobody took.

---

## Accessibility

axe-core, WCAG 2.1 A and AA, 17 routes at 390px and 1440px.

| | Before | After |
|---|---|---|
| Violations | 3 rule families across 40+ page/width combinations | **0** |
| Pinch-zoom | `userScalable: false` — a WCAG 1.4.4 failure | Restored |
| Form labels | 14 labels on the requirement form with no `htmlFor` | All associated |
| Skip link | Present | Verified working |
| Focus indicators | — | Verified on every focusable element |

Most failures were one mistake made repeatedly rather than many separate ones:

- Four `<dl>` elements wrapped `dt`/`dd` in an `<a>` to make a row clickable
- Four colour tokens failed contrast, and because they are tokens they failed
  everywhere at once: `--ink-400` at 2.41:1, `--green-600` at 4.48:1,
  `--on-ink-muted` at 3.59:1, plus `text-slate-500` at 3.74:1 in the mockups
- Border tokens were being used as text colours — the homepage step numbers
  measured 1.43:1

---

## SEO

| | Before | After |
|---|---|---|
| Sitemap URLs | 60, generated from a static file the pages did not read | 82, generated from the live source |
| Missing from sitemap | 4 published posts, all `/solutions/*`, all demos | Resolved |
| Schema coverage | 4 of 25 routes | Every route; 16 verified to parse |
| Schema types | Organization, WebSite, ProfessionalService, BlogPosting | + Service, FAQPage, HowTo, ItemList, Offer, ProfilePage, ContactPage, Blog, BreadcrumbList, CreativeWork |
| Visible breadcrumbs | None anywhere, despite three routes emitting the schema | Rendered from the same list as the schema |
| `/get-started` metadata | **None at all** — the file was a client component from line 1 | Title, description, canonical |
| Canonical host | `lib/site.ts` and `lib/schema.ts` disagreed | One source |
| Over-length titles | 4 pages at 73–85 characters, truncated in results | Trimmed |
| IndexNow | Key file present, no code that used it | Wired to admin publishes |
| GA / Clarity / GSC | All three silently off; the variables were absent from `.env.example` | Documented; values still needed |

### A correction

An earlier note in this project claimed the production site had a "hostname
split-brain" between `skilloura.com` and `www.skilloura.com`. **That was wrong.**
Checking production directly showed the apex 308-redirects to www and the
canonical tags already pointed at www. The real problem was latent: the fallback
in `lib/site.ts` disagreed with a hardcoded value in `lib/schema.ts`, so the two
would have diverged the moment the environment variable went missing. Fixed, but
it was never live.

---

## Content

| | Before | After |
|---|---|---|
| Blog posts | 22 | 22 + 4 cluster articles *(written; SQL not yet run)* |
| Case studies | 0 | 6, with decisions and their trade-offs |
| Focus service pages | 0 | 8 |
| Testimonials | 0 | 6 seeded *(written; SQL not yet run)* |
| Fabricated proof | "Lighthouse 100", "Performance 99 / Accessibility 100", "reduces cost by 40%" | Removed |

Three of the four new cluster articles exist because a focus service page had no
supporting content at all — speed optimization, API integration and general SEO
had nothing linking into them but the navigation.

---

## Architecture

| | Before | After |
|---|---|---|
| Animation runtime | `framer-motion`, imported by `Reveal` and therefore in nearly every route (~34 kB gz) | CSS-first; one shared IntersectionObserver |
| 3D | `three`, `@react-three/fiber`, `drei`, Spline installed; **reachable from no route** | Removed (31 MB of `node_modules`) |
| Dead components | 943 lines | Removed |
| Lint | 528 warnings, hidden because a second `no-restricted-syntax` block silently replaced the first | 20 warnings, 0 errors |
| QA tooling | None | 9 scripts: regression snapshot, a11y, performance, content links, reveal, forms, screenshots, video |

### A second correction

An earlier claim in this project was that **"83 client boundaries became server
components."** The real number, counted from git, is **three**:
`Reveal.tsx`, `CountUp.tsx` and `FooterAuthLink.tsx`. Three new client
components were added (`GetStartedFlow`, `VideoStage`, `MotionProvider`), so the
total is unchanged at 55.

The underlying win was real but described wrongly: `Reveal` is used on more than
twenty pages, so making *it* a server component is what removed framer-motion
from nearly every route. One component, not eighty-three.

---

## Bugs found that had nothing to do with the redesign

These were live and silent. Each one is the same category of failure — something
that fails without producing an error.

1. **The public review form never worked.** Not the RLS policy, as first
   diagnosed: `.insert().select()` sends `Prefer: return=representation`, which
   makes PostgREST read back a `pending` row that the select policy hides. The
   whole statement fails. It explains why the testimonials table was empty.
2. **The duplicate-review check could never match.** It queried for exactly the
   pending rows that policy hides, so the friendly 409 was unreachable and a
   second submission returned "Could not save your review. Please try again." —
   inviting the user to repeat the one action that cannot work.
3. **`scoreLead()` had zero callers.** Every lead notification email rendered
   "Lead score: —".
4. **The blog renderer could not render a link.** Markdown links appeared as raw
   text in published articles.
5. **A published article links to a post that does not exist.** Found by
   `tools/qa/content-links.mjs`, which was written for this class of bug.
6. **`estimate_teaser_used` reached Vercel Analytics but not Google Analytics.**
   It called the vendor SDK directly instead of the shared `trackEvent`.
7. **`/case-studies` was a permanent 308 to `/portfolio`**, added when no such
   page existed. Never deployed, so no cached redirect to undo.
8. **`founder.png` was a 2 MB PNG of a photograph.** Re-encoded as WebP at the
   same dimensions: 104 kB, a 95% reduction with no visible difference.

---

## What is still outstanding

| | |
|---|---|
| Two `phase23_*` and one `phase24_*` SQL file | Cluster articles, testimonials and the cost-article fix are written but not live |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` | Still empty; analytics and verification remain off |
| Logo artwork | **Settled — the owner's instruction is to keep the original, unchanged.** The CSS underline, which had been recoloured to petrol/aura, is back to the artwork's own blue → violet → amber ramp, sampled from `logo-full.png`. `logo-full.png` was briefly converted to WebP for the schema reference and has been restored. |
| Real client reviews | The collection flow works; nobody has been sent a link |
| Screen-reader testing | axe catches roughly 40% of accessibility issues. Nothing here has been tested with an actual screen reader |
