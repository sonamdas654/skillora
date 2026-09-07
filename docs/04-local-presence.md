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

### What is actually there — audited 2026-09-07, not assumed

An earlier version of this document said "a profile already exists, so this is
an optimisation job, not a setup job", on the strength of `googleReviewUrl`
being present in `lib/site.ts`. That was inference from code again. Here is what
looking actually found.

**Who owns what — established 2026-09-07 by checking each account.**

| Account | Business Profile | Search Console | Analytics |
|---|---|---|---|
| **`sonamdasdj@gmail.com`** | **Skilloura** — claimed, verified, "You manage this profile" | — | none at all |
| `sonamdasdj00@gmail.com` | none | none | one, `shopwithdas.store` |
| `erfgfffehfif37ajaabj@gmail.com` | **sdquick** — unverified, not publicly visible | none | *Nigam Hotel Web* |

**Correction to an earlier version of this document.** It said the Skilloura
listing was "probably unclaimed" because Maps was offering "Suggest an edit".
That was wrong, and the reason is worth remembering: Maps shows the public view
when you are signed in as an account that does not manage the listing. Checked
from `sonamdasdj@gmail.com`, Google says plainly *"You manage this profile"*.
It also corrects the map-pin note — the registered address is
**8RRX+HJJ Rokat, Bhubaneswar, Odisha 751031**, and the coordinates read
earlier were the map viewport, not the place.

**What is still genuinely wrong with the listing**, as it appears publicly:

| Field | What Google shows | Should be |
|---|---|---|
| Category | **Marketing agency** | Website Designer, with Marketing agency secondary |
| Phone | **missing** | +91 63701 33101 |
| Photos | **none** | see the photo plan below |
| Hours | **"Closed · Opens 7 am Tue"** | Mon–Sat 10:00–19:00 per `lib/site.ts` |
| Reviews | none | — |

The hours are the item to fix first: the profile currently tells every person
who looks it up that the business is closed.

**Separately: the two things nobody owns.**

- **Search Console** — no property in any of the three accounts, even though the
  verification meta tag is live on the site. The site is verifiable in minutes;
  nobody is reading its search data.
- **Google Analytics** — the live site reports into `G-MG1D7H2P6R`, and that
  property is in none of the three. The owner states they have never opened
  Analytics. Somebody put that ID into Vercel on 14 July; whoever did owns the
  property, and Skilloura's visitor data has been going there ever since.
  Worth resolving deliberately: either recover access, or create a property in
  an account the business controls and repoint `NEXT_PUBLIC_GA_ID`. Repointing
  starts the history over, which is a real cost but a smaller one than data
  going somewhere unaccounted for.

### Fix these first, in this order

1. **Establish who owns the Skilloura listing** and claim it if it is unclaimed.
   Nothing else on this page is possible until someone can edit it.
2. **Correct the hours.** It currently says closed.
3. **Add the phone number.**
4. **Check the map pin.** 21.07 N, 82.75 E is not Bhubaneswar. If this is a
   service-area business with a hidden address, set the service area properly
   instead of leaving a pin in the wrong district.
5. **Change the primary category** from Marketing agency to Website Designer,
   and keep Marketing agency as a secondary.
6. **Add photos.** There are none at all.
7. **Resolve the sdquick profile** one way or the other.

### The rest of the audit

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
