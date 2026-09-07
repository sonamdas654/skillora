-- APPLIED to production on 2026-09-07. The leading delete makes it idempotent.
-- =====================================================================
-- Skilloura — cluster articles for the focused service pages.
--
-- Phase 9 added eight focused service pages. Four of them had no supporting
-- article anywhere in the blog, which meant they sat in the site with nothing
-- linking to them but the nav — a money page with no cluster around it is a
-- page search engines have very little reason to rank and readers have no
-- route into.
--
--   website-speed-optimization  -> nothing at all
--   api-integration             -> nothing at all
--   seo                         -> only the local/GBP guide, which is a
--                                  different intent
--   website-redesign            -> only tangential posts
--
-- These four articles close that. Each one answers a question people actually
-- type, links to its service page with a descriptive anchor through
-- service_cta_slug, and links sideways to existing posts through
-- related_slugs so the cluster is connected in both directions.
--
-- Dollar-quoted bodies ($body$) so apostrophes in the prose need no escaping.
-- Idempotent: re-running replaces these four and touches nothing else.
-- =====================================================================

delete from public.blog_posts where slug in (
  'why-your-website-is-slow',
  'connect-website-to-software-you-already-use',
  'signs-you-need-a-website-redesign',
  'seo-for-small-business-india'
);

-- ─────────────────────────────────────────────────────────────────────
insert into public.blog_posts
  (slug, title, meta_description, date, read_minutes, category, content,
   key_takeaways, cost_table, faqs, service_cta_slug, service_cta_label,
   demo_slug, demo_label, related_slugs, sources, status)
values
(
  'why-your-website-is-slow',
  'Why Your Website Is Slow — And What Actually Fixes It',
  'Most slow websites are slow for three or four specific reasons, and image weight is nearly always the biggest. Here is how to find out which one is hurting you, and what a fix realistically costs.',
  '2026-08-04',
  7,
  'Website Development',
  $body$Slow websites lose visitors before anything on them gets read. That is not a design opinion — on a mobile connection, every extra second of load time measurably increases the share of people who leave. And in India most of your visitors are on a phone, often on a connection that is nothing like your office wi-fi.

The useful thing to know is that slowness is rarely mysterious. It is almost always one of a small number of causes, and they are ordered by how often they turn out to be the culprit.

## First, measure it properly

Do not judge speed by loading your own site. Your browser has it cached, you are probably on broadband, and you already know where everything is.

Test it the way a stranger experiences it. Use Google's PageSpeed Insights on the actual URL and read the **field data** section if it appears — that is real measurement from real visitors, not a simulation. If there is no field data, the lab score is still a reasonable guide.

Look at three numbers:

- **Largest Contentful Paint (LCP)** — when the main content actually appears. Under 2.5 seconds is good.
- **Cumulative Layout Shift (CLS)** — how much the page jumps around while loading. Under 0.1 is good. This is the one that makes people tap the wrong button.
- **Interaction to Next Paint (INP)** — how quickly the page responds when tapped. Under 200 milliseconds is good.

## Cause 1: images, and it is nearly always images

This is the big one. A photograph straight off a phone camera is often 4–6 MB. Put six of those on a homepage and you have a 30 MB page, which on a typical mobile connection is a wait long enough that most people give up.

The fix is unglamorous and enormously effective:

- Resize before uploading. An image displayed 800 pixels wide does not need to be 4000 pixels wide.
- Use a modern format. WebP or AVIF typically cut file size by half or more against JPEG at the same visible quality.
- Load images below the fold lazily, so they download only as the visitor scrolls to them.
- Always set width and height. Missing dimensions are the single most common cause of a bad CLS score, because the browser does not know how much space to reserve and everything jumps when the image finally arrives.

On most small business sites, doing only this takes the page from uncomfortable to fine.

## Cause 2: too many plugins

Every plugin adds code that has to be downloaded, parsed and run. A site with thirty active plugins is loading thirty sets of that, often including several that do nearly the same thing, and a few that are still loading on pages where their feature is not used at all.

Audit them honestly. Deactivate anything you cannot name a purpose for, and check what you have lost. Most sites can drop a third of their plugins without any visible change.

## Cause 3: cheap shared hosting

If the server itself takes a second or more to begin responding, nothing you do in the browser will fix it. That first delay — time to first byte — is pure hosting, and it is where the very cheapest plans reveal what you saved.

You do not necessarily need expensive hosting. You need hosting that is not overloaded. Moving from a bargain shared plan to a decent one is often the single largest improvement available, and it costs a few hundred rupees a month.

## Cause 4: fonts and third-party scripts

Custom fonts block text from rendering until they load. Limit yourself to two font families and a couple of weights.

Third-party scripts — chat widgets, analytics, ad pixels, social embeds — are worse, because each one is a request to somebody else's server whose speed you do not control. Keep the ones that earn their place, and be ruthless about the rest.

## What fixing it involves

A speed pass on an existing site is measurement, then the fixes above in order of impact, then measurement again to prove it worked. It is not a redesign and it does not change how the site looks.

If the site is old, built on a heavily-modified theme, or already carries years of plugin accumulation, there is a point where optimising it costs more than rebuilding it — and an honest assessment should tell you which side of that line you are on before you spend anything.

## What to be sceptical of

Anyone quoting you a guaranteed PageSpeed score of 100 is either going to do harmful things to your site to chase a number, or is not being straight with you. The score is a diagnostic tool, not the goal. The goal is that the page feels immediate to a real person on a real phone, and that is what should be measured before and after.$body$,
  '["Image weight is the most common cause of a slow site, and resizing plus a modern format usually fixes most of it.","Missing width and height attributes on images are the biggest cause of a page that visibly jumps while loading.","If the server takes over a second to respond, no front-end optimisation will help — that is a hosting problem.","Be wary of anyone guaranteeing a PageSpeed score of 100; the score is a diagnostic, not the objective."]'::jsonb,
  '[]'::jsonb,
  '[{"q":"How much does it cost to speed up an existing website?","a":"It depends almost entirely on what is causing the slowness. An image and configuration pass on a reasonably built site is a small, quick job. A site that is slow because of its underlying build is a different conversation, and an honest assessment will tell you which one you have before any work is quoted."},{"q":"Will making my site faster change how it looks?","a":"No. A speed pass changes how assets are prepared and delivered, not the design. If anything visibly changes, that is a redesign and should have been quoted as one."},{"q":"My site is fast on my laptop. Is it actually slow?","a":"Possibly. Your browser has cached the site and you are likely on a much better connection than most of your visitors. Test the live URL on PageSpeed Insights and look at the mobile numbers — that is closer to what people actually get."},{"q":"Does site speed affect Google rankings?","a":"Yes, though it is one signal among many and rarely the deciding one. The stronger reason to fix it is that slow pages lose visitors before they read anything, which costs you enquiries regardless of where you rank."}]'::jsonb,
  'website-speed-optimization',
  'Get your site measured and sped up',
  null,
  null,
  '["domain-hosting-maintenance-difference","why-cheap-and-expensive-websites-differ","what-to-prepare-before-building-a-website"]'::jsonb,
  '[]'::jsonb,
  'published'
),

