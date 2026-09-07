# Google Business Profile and local citations

*Written 2026-09-07. All business details below are read from `lib/site.ts`,
which is the single source the site itself renders from. Keep them identical
everywhere — that consistency is the whole mechanism.*

---

## The canonical business record

Copy these exactly. Every listing, every directory, every profile.

| Field | Value |
|---|---|
| Name | **Skilloura** |
| Website | **https://www.skilloura.com** (www — the apex 308-redirects to it) |
| Email | **contact@skilloura.com** |
| Phone / WhatsApp | **+91 63701 33101** |
| Hours | **Mon–Sat, 10:00–19:00 IST** |
| Service area | **Odisha, India** — remote across India and worldwide |
| Founded | see `/about` |
| Founder | Sonam Das |

**Do not vary any of these.** Not "Skilloura Digital", not "Skilloura Pvt Ltd",
not the non-www domain, not a second phone number. Google matches businesses
across the web by exactly these strings, and every variation splits the signal.
A single inconsistent phone number across a dozen directories is one of the most
common reasons a local business underperforms in map results.

---

## Part 1 — Google Business Profile

**A profile already exists.** `lib/site.ts` carries a working review link
(`googleReviewUrl`), which is only issued for a live profile. So this is an
optimisation job, not a setup job — and that is good, because the profile is
almost certainly the highest-return asset available and it costs nothing.

For a business with no public street address, this is a **service-area
business**: the address stays hidden and the service area is declared instead.
Do not publish a home address to get a pin.

### The audit, in order

**1. Categories.** The single most influential field on the whole profile.

- Primary: **Website Designer** — this is what most local searchers type
- Secondary, add all that genuinely apply: Software Company, Internet Marketing
  Service, Graphic Designer, Marketing Agency

Do not add categories for work you would not actually take. A wrong category
brings enquiries you cannot serve and dilutes relevance for the ones you can.

**2. Service area.** Declare Odisha, and name the cities where you actually want
work — Bhubaneswar, Cuttack, Puri, Rourkela, Berhampur. Do not declare all of
India: an over-broad service area weakens relevance for every part of it.

**3. Services.** Add each one as a named service with its own description, and
use the same names as `/services`. All nine categories plus the eight focus
services. This is free keyword surface that most profiles leave empty.

**4. Description.** 750 characters. Lead with what you do and where, not with
adjectives. The positioning line in `lib/site.ts` is the right starting point.
Mention the written scope before payment — it is the differentiator and it reads
as concrete rather than promotional.

**5. Photos.** The most-neglected and most-visible part.

- Real photographs of real work: screens from the concept builds, the actual
  quotation and handover documents, the workspace
- The founder photo — already on the site
- **No stock imagery.** It is recognisable and it undermines everything else
- Add something monthly. Profiles with recent photos are visibly more active

**6. Hours.** Mon–Sat 10:00–19:00. Set holiday hours in advance. Wrong hours
generate genuinely angry reviews, which is a worse outcome than being closed.

**7. Products.** Add the packages from `/pricing` with their real prices. Almost
no competitor does this, and it means someone can see a figure before clicking.

**8. Messaging.** Enable it only if you will answer within a few hours. Google
surfaces response rate, and a slow one is worse than the feature being off.

**9. Q&A.** You can post questions yourself and answer them. Seed the real ones:
what a website costs, how long it takes, what happens before payment. Left empty,
strangers will answer for you.

### Reviews — the highest-value ongoing work

The site already has a working review-collection flow at `/review/<token>`:
generate a personal link, the client submits, an admin approves, it appears on
the homepage.

- Ask every satisfied client, at handover, while the goodwill is fresh
- Send the link personally, not in a bulk mail
- **Never offer anything in exchange.** It violates Google's policy and the
  reviews get removed
- Reply to every review, including the unhappy ones — the reply is written for
  everyone who reads it afterwards, not for the reviewer
- Three genuine reviews turn on the `AggregateRating` structured data
  automatically (see `lib/schema.ts`); seeded testimonials deliberately never do

### Posts

One a month is enough: a finished project, a new service, a useful answer. Posts
are a freshness signal and they occupy space in your own branded results.

---

## Part 2 — Citations

A citation is any mention of the business name, phone and website. They work by
corroboration: many sources saying the same thing raises confidence.

**Quality over quantity, without exception.** Hundreds of automated listings on
low-quality directories do nothing at best. The list below is short on purpose.

### Tier 1 — do these

| Where | Why |
|---|---|
| **Google Business Profile** | Covered above. Nothing else comes close |
| **Bing Places** | Small but free, and it feeds other surfaces |
| **JustDial** | The default local directory in India; people genuinely search it |
| **IndiaMART** | Strong for B2B enquiries |
| **Sulekha** | Real traffic for local services |
| **Facebook Page** | Often outranks the site for brand queries |
| **LinkedIn Company Page** | Matters for the B2B half of this business |
| **Instagram Business** | Where this audience actually is |

### Tier 2 — worth doing

| Where | Why |
|---|---|
| **Clutch / GoodFirms / DesignRush** | Agency directories; free listings, and buyers comparing studios use them |
| **Odisha or Bhubaneswar chamber of commerce** | Genuine local relevance, and a real link |
| **GitHub organisation profile** | Credible for a technical studio; the repo is already public |

### Never

Paid link packages, bulk directory submission services, anything promising "500
citations for ₹X". These range from useless to actively harmful, and undoing
them is far more work than never doing them.

### Consistency check

Every three months: search `"Skilloura"` and check that every listing that comes
back carries the details in the table at the top of this document. Fix the ones
that drift. This is boring and it is most of what citation work actually is.

---

## What to expect

Google Business Profile changes can show effect in **weeks**. Citations are
slower and their job is corroboration rather than ranking on their own. Neither
is a substitute for the site being good — they are how a good site gets found by
people nearby.
