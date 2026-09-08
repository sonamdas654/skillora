-- APPLIED to production on 2026-09-08. The leading delete makes it idempotent.
-- =====================================================================
-- Skilloura — the cluster article for /services/mobile-app-development.
--
-- WHY THIS ONE AND NOT THE OTHER TWO
--
-- docs/01-keyword-strategy.md §5 names three money pages with no supporting
-- article at all: mobile-app-development, logo-branding and video-editing.
-- Only this one gets written, and that is deliberate — docs/03 puts logo
-- (₹1,800) and video (₹700) in Tier 3, "keep, do not invest", because their
-- SERPs belong to Fiverr and Canva and they are add-ons to a larger project
-- rather than acquisition channels. Writing articles for them would contradict
-- the analysis two documents earlier.
--
-- Mobile app development is the highest-ticket page on the site at ₹35,000 and
-- has nothing linking into it but the navigation.
--
-- Prices and timeline are read from lib/services.ts, not invented:
--   startingPrice ₹35,000 · timeline 2–8 weeks
--   Starter App ₹35,000+ · Business App ₹70,000+ · Custom App: custom quote
--
-- Idempotent: the leading delete makes re-running safe.
-- =====================================================================

delete from public.blog_posts where slug = 'mobile-app-cost-india';

insert into public.blog_posts
  (slug, title, meta_description, date, read_minutes, category, content,
   key_takeaways, cost_table, faqs, service_cta_slug, service_cta_label,
   demo_slug, demo_label, related_slugs, sources, status)
