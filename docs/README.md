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

## What still needs a person

Nothing in this repository can do these, and until they happen most of the above
is theoretical.

1. ~~Run the pending SQL~~ — **done 2026-09-07.** All three migrations are
   applied; the files are marked APPLIED at the top. Blog 22 → 26 posts, six
   testimonials live, both cost articles now open with a price.
2. **Fix four fields on the Google Business Profile.** The listing is claimed
   and verified under `sonamdasdj@gmail.com`. What is wrong: hours say the
   business is **closed**, there is no phone number, no photos, and the category
   is *Marketing agency* rather than *Website Designer*. The hours are the one
   doing active damage. See [local presence](04-local-presence.md).
3. **Mark conversions in Google Analytics.** The property is live in
   `mailedago@gmail.com` and receiving traffic, but Key events = 0, so nothing
   reports whether the site produces business. Also link Google Ads account
   879-036-3243 — it is unlinked while `google/cpc` traffic arrives. Optional:
   create a Clarity project and set `NEXT_PUBLIC_CLARITY_ID`, the one variable
   genuinely unset.
4. **Send three review links** to real clients through `/review/<token>`. Three
   genuine reviews turn on the `AggregateRating` structured data automatically;
   the seeded testimonials deliberately never will.
