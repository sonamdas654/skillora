export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  date: string;
  readMinutes: number;
  category: string;
  // Markdown-ish: paragraphs split by \n\n, lines starting with "## " are headings,
  // lines starting with "- " are list items.
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-every-restaurant-needs-a-website",
    title: "Why Every Restaurant Needs a Website (Not Just a Zomato Listing)",
    metaDescription:
      "A restaurant website with menu, WhatsApp ordering and Google Maps brings direct orders without commission. Here's what it needs and what it costs.",
    date: "2026-06-20",
    readMinutes: 5,
    category: "Website Development",
    content: `Every order through a food aggregator costs you 18–30% commission. Your own website costs a one-time fee and every order through it is commission-free. That's the simple math — but the benefits go further.

## What a restaurant website actually does

- Shows your full menu with photos — customers decide before they call
- WhatsApp order button — direct orders with zero commission
- Google Maps integration — walk-in customers find you easily
- Table booking — no more missed calls during rush hours
- Gallery — your ambience sells the experience before the food

## What it needs to include

A restaurant website is not a generic template. It needs a menu page that's easy to update, opening hours that are accurate, and a mobile experience that works — because 90%+ of your visitors will be on phones.

## What it costs

A professional restaurant website with menu, gallery, Maps, contact and WhatsApp ordering usually starts around ₹12,600 with Skilloura. Add online ordering, payment gateway or booking and it moves toward ₹24,500+ depending on scope. Compare that to one month of aggregator commissions for a busy restaurant.

## The bottom line

Aggregators are for discovery. Your website is for profit. Smart restaurants use both — but they own their customer relationship through their own site.`,
  },
  {
    slug: "how-small-businesses-get-more-leads-online",
    title: "How Small Businesses Can Get More Leads Online (Without Big Budgets)",
    metaDescription:
      "Practical lead generation for small businesses: Google Business Profile, a lead-focused website, WhatsApp automation and local SEO — in the right order.",
    date: "2026-06-12",
    readMinutes: 6,
    category: "Digital Marketing",
    content: `Most small businesses think online leads need big ad budgets. Wrong order. Ads amplify what already works — and most businesses haven't built the free foundation first.

## Step 1: Google Business Profile (free)

When someone searches "salon near me", Google shows local businesses first. A complete profile with photos, hours, services and reviews gets you into that list. This is free and takes one afternoon to set up properly.

## Step 2: A website built for leads

A lead-generation website has one job: make contact easy. That means a WhatsApp button on every page, a short contact form, your phone number visible, and pages that answer what customers actually search for.

## Step 3: WhatsApp as your sales channel

Indian customers prefer WhatsApp over email — it's not close. A wa.me link with a pre-filled message removes all friction: one tap and they're talking to you.

## Step 4: Then consider ads

Once your profile and website convert visitors into inquiries, ads become profitable. ₹5,000–10,000/month on locally-targeted Google or Meta ads can generate consistent leads — because now every click lands somewhere designed to convert.

## The order matters

Profile → website → WhatsApp flow → ads. Businesses that run ads without the first three steps pay for clicks that never become customers.`,
  },
  {
    slug: "website-vs-instagram-page-for-business",
    title: "Website vs Instagram Page: What Does Your Business Actually Need?",
    metaDescription:
      "Instagram builds audience, a website builds trust and converts. Why serious businesses need both — and which one to invest in first.",
    date: "2026-06-05",
    readMinutes: 4,
    category: "Website Development",
    content: `"I have Instagram, why do I need a website?" — the most common question from small business owners. Here's the honest answer.

## What Instagram does well

Discovery and engagement. Reels reach new people, stories keep existing followers warm, DMs start conversations. For visual businesses — food, fashion, salons — Instagram is a genuine growth engine.

## What Instagram cannot do

- Rank on Google when someone searches "best coaching center in [your city]"
- Show your full service list, pricing and FAQs in an organized way
- Look credible to a 45-year-old customer comparing three businesses
- Belong to you — algorithm changes and account bans are real risks

## What a website does

A website is your business's permanent address on the internet. It ranks on Google, presents your services professionally, captures leads through forms, and works 24/7 even when you're not posting.

## The credibility test

When a serious customer wants to spend serious money, they Google you. If nothing comes up but an Instagram page, a percentage of them quietly choose your competitor who has a professional site. You never see these lost customers — that's what makes it dangerous.

## Verdict

Instagram for reach, website for trust and conversion. If budget forces a choice: businesses selling low-cost visual products can start with Instagram; service businesses, clinics, coaching and anything high-value should get the website first.`,
  },
  {
    slug: "how-ai-automation-saves-business-time",
    title: "How AI Automation Saves Small Businesses 10+ Hours Every Week",
    metaDescription:
      "Real examples of AI and workflow automation for small businesses: WhatsApp auto-replies, lead follow-up, Excel reports and invoice processing.",
    date: "2026-05-28",
    readMinutes: 6,
    category: "AI & Automation",
    content: `Automation used to be for big companies with IT departments. Not anymore. Here are real automation examples that work for small businesses today.

## Customer questions on WhatsApp

An AI chatbot trained on your business FAQs answers "what are your prices?", "are you open today?", "where are you located?" instantly, 24/7. Complex questions get handed to you. Result: no lost leads at midnight, no repeating yourself 50 times a day.

## Lead follow-up

A lead that isn't contacted within an hour goes cold. Automation sends an instant acknowledgment, notifies you, and reminds you if you haven't followed up in 24 hours. Nothing falls through the cracks.

## Excel and reporting drudgery

If someone in your business spends hours every week copying data between sheets, formatting reports or matching entries — that's automatable. A script or workflow does the same job in seconds, without errors.

## Invoice and document processing

Automation can read incoming PDFs, extract details into your records and flag mismatches — turning an afternoon of data entry into a coffee break.

## What it costs

A simple sheet/workflow automation can start around ₹7,000 with Skilloura, while broader chatbot or business automation usually starts around ₹12,600–₹14,000+. Some automations have monthly tool/API costs, always disclosed separately before work starts. Against 10 hours saved weekly, it can still pay for itself quickly.

## Where to start

Pick the task you hate most. If it's repetitive and happens on a screen, it can probably be automated.`,
  },
  {
    slug: "website-development-cost-india",
    title: "Website Development Cost in India (2026): Honest Price Breakdown",
    metaDescription:
      "What websites really cost in India in 2026: transparent guide prices by type, what affects scope, and what to avoid before you pay.",
    date: "2026-05-15",
    readMinutes: 7,
    category: "Website Development",
    content: `Website prices in India range from roughly ₹10,000 to ₹3,00,000+ for serious professional work — and the confusion is intentional. Skilloura keeps pricing transparent: a clear guide price by project type, then a written quotation once your exact scope is known — so you can budget with context instead of guessing.

## The real price tiers (Skilloura guide prices)

- Basic/landing website (1–3 pages): around ₹7,000–₹12,600. Contact form, WhatsApp button and mobile responsive layout.
- Business website (5–8 pages): around ₹12,600–₹24,500. Services pages, gallery, Google Maps and basic SEO.
- Premium/ecommerce: around ₹24,500–₹49,000+. Product catalog, admin panel, payment gateway, booking or ordering systems.
- Custom web application: around ₹42,000+. Dashboards, user logins, complex logic — priced by selected scope.

## Recurring costs nobody mentions

- Domain: ₹800–1,200/year
- Hosting: ₹2,000–5,000/year for most business sites
- Maintenance: optional but wise, Skilloura care plans from ₹1,999/month

## What makes prices vary

Number of pages, custom design vs template, admin panel, integrations (payment, booking, CRM), content creation and timeline urgency. A quote without a written scope is a guess — and usually changes later.

## Red flags when comparing quotes

- "Free domain and hosting forever" — nothing is forever; check whose name it's registered in
- No written scope — the #1 cause of fights and half-finished projects
- Prices too good to be true — usually a template with your logo slapped on

## How to budget

Decide what the website must DO (get calls? take orders? build trust?), list must-have features, and get a written quotation. Paying the right amount for a site that brings customers beats paying a low amount for a site that does not work.`,
  },
  {
    slug: "what-to-prepare-before-building-a-website",
    title: "What to Prepare Before Building a Website (Save Time & Money)",
    metaDescription:
      "A practical checklist of what to prepare before hiring a website developer: content, images, logo, domain access and reference sites.",
    date: "2026-05-02",
    readMinutes: 5,
    category: "Guides",
    content: `The #1 cause of delayed website projects isn't the developer — it's missing content. Projects that should take a week stretch to a month waiting for text and photos. Here's what to prepare.

## The essential checklist

- Business details: exact name, address, phone, email, opening hours, social links
- Logo: original file if you have one (PNG with transparent background, or the source file)
- Text content: what you do, your services, about section — rough notes are fine, polishing can be done for you
- Photos: real photos of your shop/work/team beat stock photos for trust
- Reference websites: 2–3 sites you like, and what you like about them

## Access you'll need to find

If you already have a domain or hosting, find the login details before the project starts. Old domains registered by a previous developer who disappeared is a painfully common problem — sort it early.

## Decisions to make upfront

- What's the ONE main action visitors should take? (call, WhatsApp, order, book)
- Which pages do you need at launch vs later?
- Who updates content after launch — you (needs admin panel) or the developer (maintenance plan)?

## What NOT to worry about

Design details, colors and technical choices — that's what you're hiring a professional for. Describe your business and customers; let the developer translate that into design.

## The payoff

Clients who share complete content upfront get their websites 2–3x faster, with fewer revisions and no scope arguments. One organized afternoon saves weeks.`,
  },
  {
    slug: "whatsapp-automation-for-small-business",
    title: "WhatsApp Automation for Small Business: What It Can Actually Do in 2026",
    metaDescription:
      "Auto-replies, order updates, booking confirmations and lead follow-ups on WhatsApp — what automation really does for Indian small businesses, and what it costs.",
    date: "2026-07-09",
    readMinutes: 6,
    category: "AI & Automation",
    content: `Your customers are already on WhatsApp — that part needs no convincing. The question is whether you should keep answering every message manually. For most small businesses, the honest answer is no: 70–80% of incoming messages are the same five questions, and automation handles those perfectly.

## What WhatsApp automation actually does

- Instant replies to common questions — timings, prices, location, availability — even at 2 AM
- Order and booking confirmations sent automatically, with reminders before appointments
- New lead capture — every enquiry saved with name and number, nothing lost in chat history
- Follow-up messages for quotes you sent last week (this alone recovers real revenue)
- Catalog sharing — send your product list or price menu with one tap

## What it can't do

Automation doesn't close deals or handle angry customers — humans do. The right setup answers the repetitive 80% instantly and hands the important 20% to you with full context. Anyone promising a "fully automatic business" is selling you a disappointment.

## Real examples by business type

- Salon: booking requests get slot options automatically; day-before reminders reduce no-shows
- Restaurant: menu link and order instructions sent instantly; regulars get updates about specials
- Coaching centre: batch timings, fee structure and demo class booking — answered without lifting a finger
- Retail shop: "Is this available?" gets a catalog link; new arrivals go to interested customers

## What it costs

Simple auto-reply and lead-capture setups start around ₹7,000 with Skilloura. Deeper flows — order updates, payment reminders, AI-powered replies that understand free-form questions — range ₹14,000–₹35,000 depending on scope. WhatsApp Business API fees, where required, are third-party costs and always listed separately in your quote.

## Where to start

Don't automate everything on day one. Start with auto-replies for your five most common questions plus lead capture. Measure for a month, then extend to whatever eats the most of your time. That's the order that pays for itself fastest.`,
  },
  {
    slug: "signs-your-business-needs-a-dashboard",
    title: "5 Signs Your Business Has Outgrown Excel (And Needs a Dashboard)",
    metaDescription:
      "Manual reports every Monday, numbers that don't match, decisions made on gut feel — when a Power BI dashboard pays for itself, and what it costs in India.",
    date: "2026-07-09",
    readMinutes: 5,
    category: "Data & Dashboards",
    content: `Excel is brilliant — until your business grows past it. Most owners don't notice the crossover point because the pain arrives slowly: reports take a little longer each month, numbers disagree a little more often. Here are the five signs it's time.

## 1. Someone spends hours every week making the same report

If a person copies data from multiple files every Monday to build the same summary, you're paying a salary for work a dashboard does automatically. The report that takes three hours should take zero — refreshed every morning before you open the office.

## 2. Two reports show two different numbers

Sales says one figure, accounts says another, and the truth is a third number nobody has. This happens when data lives in disconnected files with manual copy-paste in between. A dashboard pulls from the source systems directly — one number, one truth.

## 3. You find out about problems weeks late

Stock that ran out, an invoice that's 45 days overdue, a branch whose sales quietly dropped — Excel tells you at month-end, if someone builds the report. A dashboard shows it the day it happens, with alerts for the things you can't afford to miss.

## 4. Decisions are made on gut feel

Which product actually makes you the most margin? Which marketing channel brings buyers, not just clicks? If the answer is "I think..." rather than "I know", the data exists — it's just not visible. Seeing it changes what you decide.

## 5. Your team asks you for numbers instead of acting on them

When every question needs the owner to dig through files, the owner becomes the bottleneck. A shared dashboard with the right access lets managers see their own numbers and act — while you see everything.

## What a dashboard costs

A single-purpose Power BI dashboard (sales, inventory or cashflow) starts around ₹10,500 with Skilloura. Multi-source executive dashboards with automated refresh land between ₹21,000–₹42,000 depending on how many systems feed them. Compare that with the monthly hours currently spent building reports by hand — most dashboards pay for themselves inside a quarter.

## The honest caveat

A dashboard is only as good as the data feeding it. If your sales live in a notebook, start by digitizing the source (a simple billing system or even a structured sheet) — then the dashboard becomes genuinely powerful.`,
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