values (
  'mobile-app-cost-india',
  'What a Mobile App Actually Costs in India',
  'App quotes range from ₹35,000 to several lakh for what sounds like the same thing. Here is what actually drives the number, and how to tell which one you are being sold.',
  '2026-09-08',
  8,
  'Mobile App Development',
  $body$**A mobile app in India starts around ₹35,000** for a genuine build — a few screens, a real backend, published on the Play Store — and runs to ₹70,000 and beyond once accounts, payments and an admin panel are involved. Anything quoted below about ₹20,000 is almost always a template with your logo on it.

The spread is enormous and it is not arbitrary. Five things move the number, and knowing them is the difference between comparing quotes and guessing.

## 1. How many screens, and how much each one does

A screen that displays information is cheap. A screen where something happens — a form that validates, a list that filters, a cart that calculates — is several times the work.

Count the screens where the user *does* something rather than reads something. That is the number that matters, and most people undercount it by half because they forget the ones nobody wants to think about: the empty state, the error state, the "you are offline" state.

## 2. Whether it needs accounts

This is the single largest step change in the price.

An app with no login is a delivery mechanism for content you control. An app with login has to store people, verify them, let them reset a forgotten password, keep their data separate from everyone else's, and keep all of that secure. That is a backend, and a backend is not an afterthought bolted onto an app — it is roughly half the project.

If your app can work without accounts, it will cost dramatically less. It is worth thinking hard about whether it can.

## 3. One platform or two

Android and iOS are different platforms. Building the same app twice, natively, roughly doubles the cost.

Cross-platform frameworks — React Native, Flutter — write one codebase that runs on both. That is what most projects at this size should use, and it is what makes ₹35,000 possible at all. The trade-off is real but narrow: for apps that need deep camera work, heavy 3D or very tight platform integration, native is still better. For a booking app, a catalogue, a service business, cross-platform is not a compromise.

**In India, also ask whether you need iOS at all.** Android is the overwhelming majority of the market for most local businesses. Shipping Android first and adding iOS when there is demand is often the right sequence, not a cut corner.

## 4. What it has to talk to

Payments, WhatsApp, maps, a delivery partner, your existing accounting system — each connection is separate work with its own rules and its own failure cases. Two or three integrations can add more to a quote than five extra screens.

## 5. Who is publishing it, and on whose account

Google charges a one-time **$25** for a Play Store developer account. Apple charges **$99 every year**, indefinitely. Neither is included in a development quote and both are ongoing facts of owning an app.

Make sure those accounts are registered in **your** name. An app published under a developer's account is an app you cannot move, update or keep if the relationship ends. This is the single most common way small businesses lose an app they paid for.

## What the ranges actually look like

- **Around ₹35,000** — a straightforward app: a handful of screens, content you control, contact and enquiry, published to Play Store. No accounts.
- **Around ₹70,000** — accounts, saved data, an admin panel to manage it, one or two integrations. This is where most real business apps land.
- **Beyond that** — payments, live tracking, chat, anything with meaningful logic of its own. Quoted per project, because at that point no two are alike.

Two to eight weeks, depending on which of those it is.

## The costs that arrive after launch

An app is not a one-time purchase, and a quote that does not mention this is incomplete:

- **Backend hosting**, monthly, forever, if it has accounts or data.
- **The Apple $99**, annually.
- **OS updates.** Android and iOS both ship yearly. Apps that are never updated eventually break, and Google removes apps that fall too far behind its requirements.
- **Store policy changes**, which arrive without asking.

Budget something for the year after launch. An app nobody maintains has a shelf life of about eighteen months.

## Do you actually need an app?

The honest answer, often, is no — and it is worth asking before spending ₹35,000.

An app has to be *installed*, which is a real barrier. People install apps they will open repeatedly: their bank, their food delivery, their gym. They do not install an app to look at a restaurant menu once.

If what you need is to be found, show what you offer and let people get in touch, **a good mobile website does that better and costs a fraction** — nothing to install, and it turns up in search, which an app never does.

An app earns its place when people come back regularly, when you need something a browser cannot do (reliable notifications, offline use, hardware access), or when the app *is* the product.

If that is not you, the money is better spent elsewhere, and anyone quoting you should be willing to say so.$body$,
  '["A real app starts around ₹35,000; below about ₹20,000 you are almost certainly buying a template.","Adding user accounts is the single biggest jump in cost — it means building a backend, which is roughly half the project.","Play Store is a one-time $25; Apple is $99 every year, forever. Neither is in a development quote.","Register the developer accounts in your own name, or you cannot keep the app if the relationship ends.","Most businesses that want an app are better served by a good mobile website — an app has to be installed, and a website turns up in search."]'::jsonb,
  '[]'::jsonb,
  '[{"q":"Why do app quotes vary from ₹20,000 to ₹5,00,000?","a":"Because they are not the same thing. The main drivers are whether it needs user accounts (which means a backend), how many screens actually do something rather than display something, how many outside services it connects to, and whether it ships on one platform or two. A quote that does not ask about those is not really a quote."},{"q":"Do I need both Android and iOS?","a":"Often not at first. Android is the large majority of the market for most local businesses in India, and cross-platform frameworks make adding iOS later straightforward. Shipping Android first is a sequence, not a compromise."},{"q":"What are the ongoing costs after the app is built?","a":"Backend hosting monthly if it stores data, Apple $99 a year if it is on iOS, and periodic updates as Android and iOS release new versions. An app that is never updated eventually stops working and can be removed from the store."},{"q":"Who should own the Play Store and App Store accounts?","a":"You. Always. An app published under a developer agency account cannot be moved or updated by anyone else, which means you do not really own what you paid for. Insist on this before the project starts."},{"q":"Should I build an app or a mobile website?","a":"A website, unless people will come back regularly or you need something a browser cannot do — reliable notifications, offline use, hardware access. Apps must be installed, which is a real barrier, and they do not appear in search results. For being found and getting enquiries, a mobile website does more for far less."}]'::jsonb,
  'mobile-app-development',
  'Get a mobile app quote',
  '/demo/app-booking',
  'See a working app concept',
  '["website-vs-web-app","why-cheap-and-expensive-websites-differ","what-to-prepare-before-building-a-website"]'::jsonb,
  '[]'::jsonb,
  'published'
);

-- =====================================================================
-- To verify:
--   select slug, title, service_cta_slug, status
--   from public.blog_posts where slug = 'mobile-app-cost-india';
-- =====================================================================