-- ─────────────────────────────────────────────────────────────────────
(
  'connect-website-to-software-you-already-use',
  'Connecting Your Website to the Software You Already Use',
  'Payment gateways, WhatsApp, accounting tools, CRMs and delivery partners can all talk to your website directly. Here is what integration actually means, what it costs, and when it is worth it.',
  '2026-08-11',
  7,
  'Website Development',
  $body$Most businesses end up running several separate systems: a website, a payment gateway, WhatsApp for customers, an accounting tool, maybe a delivery partner or a CRM. Each works fine on its own. The cost is in the gaps between them, and the gaps are filled by a person retyping the same information from one screen into another.

That retyping is where the working day goes, and it is also where the mistakes come from. An integration is simply making two systems talk directly so nobody has to be the go-between.

## What an API actually is

An API is the doorway a piece of software provides for other software to use. Razorpay's API lets your website start a payment and be told, reliably, whether it succeeded. WhatsApp's Business API lets your system send a message without anyone opening the app.

The important thing to understand as a business owner is that the doorway already exists. Nobody has to build it. The work is in connecting to it correctly, and in handling the cases where it does not answer.

## What people usually connect first

**Payments.** Razorpay, PayU, Stripe. Your site takes money without you sending a UPI QR code by hand and manually checking whether it arrived. This one usually pays for itself fastest.

**WhatsApp.** Order confirmations, appointment reminders, delivery updates — sent automatically at the right moment instead of by someone remembering.

**Accounting.** Orders flow into Tally or Zoho Books instead of being entered again at month end. If your accountant currently receives a spreadsheet you assemble by hand, this is worth pricing.

**CRM.** Enquiries from your website land in the system your sales follow-up actually lives in, rather than an inbox where they get lost.

**Logistics.** Shipping labels and live tracking, rather than copying addresses into a courier's portal one at a time.

## Being honest about what it costs

An integration is generally quoted per connection, because each one is genuinely different work — different doorway, different rules, different failure cases. A straightforward payment gateway connection is a small job. A two-way sync with an accounting system, where records can change on both sides and have to stay consistent, is a much bigger one.

Three costs are easy to miss when comparing quotes:

1. **The other service's own fees.** Payment gateways take a percentage. WhatsApp's Business API charges per conversation. These are ongoing and they are not part of the development quote.
2. **Handling failure.** What happens when the other service is down, or slow, or returns something unexpected? Getting this right is often more work than the connection itself — and skipping it is why some integrations quietly lose orders.
3. **Maintenance.** APIs change. Versions get retired. A connection built once and never touched will eventually break, usually without announcing itself.

## When it is not worth it

If you process five orders a week, automating order entry saves you a few minutes. Integration is worth doing when the manual step is frequent enough that the time adds up, or when the mistakes it causes are expensive.

The honest test is to count how many minutes a day the manual step actually takes, and be strict about it. If the answer is small, spend the money somewhere else and revisit when volume grows.

## What good integration work looks like

- It fails safely. If the other service does not respond, the order is not lost — it is queued and retried, and somebody is told.
- It does not trust the other side blindly. Data coming back is checked before it is used.
- Credentials are stored properly, never in the website's code.
- There is a record of what was sent and what came back, so when something looks wrong it can actually be investigated.

If a quote does not mention what happens when the connection fails, ask. That answer tells you a great deal about the rest of the work.$body$,
  '["An integration removes the person who currently retypes information from one system into another.","The doorway (the API) already exists — the work is connecting to it correctly and handling failures.","Ongoing third-party fees, failure handling and maintenance are the three costs most often missing from a comparison.","Integration is worth it when the manual step is frequent or the mistakes it causes are expensive — not automatically."]'::jsonb,
  '[]'::jsonb,
  '[{"q":"Can any two systems be connected?","a":"Usually, if both provide an API. Some older or very cheap tools do not, in which case the options are exporting and importing files on a schedule, or changing one of the tools. This is worth checking before anything is quoted."},{"q":"Will an integration break when the other service updates?","a":"It can. Reputable services announce changes in advance and support older versions for a period, but connections do need occasional maintenance. Any quote should say who is responsible for that and on what terms."},{"q":"Is it cheaper to use a tool like Zapier?","a":"Often, for simple, low-volume connections — and it is a sensible place to start. Costs rise with volume, and it is limited when the logic gets specific, so it tends to be a good first step rather than a permanent answer."},{"q":"What do you need from me to build an integration?","a":"Access to the accounts on both sides, clarity about exactly what should happen and when, and a decision about what should occur if the other service is unavailable. That last one matters more than it sounds."}]'::jsonb,
  'api-integration',
  'Discuss connecting your systems',
  null,
  null,
  '["website-vs-web-app","how-ai-automation-saves-business-time","whatsapp-automation-for-small-business"]'::jsonb,
  '[]'::jsonb,
  'published'
),

