# Strategy documents

The parts of the SEO brief that live outside the codebase. Written 2026-09-07.

Everything here is grounded in something checkable — the live site was crawled,
the competitors were actually read, the prices come from `lib/services.ts`. Where
a figure could not be verified without a tool this project does not have (search
volumes, keyword difficulty), it is **absent and said to be absent** rather than
estimated. A plausible number nobody can check is the failure mode this whole
rebuild exists to correct.

| | Document | What it answers |
|---|---|---|
| 01 | [Keyword strategy](01-keyword-strategy.md) | Which page owns which intent, and which pages compete with each other |
| 02 | [Competitor gap report](02-competitor-gap-report.md) | Who actually ranks, what they do and do not show, where the real gaps are |
| 03 | [Priority money pages](03-priority-money-pages.md) | Where effort goes first, and why the highest-ticket page is not first |
| 04 | [Local presence](04-local-presence.md) | Google Business Profile audit and the citations worth having |
| 05 | [Search Console and analytics](05-search-console-and-analytics.md) | Setup, the events that actually fire, and what is missing |
| 06 | [Authority plan](06-authority-plan.md) | Links this business can earn, and what to never do |
| 07 | [Before and after](07-before-after-audit.md) | What changed, measured — including two corrections to earlier claims |

`_content-map.json` is the raw crawl the analysis in 01 was computed from: every
indexable route with its title, description, canonical, headings, word count and
internal links. Regenerate it with:

```bash
node tools/qa/content-map.mjs > docs/_content-map.json
```

## The four things a person has to do

Nothing in this repository can do these, and until they happen most of the above
is theoretical.

1. **Run the pending SQL** — `supabase/phase23_testimonial_seed.sql`,
   `phase23_cluster_articles.sql`, `phase24_cost_articles_answer_first.sql`.
   Four articles, six testimonials and the cost-article fix are written and not
   live.
2. **Set the three analytics variables** and redeploy. Until then there is no
   data, and no data looks exactly like no traffic.
3. **Audit the Google Business Profile.** It already exists. It is the highest
   return per hour available anywhere in this list, and it costs nothing.
4. **Send three review links** to real clients through `/review/<token>`. Three
   genuine reviews turn on the `AggregateRating` structured data automatically;
   the seeded testimonials deliberately never will.
