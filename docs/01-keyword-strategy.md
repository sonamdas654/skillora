# Keyword strategy, page-to-keyword map and cannibalisation audit

*Written 2026-09-07. Derived from the live site, not from assumption — every
route below was crawled from the production build and its actual title, H1,
description and internal links recorded. The raw capture is `_content-map.json`
(82 indexable routes, 39,669 words of main-content copy, zero non-200s).*

---

## What this document does not contain, and why

**No search volumes.** Volume figures require a keyword tool with licensed
clickstream data. Anything written here without one would be a plausible-looking
number that nobody could check — which is the exact failure mode this rebuild
exists to correct. Where a query matters, get the volume from Google Keyword
Planner (free with any Google Ads account, no spend required) or Search Console
once impressions accumulate, and write it in.

**No difficulty scores.** Same reason.

What this document *can* do honestly is state which page owns which intent,
which pages are competing with each other, and which queries this business can
realistically win. That is the part that actually changes what gets built.

---

## 1. The strategic position

Skilloura is a founder-led studio in Odisha selling website, app, AI-automation,
design, marketing and dashboard work, largely to Indian small businesses, with
remote delivery beyond that.

This shapes everything below. The site will not outrank Wix, GoDaddy, Fiverr or
a funded agency for *"website development company"*. It can win:

1. **Local commercial queries** — "website developer in Bhubaneswar", "web
   design company Odisha". Low volume, high intent, and the competition is other
   small studios rather than national platforms.
2. **Long-tail cost and comparison queries** — "restaurant website cost in
   India", "website vs web app". The site already has eleven of these and they
   are its strongest existing asset.
3. **Industry + service combinations** — "salon booking website India", "gym
   website design". Specific enough to rank, commercial enough to convert.

The consistent principle: **specific beats broad**, because specific is winnable
and the traffic is closer to a decision.

---

## 2. Page-to-keyword map

One page owns one intent. Where two pages could plausibly answer the same query,
the owner is named and the other links to it.

### Money pages — commercial intent, these are what get sold

| Route | Primary intent it owns | Supporting cluster |
|---|---|---|
| `/services/website-development` | business website development, India | `why-cheap-and-expensive-websites-differ`, `website-development-cost-india`, `what-to-prepare-before-building-a-website` |
| `/services/ecommerce-development` | online store build for small sellers | `ecommerce-website-for-small-sellers-india`, case study *The half of an online store that costs the money* |
| `/services/web-app-development` | web application with logins and data | `website-vs-web-app` |
| `/services/website-redesign` | rebuilding an existing site | `signs-you-need-a-website-redesign`, `website-vs-instagram-page-for-business` |
| `/services/website-maintenance` | ongoing care after launch | `domain-hosting-maintenance-difference` |
| `/services/website-speed-optimization` | fixing a slow site | `why-your-website-is-slow` |
| `/services/api-integration` | connecting systems | `connect-website-to-software-you-already-use` |
| `/services/seo` | general SEO for a small business | `seo-for-small-business-india` |
| `/services/local-seo` | ranking in local/map results | `google-business-profile-setup-guide` |
| `/services/ai-automation` | AI agents, WhatsApp automation | `how-ai-automation-saves-business-time`, `whatsapp-automation-for-small-business`, `ai-chatbot-for-small-business-india` |
| `/services/mobile-app-development` | mobile app build | `mobile-app-cost-india` *(written, not yet run)* |
| `/services/data-dashboard` | dashboards and reporting | `signs-your-business-needs-a-dashboard`, case study *Decide first, then chart* |
| `/services/logo-branding` | logo and brand identity | none — **deliberate**, see §5 |
| `/services/video-editing` | video and reels editing | none — **deliberate**, see §5 |
| `/services/digital-marketing` | paid and organic marketing | `how-small-businesses-get-more-leads-online` |
| `/services/custom-software` | bespoke internal systems | `website-vs-web-app` |
| `/services/resume-career` | resume and portfolio work | `portfolio-website-for-job-seekers` |
| `/pricing` | "how much does X cost" across all services | every `*-cost-india` post |
| `/get-started` | ready-to-brief, highest commercial intent on the site | — |

### Industry pages — the "website for my kind of business" intent

| Route | Owns |
|---|---|
| `/solutions/restaurant-website` | restaurant website, menu and table booking |
| `/solutions/gym-website` | gym and fitness website, membership plans |
| `/solutions/salon-booking-website` | salon website with appointment booking |
| `/solutions/whatsapp-automation` | WhatsApp auto-reply and lead capture |

### Evidence pages — these convert, they do not need to rank

`/case-studies/*`, `/portfolio/*`, `/demo/*`, `/references`, `/about`. Their job
is to be found *from* the money pages, not from search. This matters for §3.

---