-- ─────────────────────────────────────────────────────────────────────
(
  'signs-you-need-a-website-redesign',
  'Seven Signs It Is Time to Redesign Your Website',
  'A redesign is expensive and disruptive, so it should be triggered by a real problem rather than boredom. Here are the seven that genuinely justify it — and the ones that do not.',
  '2026-08-18',
  6,
  'Website Development',
  $body$"I am bored of my website" is not a reason to redesign it. You look at it far more than your customers do, and what feels stale to you is usually invisible to someone seeing it for the first time.

There are real reasons, though, and they are specific.

## 1. It does not work properly on a phone

Not "it technically loads on a phone" — it works. Text readable without pinching, buttons big enough to tap, no sideways scrolling, forms you can actually fill in with a thumb.

Most visitors to a small business site in India are on a phone. If the experience there is poor, that is not a cosmetic problem, it is most of your traffic.

## 2. You cannot update it yourself

If changing a price means emailing a developer and waiting, the site will slowly drift out of date, because the friction is just high enough that small updates never happen. Eventually it says things that are no longer true, and you stop sending people to it.

## 3. It is slow and cannot be fixed

Slowness is often fixable without a redesign — usually images and hosting. But when a site is slow because of what it is built on, optimisation stops paying for itself. That is a genuine trigger, and an honest assessment should establish which situation you are in before you commit to anything.

## 4. It does not say what you actually do now

Businesses change. If your site describes the services you offered three years ago, or does not mention the thing that now makes most of your money, it is working against you — and this is often a content problem before it is a design problem.

## 5. It is not secure

No HTTPS, or an outdated platform with known vulnerabilities. Browsers now warn visitors about insecure sites in language that is quite alarming to a non-technical person. This one is urgent rather than aesthetic.

## 6. It gets visitors but no enquiries

If people arrive and leave without contacting you, something in between is failing: no clear next step, a contact form nobody can find, no prices, no reason to trust you. This is worth diagnosing before rebuilding, because the fix is sometimes one page rather than the whole site.

## 7. It looks abandoned

Broken images, a copyright notice from several years ago, links that go nowhere, a blog whose most recent post is from 2019. Visitors read all of that as evidence that the business itself may not be active any more. This is the cheapest problem on the list to fix and one of the most damaging to leave.

## Reasons that are not good enough on their own

- **A competitor redesigned theirs.** You do not know whether theirs is working.
- **A new design trend.** Trends turn over faster than the cost of following them.
- **One person said they did not like it.** One opinion is not data.
- **It is three years old.** Age is not a fault. A site that loads fast, works on a phone, says the right things and generates enquiries is doing its job regardless of when it was built.

## Redesign, or repair?

Quite often the honest answer is repair. A speed pass, a content update, a rewritten services page and a contact form that works can address most of the list above for a fraction of a rebuild.

A full redesign genuinely makes sense when several of these problems overlap, or when the underlying build is the reason they cannot be fixed individually. Anyone quoting you should be willing to say which of those you are actually facing — and should be willing to tell you that repair is enough, when it is.$body$,
  '["Boredom with your own site is not a reason to redesign it; you see it far more often than your customers do.","A poor phone experience, an inability to update it yourself, and security problems are the triggers that genuinely justify a rebuild.","Slowness is often repairable without a redesign — the question is whether the underlying build is the cause.","Several of these problems can be fixed individually for far less than a full rebuild."]'::jsonb,
  '[]'::jsonb,
  '[{"q":"How often should a website be redesigned?","a":"There is no schedule. A site that loads fast, works properly on a phone, describes what you actually do and produces enquiries does not need replacing because of its age."},{"q":"Can I keep my content and just change the design?","a":"Usually yes, and it often reduces both cost and timeline considerably. It is worth reviewing the content as you move it, since outdated copy is frequently part of the reason a site stopped working."},{"q":"Will a redesign affect my Google rankings?","a":"It can, if URLs change without redirects, or if content is cut during the rebuild. Done properly — same URLs where possible, redirects where not, content preserved — rankings normally hold and often improve as speed and structure get better."},{"q":"How do I know whether I need a redesign or just repairs?","a":"Count how many of the seven signs apply. One or two are usually repairable individually. Several at once, especially when the platform itself is why they cannot be fixed, is when a rebuild becomes the cheaper answer."}]'::jsonb,
  'website-redesign',
  'Get an honest redesign assessment',
  null,
  null,
  '["website-vs-instagram-page-for-business","why-cheap-and-expensive-websites-differ","what-to-prepare-before-building-a-website"]'::jsonb,
  '[]'::jsonb,
  'published'
),

