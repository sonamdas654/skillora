-- =====================================================================
-- Skilloura — make the cost articles answer their own question first.
--
-- Two of the three "cost in India" articles never state a price in their
-- opening. Checked, not assumed:
--
--   website-development-cost-india   price in first 700 chars: YES
--   restaurant-website-cost-india    price in first 700 chars: NO
--   gym-website-cost-india           price in first 700 chars: NO
--
-- Someone typing "restaurant website cost india" wants the number. The
-- article opened with an argument about aggregator commission — true, useful,
-- and not what was asked. A reader who has to scroll to find out whether they
-- can afford this is a reader who goes back to the results page.
--
-- This matters more here than it would for most sites. Page one for that query
-- is entirely agency blog posts, one of which puts an Indian restaurant
-- website at ₹2,20,000–₹4,20,000 — written by agencies selling enterprise
-- builds. A small restaurant owner reads that, concludes a website is out of
-- reach, and stops looking. Skilloura builds the same thing for ₹12,000, and
-- burying that figure wastes the single clearest advantage the business has.
-- See docs/02-competitor-gap-report.md §4.
--
-- The existing copy is not replaced — a direct answer is prepended, so the
-- article now leads with the figure and keeps every argument it already made.
-- Figures match lib/portfolio.ts, which is where the studio's real ranges live.
-- =====================================================================

update public.blog_posts
set content = $body$**A restaurant website in India costs roughly ₹12,000 to ₹25,000** for a proper build — digital menu, photo gallery, table booking and WhatsApp ordering — and takes about five to eight days. That figure is for a site you own outright, not a template subscription.

You will find articles quoting ₹2,00,000 and up for the same description. Those are written by agencies selling enterprise builds to restaurant chains, and they are answering a different question than the one most owners are asking. What actually moves the price is covered below.

$body$ || content
where slug = 'restaurant-website-cost-india';

update public.blog_posts
set content = $body$**A gym website in India costs roughly ₹12,000 to ₹22,000** — membership plans with published prices, class timetable, trainer profiles, a BMI calculator and lead capture — built in about five to eight days.

That is the honest range for a site that does the job. What changes it, and what is genuinely worth paying more for, is below.

$body$ || content
where slug = 'gym-website-cost-india';

-- =====================================================================
-- To verify:
--   select slug, left(content, 120) from public.blog_posts
--   where slug in ('restaurant-website-cost-india','gym-website-cost-india');
--
-- Re-running this file WILL prepend a second copy. It is deliberately not
-- idempotent, because the alternative is matching on prose that an editor may
-- reasonably have changed. Run it once.
-- =====================================================================
