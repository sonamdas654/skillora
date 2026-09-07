# Search Console and analytics setup

*Written 2026-09-07. The event list is read from the codebase, not from memory —
every event below was located at a specific line and verified to fire.*

---

## The situation right now

**Corrected 2026-09-07.** An earlier version of this document said all three of
these were silently off in production. That was wrong, and it was wrong in an
instructive way: it was written from the local `.env` and `.env.example`, which
are the sandbox environment, without checking the live site. The same mistake
was made once before in this project, about the canonical hostname. Checking
production takes one command.

What `curl https://www.skilloura.com/` actually returns:

| | Live? | Detail |
|---|---|---|
| Google Analytics | **Yes** | gtag is loaded with `G-MG1D7H2P6R` |
| Search Console verification | **Yes** | the `google-site-verification` meta tag is present |
| Microsoft Clarity | **No** | no `clarity.ms` script anywhere on the page |

Vercel has held all three variables since 14 July, and the live production
deployment (`cc858e8` on `main`, 23 August) is newer than that — so GA and the
verification tag are baked in and working. Clarity's variable exists but is
empty, which is why `components/SiteAnalytics.tsx` renders nothing for it.

**One trap worth knowing about.** There are two GA4 properties in the same
Google account. The one that opens by default is called *Nigam Hotel Web*
(`G-4PYH2DRFKG`) — a different project entirely, which is why it reports "no
data received from your website yet". Skilloura's data goes to
`G-MG1D7H2P6R`. Putting the wrong one in the environment would point the site
at an empty property and cut the history, and the empty property's own warning
message makes that an easy mistake to make.

**Which account owns it is now the open question.** Two Google accounts on this
machine were checked on 2026-09-07:

- `sonamdasdj00@gmail.com` — one Analytics account (`shopwithdas.store`), no
  Search Console property, no Business Profile
- `erfgfffehfif37ajaabj@gmail.com` — the *Nigam Hotel Web* property, no Search
  Console property, one unverified Business Profile called *sdquick*

Neither holds `G-MG1D7H2P6R`, and neither holds a Search Console property.
- `sonamdasdj@gmail.com` — owns the **Skilloura Business Profile**, but has no
  Analytics account at all (Google offers the "start measuring" setup screen)

The owner confirms he has never opened Google Analytics. So `G-MG1D7H2P6R` was
created by somebody else and entered into Vercel on 14 July, and the site's
visitor data has been going to a property the business does not control.

That is the thing to settle, and it is a decision rather than a task: recover
access to that property, or create one in an account the business owns and
repoint `NEXT_PUBLIC_GA_ID`. Repointing loses the history to date — a real cost,
but smaller than leaving the data somewhere unaccounted for.

**So the remaining work here is smaller than it looked:**

1. **Clarity** — the variable is empty because there is no Clarity project yet.
   Creating one needs a sign-in that only the owner can do.
2. **Search Console** — the verification tag is live, but the signed-in Google
   account shows the "add a website" welcome screen, meaning it holds no
   property. Either the property lives in another Google account, or it was
   verified once and removed. Worth checking which, because without a property
   nobody is reading the coverage and query data even though the site is
   verifiable.

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

Revised after checking production rather than the local files.

1. **Find which Google account holds the Search Console property**, or add one.
   The site is already verifiable — the meta tag is live — so this is minutes,
   not a setup project.
2. **Submit the sitemap** (`https://www.skilloura.com/sitemap.xml`, 86 URLs) and
   URL-inspect `/`, `/pricing`, `/services/website-development`, `/get-started`.
3. **Mark the three conversions in GA4** on property `G-MG1D7H2P6R` — not on
   *Nigam Hotel Web*, which is a different site.
4. **Create a Clarity project** and set `NEXT_PUBLIC_CLARITY_ID` in Vercel. This
   is the only variable genuinely missing.
5. **Add the `/get-started` funnel events.** Still the most valuable thing
   analytics could tell this business and still absent.
6. Come back in 28 days, when Search Console field data exists.