-- ─────────────────────────────────────────────────────────────────────
(
  'seo-for-small-business-india',
  'SEO for a Small Business: What Actually Moves the Needle',
  'Most SEO advice is written for companies with content teams. Here is what genuinely matters for a small business in India, in the order worth doing it — and what to ignore.',
  '2026-08-25',
  8,
  'Digital Marketing',
  $body$SEO has a reputation for being either mysterious or a scam, and both reputations are earned. Plenty of what is sold as SEO is either automated nonsense or work that will never affect a small business.

Here is what actually matters, roughly in the order it is worth doing.

## Start with what you can realistically win

A local business will not outrank a national marketplace for "buy furniture online". It can absolutely rank for "furniture shop in Bhubaneswar", and the second search is full of people who might actually walk in.

Specific beats broad, every time. Fewer people search it, but a far larger share of them are near a decision. Chasing high-volume generic terms is the most common way small SEO budgets get wasted.

## Google Business Profile is the highest-return thing you can do

For any business with a physical location or a service area, this is the single highest-return item on the list, and it is free.

Fill it in completely: correct category, services, hours, service areas, a proper description. Add real photographs of the actual premises and the actual work, not stock images. Keep the hours accurate — including holidays, because wrong hours generate genuinely angry reviews. Ask satisfied customers for reviews, and reply to every one, including the unhappy ones.

Many local businesses receive more enquiries from a well-maintained profile than from their website. It deserves more attention than it usually gets.

## Then fix the technical basics, once

These are one-time jobs, not a monthly service:

- The site works properly on a phone.
- It loads reasonably fast.
- It is on HTTPS.
- Every page has its own title and description, and they describe that page.
- One clear H1 per page.
- A sitemap exists and is submitted in Google Search Console.
- Images have real alt text.

None of it is glamorous. All of it is checkable, and being charged monthly for it is a fair thing to question.

## Write pages that answer real questions

The most reliable content strategy for a small business is unromantic: answer the questions customers actually ask you, one page per question, properly.

If people ask what a service costs, write an honest page about what it costs and what changes the price. If they ask how long something takes, write that. These pages rank because they match a real search, and they convert because the person reading has exactly that question.

You already know the questions. You answer them on the phone every week.

## Get links the slow way

Links from other sites still matter. Buying them is against Google's guidelines and periodically gets sites penalised, sometimes badly.

What works, slowly: being genuinely listed in legitimate local directories with consistent details, partner and supplier pages, local news or community coverage, industry associations, and writing something worth referencing. It is slower than buying links, and it does not evaporate the next time Google updates.

## What to ignore

- **"Guaranteed number one ranking."** Nobody controls Google's results. This promise is a reliable signal to walk away.
- **Keyword stuffing.** Repeating a phrase unnaturally has been counterproductive for over a decade.
- **Hundreds of directory submissions.** Automated listings on low-quality sites do nothing at best.
- **Monthly retainers with no reporting.** If you cannot see what was done and what changed, you are not buying SEO.

## Being realistic about time

SEO is slow. A new site typically shows meaningful movement in three to six months, sometimes longer in competitive categories. Google Business Profile can move faster, sometimes within weeks.

Anyone promising results in thirty days is either doing something risky or describing paid ads, which are a legitimate tool but a different one — and worth being clear about which you are buying.$body$,
  '["Specific local searches are winnable and full of buyers; broad national terms usually are not.","A properly maintained Google Business Profile often produces more enquiries than the website itself, and costs nothing.","The technical basics are a one-time job, not something to pay for every month.","Guaranteed rankings, bought links and bulk directory submissions range from useless to actively harmful."]'::jsonb,
  '[]'::jsonb,
  '[{"q":"How long before SEO produces results?","a":"Typically three to six months for meaningful movement on a newer site, longer in competitive categories. A Google Business Profile can start producing enquiries considerably faster."},{"q":"Is SEO or Google Ads better for a small business?","a":"They do different jobs. Ads produce enquiries immediately and stop the moment you stop paying. SEO is slower to build and keeps working. Many businesses run ads while the organic side develops."},{"q":"Do I need to publish a blog post every week?","a":"No. A handful of pages that genuinely answer the questions your customers ask will outperform a weekly post written to fill a schedule. Frequency is not the ranking factor people assume it is."},{"q":"Can I do SEO myself?","a":"A lot of it, yes — particularly the Google Business Profile and writing pages that answer real customer questions, both of which you are better placed to do than anyone else. The technical setup is where outside help is usually worth it, and it is mostly a one-time job."}]'::jsonb,
  'seo',
  'Get an SEO plan for your business',
  null,
  null,
  '["google-business-profile-setup-guide","how-small-businesses-get-more-leads-online","why-every-restaurant-needs-a-website"]'::jsonb,
  '[]'::jsonb,
  'published'
);

-- =====================================================================
-- Done. To verify:
--   select slug, title, status, service_cta_slug from public.blog_posts
--   order by date desc limit 8;
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- Pre-existing broken reference, found by tools/qa/content-links.mjs.
--
-- ai-chatbot-data-privacy-checklist links onward to
-- "how-ai-automation-saves-small-businesses-10-hours-every-week", which is not
-- a post and never has been — the real slug is
-- "how-ai-automation-saves-business-time". The related-reading list renders
-- from related_slugs without checking that the targets exist, so this has been
-- a dead link on a published article, failing silently.
update public.blog_posts
set related_slugs = '["how-ai-automation-saves-business-time","whatsapp-automation-for-small-business"]'::jsonb
where slug = 'ai-chatbot-data-privacy-checklist';
