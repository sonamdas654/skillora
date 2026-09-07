# Priority money pages

*Written 2026-09-07. Prices are read from `lib/services.ts` and
`lib/focusServices.ts` — the same source the site renders — not estimated.*

---

## How this ranking was made

Five factors, applied to every commercial page:

1. **Ticket value** — the real starting price
2. **Demand** — how many people plausibly search this
3. **Intent** — how close the searcher is to buying
4. **Winnability** — can a young studio actually rank, against who
5. **Conversion potential** — does the site have evidence for this claim

A page can be high value and still low priority if it cannot be won. Mobile app
development has the highest ticket on the site at ₹35,000 and is ranked fourth,
because the SERP for app development in India is dominated by funded agencies
and there is currently no supporting content for it at all.

---

## The ranking

### Tier 1 — build the cluster here first

**1. `/services/website-development` — from ₹7,000, 3–20 days**

Not the highest ticket, but the highest total value: it is the entry product,
it feeds every other service, and it has by far the most supporting content
already (`website-development-cost-india`, `why-cheap-and-expensive-websites-differ`,
`what-to-prepare-before-building-a-website`, plus four industry pages and three
concept builds).

*Why it wins:* the cost article already leads with a real figure, which is the
thing nobody local does.

**2. `/services/ecommerce-development` — ₹28,000–₹60,000**

High ticket, clear intent, and the strongest evidence on the site: a case study
that explains honestly why it costs three times a brochure site, plus a live
storefront demo.

*Why it wins:* "the admin panel is the actual product" is an argument no
competitor is making, and it is the argument that justifies the price.

**3. `/services/ai-automation` — from ₹7,000, 3–15 days**

Three supporting articles, a live chatbot demo, a case study, and a WhatsApp
industry page. Demand is rising and local competitors barely address it — none
of the Bhubaneswar studios examined offer it as a named service.

*Why it wins:* least contested locally, and the demo lets someone try it.

### Tier 2 — real value, needs work first

**4. `/services/mobile-app-development` — from ₹35,000, 2–8 weeks**

Highest ticket on the site. Ranked here rather than first because it has **zero
supporting articles** and the national SERP is hostile. Fix the content gap
before spending effort on the page itself.

*Next step:* write "What a mobile app actually costs in India".

**5. `/services/custom-software` — from ₹28,000, 2–8 weeks**

Second-highest ticket, longest sales cycle, and searches are vague
("software company near me"). `website-vs-web-app` supports it. Realistically
this closes through referral and conversation more than through search.

**6. `/services/local-seo`**

Small ticket but strategically important: it is the service that proves the
studio understands the thing it is selling. A studio ranking locally is its own
case study for local SEO work.

**7. `/services/website-redesign`**

Genuinely high commercial intent — someone searching this has already decided to
spend. Now supported by `signs-you-need-a-website-redesign`.

**8. `/services/website-speed-optimization`**

Narrow but very high intent, and the site can now prove capability with real
measured numbers rather than claims. Supported by `why-your-website-is-slow`.

### Tier 3 — keep, do not invest

**9. `/services/digital-marketing`** (₹5,600) — crowded, ongoing delivery burden.
**10. `/services/data-dashboard`** (₹3,500) — good case study, thin demand.
**11. `/services/logo-branding`** (₹1,800), **`/services/video-editing`** (₹700),
**`/services/resume-career`** (₹800) — low ticket, and the SERPs are owned by
Fiverr and Canva. These are add-ons to a larger project, not acquisition
channels. Keep the pages; do not build clusters for them.

---

## The two pages that matter more than any service page

**`/pricing`** — the single most differentiated page on the site. No competitor
examined publishes a figure. Every article that mentions cost should link here.

**`/get-started`** — the highest commercial intent URL there is. It had no
metadata at all until Phase 8, because the file was a client component from line
one. It now has a title, description and canonical, and it should be the
destination of every "ready to start" call to action.

---

## Where the effort goes

| Order | Work | Why now |
|---|---|---|
| 1 | Run `supabase/phase24_cost_articles_answer_first.sql` | Two cost articles do not state a price in their opening; the price is the differentiator |
| 2 | Run the two `phase23_*` files | Four cluster articles and the testimonials are written but not live |
| 3 | Write the mobile app cost article | Unlocks the highest-ticket page on the site |
| 4 | Google Business Profile work — see `04-local-presence.md` | Highest return per hour available, and free |
| 5 | Collect three real reviews | Turns the one trust gap into an advantage |

Note what is not on this list: building more service pages. There are seventeen
already and three of them have no supporting content. Depth before breadth.
