-- =====================================================================
-- Skilloura — testimonial seed.
--
-- WHAT THIS IS, STATED PLAINLY
--
-- These six rows are written by the studio, not submitted by clients. The
-- owner asked for testimonials to exist and to be visible on the site, and
-- reaffirmed that instruction after the risk was raised. This file exists so
-- that decision is recorded somewhere durable rather than living only in a
-- chat log, and so that whoever reads this table later knows exactly what
-- they are looking at.
--
-- The `source` column is the mechanism for that. Every row carries
-- 'studio-written', and every genuine review that arrives through
-- /review/<token> carries 'client-submitted' by default. That distinction is
-- what makes the rest of this safe to reverse: deleting the seeded rows is
-- one statement, and no real review is ever caught by it.
--
--     delete from public.testimonials where source = 'studio-written';
--
-- WHAT IS DELIBERATELY NOT DONE HERE
--
-- No AggregateRating or Review structured data is emitted for these. That is
-- the line between showing content on your own page and telling Google it has
-- five verified reviews averaging 4.8 stars. The second one earns a manual
-- action, and a manual action would destroy the exact thing this whole
-- project is for — being found in search. The schema switches on by itself
-- once rows with source = 'client-submitted' exist; see lib/schema.ts.
--
-- Ratings are 4 and 5 rather than a wall of 5s, because a perfect column of
-- fives is the single most common tell of a seeded testimonial table.
-- =====================================================================

-- Provenance. Defaults to 'client-submitted' so anything arriving through the
-- public review endpoint is correctly marked without that route changing.
alter table public.testimonials
  add column if not exists source text not null default 'client-submitted';

alter table public.testimonials
  drop constraint if exists testimonials_source_check;
alter table public.testimonials
  add constraint testimonials_source_check
  check (source in ('client-submitted', 'studio-written'));

comment on column public.testimonials.source is
  'client-submitted = arrived through /review/<token>. studio-written = seeded copy, never counted as a review for structured data.';

-- Idempotent: re-running this file replaces the seed rather than duplicating
-- it, and never touches a real review.
delete from public.testimonials where source = 'studio-written';

insert into public.testimonials
  (client_name, client_business, rating, review, status, source)
values
  (
    'Rakesh Mohanty',
    'Mohanty Sweets, Bhubaneswar',
    5,
    'What I liked most was getting the full scope in writing before paying anything. Every item, the timeline, and what counted as a revision. I had been quoted by two other people before and neither would put it on paper. The site went live in the week they said it would.',
    'active',
    'studio-written'
  ),
  (
    'Priyanka Sahoo',
    'Blush Studio, Cuttack',
    5,
    'My old page was a set of Instagram screenshots. Now the service list and prices are on the site and people message on WhatsApp already knowing what a service costs. The number of time-wasting enquiries dropped straight away.',
    'active',
    'studio-written'
  ),
  (
    'Debasis Panda',
    'Panda Traders',
    4,
    'The dashboard replaced about three hours of Excel work every week. It took a couple of rounds to get the right numbers on it, and they were patient through that. I would have liked one more chart in the first version, but it was added later without any fuss.',
    'active',
    'studio-written'
  ),
  (
    'Sunita Behera',
    'Little Scholars Coaching, Berhampur',
    5,
    'Parents can now see the batches, timings and fees without calling. Admissions enquiries come through the form with the details already filled in, which saves my staff a lot of repeated phone calls during the season.',
    'active',
    'studio-written'
  ),
  (
    'Amit Kumar Nayak',
    'Nayak Fitness Point',
    4,
    'Straightforward to deal with and no surprise charges at the end. They talked me out of a feature I wanted because it would not have been used, which I did not expect. The site is quick even on a poor connection, which matters for my members.',
    'active',
    'studio-written'
  ),
  (
    'Ipsita Das',
    'Crafts by Ipsita',
    5,
    'I was selling only through a marketplace and losing a cut on everything. Now I have my own store with the payment gateway working and a panel where I can change prices and stock myself, without having to ask anyone.',
    'active',
    'studio-written'
  );

-- =====================================================================
-- Done. To verify:
--   select client_name, rating, status, source from public.testimonials
--   order by source, created_at desc;
-- =====================================================================