## 3. Cannibalisation audit

Computed, not eyeballed: every pair of the 82 indexable routes was compared on
the significant terms in its title, H1 and description (Jaccard similarity, stop
words removed). **15 of 3,321 pairs** score 0.30 or above.

Most of that overlap is *intended* — a cluster article is supposed to share
vocabulary with the money page it supports. That is a cluster, not
cannibalisation. Cannibalisation is two pages chasing the same **intent**.

### Genuine issues

**1. `/demo/web-education` × `/demo/web-clinic` (0.33), `/demo/web-ecommerce` ×
`/demo/web-local` (0.30)**

The demo pages share boilerplate — "live", "concept", "demo", "explore",
"working". Sixty-three demo ids map onto nine shared components by URL prefix,
so most of these pages are near-identical in what a crawler sees.

*Already handled:* `app/sitemap.ts` deliberately submits only the seven bespoke
`/demo/web-*` pages and excludes the other 56 for exactly this reason. **No
further action** — but do not "fix" the sitemap by adding them back.

**2. `whatsapp-automation-for-small-business` × `whatsapp-automation-pricing-india` (0.41)**

The highest overlap on the site, and the only pair where both pages are chasing
the same audience. The intents *are* different — one explains the capability,
one answers "what does it cost" — but the titles do not make that obvious to a
crawler or a reader.

*Action:* keep both. Make the split explicit in the titles and have each link to
the other with a descriptive anchor ("what WhatsApp automation costs" /
"what WhatsApp automation actually does"). Owner of the commercial intent is
`/services/ai-automation`; both posts should link up to it.

**3. `salon-booking-website-india` × `doctor-clinic-website-india` (0.37) and
`doctor-clinic-website-india` × `coaching-institute-website-india` (0.30)**

Different industries, shared template phrasing ("cost", "features", "booking",
"mistakes", "2026"). Not cannibalisation — they cannot rank for each other's
queries because the industry term carries the intent.

*Action:* none, but resist writing a fourth in the same template. The pattern is
already visible and more of it starts to look thin.

### Non-issues, stated so nobody "fixes" them later

`/solutions/restaurant-website` × `blog/why-every-restaurant-needs-a-website`
(0.36), `/solutions/gym-website` × `blog/gym-website-cost-india` (0.31),
`/services/local-seo` × `blog/google-business-profile-setup-guide` (0.32), and
the `/solutions/*` × `/portfolio/*-concept` pairs. **These are the cluster
working as designed** — an informational post feeding a commercial page. Merging
them would destroy the structure, not improve it.

---

## 4. Search-intent map

| Intent | What the searcher wants | Page type that wins | Where the site sends them |
|---|---|---|---|
| Informational | "what is / how does" | Article | `/blog/*` |
| Commercial investigation | "cost of / best / vs" | Comparison or pricing article | `/blog/*-cost-india`, `/pricing` |
| Transactional | "hire / company / near me" | Service or local page | `/services/*`, `/contact` |
| Navigational | "skilloura" | Home | `/` |

The one thing to check before writing any new page: **look at what actually
ranks for the query today.** If page one is all listicles, a service page will
not break in, and the right move is an article that links to the service page.
This is not optional judgement — it is the single highest-value ten minutes in
the whole process, and it is free.

---

## 5. Content gaps

Three money pages have no supporting article at all, which means nothing links
into them but the navigation:

| Page | Suggested article | Query it answers |
|---|---|---|
| `/services/mobile-app-development` | ~~"What a mobile app actually costs in India"~~ — **written**, `supabase/phase25_mobile_app_cost_article.sql`, not yet run | app development cost |
| `/services/logo-branding` | "What you get in a logo package, and what you should own" | logo design cost / deliverables |
| `/services/video-editing` | "Reels and video editing: formats, turnaround and pricing" | video editing rates |

Priority is the order above: app development carries the highest ticket value of
the three, and its article is now written.

The other two are deliberately **not** being written. `docs/03` puts logo
(₹1,800) and video (₹700) in Tier 3 — their SERPs belong to Fiverr and Canva,
and they are add-ons to a larger project rather than acquisition channels.
Writing cluster articles for them would contradict that analysis. If either
becomes a real revenue line, revisit; until then, leaving the gap is the
decision, not an oversight.

---

## 6. How to keep this current

- Re-run `node tools/qa/content-map.mjs > docs/_content-map.json` after adding
  pages, and re-check the overlap. The method is in this repo, not in someone's
  head.
- `node tools/qa/content-links.mjs` validates that every cluster link in the
  database actually resolves. It has already caught one dead link on a published
  article.
- Once Search Console has data, the real cannibalisation check is better than
  this one: look for two URLs appearing for the same query in the Performance
  report. Similarity is a proxy; impressions are evidence.
