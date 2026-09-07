# Search Console and analytics setup

*Written 2026-09-07. The event list is read from the codebase, not from memory —
every event below was located at a specific line and verified to fire.*

---

## The situation right now

Three environment variables are **empty**, and every one of them fails silently:

| Variable | What is off | Where the check is |
|---|---|---|
| `NEXT_PUBLIC_GSC_VERIFICATION` | No verification meta tag is emitted | `app/layout.tsx` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics never loads | `components/SiteAnalytics.tsx:41` |
| `NEXT_PUBLIC_CLARITY_ID` | Clarity never loads | `components/SiteAnalytics.tsx:50` |

This is the pattern worth understanding: the code checks whether the value
exists and does nothing when it does not. Absent is indistinguishable from
"deliberately disabled", so nothing ever reported a problem. The site has been
running with no analytics and no Search Console verification, and the only
symptom was an absence of data — which looks exactly like an absence of traffic.

They are all documented in `.env.example` now. They still need real values.

---

## Part 1 — Google Search Console

### Verification

Two options, in order of preference:

**Domain property (recommended).** Add a TXT record at the DNS provider. Covers
every subdomain and both http and https in one property, and cannot be broken by
a deploy. Requires DNS access.

**HTML tag.** Put the token in `NEXT_PUBLIC_GSC_VERIFICATION` and redeploy;
`app/layout.tsx` emits the meta tag. Simpler, but it only covers the exact
origin and it disappears if the variable is ever lost.

If you take the domain property, verify **`skilloura.com`**, not the www host —
a domain property covers both, and www is where the canonical lives.

### Immediately after verifying

1. **Submit the sitemap**: `https://www.skilloura.com/sitemap.xml`. It is
   generated from the live Supabase content, so it stays current on its own.
2. **Check coverage after a week.** The number that matters is indexed pages
   against submitted. Investigate exclusions rather than assuming they are fine.
3. **URL-inspect the money pages** — `/`, `/pricing`, `/services/website-development`,
   `/get-started`. Request indexing for each. This is the fastest route in for a
   new property.
4. **Confirm mobile usability and Core Web Vitals** appear. Field data takes
   about 28 days to accumulate; the lab numbers in `tools/qa/measurements.json`
   are a stand-in until then, not a substitute.

### The monthly check

- **Performance → Queries.** What you actually rank for is almost never what you
  expected. Let it correct `docs/01-keyword-strategy.md`.
- **Two URLs on one query** — that is the real cannibalisation signal. The
  similarity analysis in that document is a proxy; this is evidence.
- **Position 8–20 queries.** These are the winnable ones. Improving a page that
  already ranks 11th beats writing a new page that ranks nowhere.
- **Coverage errors**, immediately, every time.

### IndexNow

Already wired. `lib/indexnow.ts` submits changed URLs to Bing and Yandex
whenever an admin publishes, via `app/api/revalidate`. The key file has been in
`public/` since before this rebuild with no code that used it. Nothing to
configure. Note it does nothing for Google, which does not participate.

---

## Part 2 — Google Analytics 4

Create a GA4 property, take the measurement ID (`G-XXXXXXXXXX`), set
`NEXT_PUBLIC_GA_ID`, redeploy. `SiteAnalytics.tsx` loads gtag only when that is
present.

### The events that actually fire

Verified in the code, with locations:

| Event | Fires when | Where |
|---|---|---|
| `pricing_package_click` | A package card is clicked | `data-track` in `components/Cards.tsx` |
| `portfolio_cta_click` | A portfolio call to action is clicked | `data-track` in `components/Cards.tsx` |
| `service_detail_click` | A service card is opened | `data-track` in `components/Cards.tsx` |
| `whatsapp_click` | Any `wa.me` link is clicked, anywhere | Auto-detected, `SiteAnalytics.tsx:31` |
| `contact_form_submit` | The contact form submits | `components/ContactForm.tsx:22` |
| `estimate_teaser_used` | The estimator is touched | `components/EstimateTeaser.tsx:46` |

Two things about this list are worth knowing.

**`whatsapp_click` is inferred from the href, not from an attribute.** Any
WhatsApp link anywhere is tracked automatically — but the click handler uses
`closest("a,button")`, so **a call to action that becomes a `<div>` stops being
tracked, silently**. `tools/qa/snapshot.mjs` asserts the exact set of
`data-track` values and every `wa.me` href with its host element's tag name, on
all 32 routes, precisely so this cannot happen unnoticed.

**`estimate_teaser_used` was reaching Vercel Analytics but not GA.** It called
the Vercel SDK directly rather than going through `lib/track.ts`, which is what
fires to both. Fixed — but it is the reason to route every new event through
`trackEvent()` and never through a vendor SDK directly.

### Mark these as conversions in GA4

`contact_form_submit`, `whatsapp_click`, `pricing_package_click`. Marking a
conversion is what makes it usable in reports and comparisons.

### What is missing, and worth adding

The `/get-started` flow — the highest-intent path on the site — fires nothing.
Worth adding: step 1 completed, step 2 completed, submitted. Without those there
is no way to see where people abandon the form, which is the single most
valuable thing analytics could tell this business.

---

## Part 3 — Microsoft Clarity

Free, unlimited, and it answers a different question than GA4: not *how many*
but *what happened*. Session recordings and heatmaps show you the rage-clicks
and the dead scrolls.

Set `NEXT_PUBLIC_CLARITY_ID`. Genuinely worth it for a site with a multi-step
form.

---

## Part 4 — Vercel Analytics

Already running via `@vercel/analytics`, no configuration needed. Locally it
404s on `/_vercel/insights/script.js`, which is expected and only happens off
Vercel — `tools/qa/snapshot.mjs` filters it so it does not drown out real console
errors.

---

## Order of work

1. Verify Search Console (domain property if DNS is available)
2. Submit the sitemap, URL-inspect the four money pages
3. Set `NEXT_PUBLIC_GA_ID`, redeploy, confirm events arrive in GA4 Realtime
4. Mark the three conversions
5. Set `NEXT_PUBLIC_CLARITY_ID`
6. Add the `/get-started` funnel events
7. Come back in 28 days, when field data exists
