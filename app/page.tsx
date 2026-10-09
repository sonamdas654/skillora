import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppSticky from "@/components/WhatsAppSticky";
import MobileCtaBar from "@/components/MobileCtaBar";
import HomeHero from "@/components/heroes/HomeHero";
import Reveal from "@/components/Reveal";
import ImpactStage from "@/components/ImpactStage";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/Section";
import { PackageCard } from "@/components/Cards";
import BuildShowcase from "@/components/BuildShowcase";
import { serviceCategories, SECONDARY_SERVICE_SLUGS } from "@/lib/services";
import { homeFaqs } from "@/lib/faqs";
import { createPublicClient } from "@/lib/supabase/public";
import EstimateTeaser from "@/components/EstimateTeaser";
import ReviewCarousel from "@/components/ReviewCarousel";
import JsonLd from "@/components/JsonLd";
import { aggregateRatingSchema } from "@/lib/schema";
import DeliveryLine from "@/components/DeliveryLine";

// Public content only, so this is statically generated and refreshed on a
// timer instead of server-rendered per request. See lib/supabase/public.ts
// for why the cookie-bound client cannot be used here.
export const revalidate = 900;

// Homepage-specific title/description. The site-wide default is brand-first
// ("Skilloura — Smart Digital Services…"), which only wins searches by people
// who already know the name. This targets what prospects actually type, and
// puts the real starting price in the snippet.
export const metadata = {
  alternates: { canonical: "/" },
  title: "Website Development & AI Automation Company in India | Skilloura",
  description:
    "Websites, apps and AI automation for growing businesses in India. Get a written scope, timeline and transparent quote before you pay anything. From ₹20,000.",
};

// Homepage shows a 4-step summary; the full 8-step process lives on
// /how-it-works. Voice kept consistently "we" (a small, personally-run studio).

// Impact / trust numbers — honest, capability-based stats (no fake client counts).
// Four facts about how this business runs. These used to carry a gradient
// tile and a coloured glow each — four more colour stories on a page that
// already had twelve in the rail.
// Trimmed to 4 to cut mobile length and avoid repeating the "who's behind
// Skilloura" cards (ownership / scope / personal contact live there now).
// Four items, four different icons. Two of these were both "shield", side by
// side in the same row of four — which reads as a rendering bug rather than as
// a set.
const whyChoose = [
  { icon: "file", title: "No hidden charges", desc: "The quoted price is the price. Any extra is always discussed and agreed first." },
  { icon: "shield", title: "Secure file handling", desc: "Your files stay private, linked only to your project — never public or shared." },
  { icon: "check", title: "Preview before final delivery", desc: "You see and approve the work before the final payment — no nasty surprises." },
  { icon: "clock", title: "Maintenance support available", desc: "Monthly care plans from ₹1,999/month keep your project healthy after launch." },
];

const featuredPackages = [
  {
    name: "Basic Website",
    price: "₹20,000+",
    features: ["1–3 pages", "Mobile responsive", "Contact form", "WhatsApp button", "Basic SEO"],
    delivery: "3–5 days",
    revisions: "1 revision",
  },
  {
    name: "Business Website",
    price: "₹35,000+",
    features: ["5–8 pages", "Professional design", "Gallery + Google Maps", "WhatsApp integration", "Basic SEO"],
    delivery: "5–10 days",
    revisions: "2 revisions",
    highlighted: true,
  },
  {
    name: "Ecommerce Website",
    price: "₹60,000+",
    features: ["Product catalog", "Cart & checkout", "Payment gateway", "Admin panel", "SEO setup"],
    delivery: "10–20 days",
    revisions: "3 revisions",
  },
  {
    name: "AI Automation",
    price: "₹20,000+",
    features: ["Workflow automation", "WhatsApp/Email/Excel", "AI integration option", "Setup guide included"],
    delivery: "3–12 days",
  },
  {
    name: "Custom Project",
    price: "Custom",
    features: ["Any scope, any stack", "Written proposal first", "Milestone payments", "Full documentation"],
    delivery: "Based on scope",
  },
];


export default async function HomePage() {
  const supabase = createPublicClient();
  const { data: testimonialRows } = await supabase
    .from("testimonials")
    .select("id, client_name, client_business, rating, review, source")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);
  const testimonials = (testimonialRows ?? []).map((t) => ({
    id: t.id,
    clientName: t.client_name,
    clientBusiness: t.client_business,
    rating: t.rating,
    review: t.review,
    source: t.source as string | null,
  }));

  // Returns null until at least three genuinely client-submitted reviews
  // exist. Seeded copy is shown on the page but never counted here — see
  // aggregateRatingSchema for why that line matters.
  const ratingSchema = aggregateRatingSchema(testimonials);

  return (
    <>
      {/* Organization + WebSite + ProfessionalService JSON-LD is emitted once
          site-wide in app/layout.tsx — not repeated here (was a duplicate). */}
      <Header />
      <main id="main-content">
        {/* ── Section 1: Hero ─────────────────────────────── */}
        <HomeHero />
        <DeliveryLine />

        {/* ── Section 2: Problem ──────────────────────────── */}
        <Section className="bg-wash-blue border-b border-line">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                center={false}
                eyebrow="The Problem"
                title={
                  <>
                    Tired of explaining your project{" "}
                    <span className="font-accent font-normal text-accent">again and again?</span>
                  </>
                }
                subtitle="Most clients do not know how to explain their website, app, design, video or automation requirement properly. This causes confusion, delay and wrong quotation. This website solves that problem with smart service-wise forms where you can select what you need, upload references and submit everything clearly."
              />
              <Link
                href="/how-it-works"
                className="mt-6 tap-safe inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:text-accent-deep"
              >
                See how the process works <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-panel border border-line bg-surface p-6 sm:p-8 shadow-e3">
                <div className="space-y-4">
                  {[
                    { text: "“I need a website... something nice... you decide”" },
                    { text: "20 WhatsApp voice notes, zero clear requirements" },
                    { text: "Wrong quotation → arguments → project stuck" },
                  ].map((row) => (
                    <div key={row.text} className="flex items-start gap-3 rounded-field bg-danger-soft px-4 py-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill text-danger text-body-sm font-bold">✕</span>
                      <p className="text-body-sm text-ink-soft">{row.text}</p>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 rounded-field border border-success/25 bg-success-soft px-4 py-3.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-pill bg-success text-on-brand">
                      <Icon name="check" className="size-3" />
                    </span>
                    <p className="text-body-sm font-medium text-ink">
                      Smart form → clear requirement → correct quote → smooth delivery. That&apos;s the Skilloura way.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ── Section 3: Impact ───────────────────────────── */}
        {/* Live cinematic delivery scene; the previous flat impact row is removed. */}
        <ImpactStage />

        {/* ── Section 4: Services Overview ────────────────── */}
        <Section padding="pt-16 sm:pt-20 pb-24 sm:pb-32" className="bg-soft-panel border-y border-line" id="services">
          {/* The heading is inside BuildShowcase: the reference puts it in a
              left column beside the work rather than centred above it. */}
          <BuildShowcase />

          {/* Additional services — real offerings, kept secondary so the core
              websites/AI/systems positioning stays front and centre. */}
          <Reveal>
            <div className="mt-14 rounded-panel border border-line bg-surface p-6 sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-micro font-mono uppercase text-ink-soft">Additional services</p>
                  <h3 className="mt-1 text-title-2 text-ink">Also available alongside your project</h3>
                </div>
                <p className="text-body-sm text-ink-soft">Often added on to a website or system build.</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {serviceCategories
                  .filter((s) => SECONDARY_SERVICE_SLUGS.includes(s.slug))
                  .map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="card-lift flex min-w-0 items-center gap-3 rounded-card border border-line bg-canvas px-4 py-3.5 hover:border-accent/40"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-body-sm font-semibold text-ink">{s.name}</span>
                        <span className="block truncate text-body-sm text-ink-soft">{s.outcome}</span>
                      </span>
                      <Icon name="arrow" className="ml-auto size-4 shrink-0 text-ink-soft" />
                    </Link>
                  ))}
              </div>
            </div>
          </Reveal>
        </Section>

        {/* A "Process" band stood here — eyebrow, one heading, one paragraph and
            a link to /how-it-works. Removed at the owner's request. It was the
            third place on this page to summarise the same delivery process: the
            hero rail names the four stages, "How this actually runs" walks
            through them, and /how-it-works has all eight. The page still links
            there twice, so nothing is orphaned by its going. */}

        {/* ── Section 6: Featured Packages ────────────────── */}
        <Section className="bg-soft-panel border-y border-line">
          <Reveal>
            <SectionHeading
              eyebrow="Pricing"
              title={
                <>
                  Featured{" "}
                  <span className="font-accent font-normal text-accent">Packages</span>
                </>
              }
              subtitle="Transparent guide prices. Your final quote depends on scope, features, timeline and integrations — always confirmed in writing before any payment."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {featuredPackages.map((pkg, i) => (
              <Reveal variant="lift" key={pkg.name} delay={Math.min(i * 0.06, 0.3)}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 text-center">
              <Link href="/pricing" className="inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:text-accent-deep">
                View full pricing details <Icon name="arrow" className="size-4" />
              </Link>
            </p>
          </Reveal>

          {/* Instant estimate teaser — same data + 30% rule as the full form */}
          <Reveal delay={0.25}>
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="mb-6 text-center">
                <h3 className="text-title-1 text-ink">
                  Curious what <span className="font-accent font-normal text-accent">your project</span>{" "}
                  costs?
                </h3>
                <p className="mt-1.5 text-body-sm text-ink-soft">
                  Two taps for a guide price — exact quote comes from the smart form.
                </p>
              </div>
              <EstimateTeaser />
            </div>
          </Reveal>
        </Section>

        {/* ── Section 7: Why Choose Me ────────────────────── */}
        <Section className="bg-surface-ink text-on-ink">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="mb-4 flex items-center justify-center gap-2.5 text-micro font-mono uppercase text-on-ink-soft">
                Why Skilloura
              </p>
              <h2 className="text-display-2">
                Built on process,{" "}
                <span className="font-accent italic text-signal">not promises</span>
              </h2>
              <p className="mt-4 text-body-lg text-on-ink-soft">
                A clear, professional process from your first message to final delivery — one that protects your money and your time.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, i) => (
              <Reveal variant="depth" key={item.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="h-full rounded-card border border-line-on-ink bg-surface-ink-raised p-6 transition-colors hover:border-signal/40">
                  <span className="grid size-10 place-items-center rounded-chip bg-on-ink/10 text-signal">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-title-3">{item.title}</h3>
                  <p className="mt-2 text-body-sm text-on-ink-soft">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Founder profile and the team operating model. */}
        <Section className="bg-soft-panel border-y border-line">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1 text-micro font-mono uppercase text-ink-soft">
                Leadership at Skilloura
              </p>
              <h2 className="mt-4 text-display-2 tracking-tight leading-[1.14] text-ink">
                Founder-led vision, delivered by a{" "}
                <span className="font-accent font-normal text-accent">specialist team</span>
              </h2>
            </Reveal>

            <Reveal variant="fade" delay={0.05}>
              <div className="mt-8 grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-10 xl:gap-14 items-start">
                {/* Founder photo card */}
                <div className="mx-auto w-full max-w-sm rounded-panel border border-line bg-surface p-3 shadow-e2">
                  <Image
                    src="/sonam-das-founder-skilloura.webp"
                    alt="Sonam Das, founder of Skilloura"
                    width={360}
                    height={450}
                    className="aspect-[4/5] w-full rounded-2xl object-cover object-top"
                  />
                </div>

                {/* Founder bio card */}
                <div className="rounded-panel border border-line bg-surface p-7 sm:p-9 shadow-e3">
                  <p className="text-title-1 text-ink">Sonam Das</p>
                  <p className="text-body-sm font-semibold text-accent">Founder, Skilloura</p>
                  <p className="mt-1 text-body-sm text-ink-soft">
                    M.Tech, BITS Pilani · Technology, AI &amp; Digital Transformation
                  </p>

                  {/* Owner-supplied biography, replacing the earlier first-person
                      version. The ledger below still carries the terms, so this
                      stays positioning and never repeats them. */}
                  <p className="mt-4 text-body-base text-ink-soft">
                    Sonam Das is the Founder of Skilloura, a technology-driven digital services
                    company focused on helping businesses build, modernize, and operate reliable
                    digital solutions.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    With a professional background spanning enterprise IT, software systems, cloud
                    technologies, data engineering, and AI-driven automation, Sonam brings a
                    practical understanding of how technology must perform beyond development
                    environments — in real business operations, where reliability, security,
                    scalability, and accountability matter.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    His experience across enterprise technology environments has shaped his
                    approach to building Skilloura: combining strong engineering practices with
                    transparent execution, clearly defined project ownership, and measurable
                    business outcomes.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    Under his leadership, Skilloura focuses on delivering custom software, web and
                    mobile applications, AI-powered solutions, workflow automation, business
                    dashboards, and cloud-enabled systems designed around each client’s
                    operational requirements.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    Sonam’s vision is to establish Skilloura as a trusted technology partner for
                    businesses seeking dependable engineering, practical innovation, and
                    sustainable digital growth.
                  </p>

                  {/* The closing line is the one that should be remembered, so it
                      is set as a quotation rather than a sixth grey paragraph. */}
                  <blockquote className="mt-6 border-l-2 border-accent pl-5">
                    <p className="font-accent text-title-3 font-normal italic leading-snug text-ink">
                      “Technology should not only solve today’s challenges. It should create a
                      foundation businesses can confidently build upon tomorrow.”
                    </p>
                    <footer className="mt-3 text-body-sm font-semibold text-ink-soft">
                      — Sonam Das, Founder, Skilloura
                    </footer>
                  </blockquote>
                </div>
              </div>
            </Reveal>

            {/* ── The founder's commitments ─────────────────────
                Not a fourth grid of icon cards.

                This page already carried two of them making the same kind of
                claim: the dark band above promises no hidden charges, secure
                files, preview before delivery and maintenance; this promised
                ownership, human review, written scope and direct contact. Two
                sections, one page, the same trust argument in the same shape —
                and "written scope" appeared in both.

                These are one person's undertakings, so they read as a signed
                list rather than as product features. It is also the shape this
                brand actually owns: the whole differentiator is that you get
                things in writing before you pay, and a document is what that
                looks like. */}
            <Reveal variant="unfurl" delay={0.1}>
              <div className="mt-10">
                <p className="text-micro font-mono uppercase text-ink-muted">
                  What you get from our team, in writing
                </p>
                <dl className="mt-4 border-t border-line-strong">
                  {[
                    { t: "You own everything", d: "Code, content and accounts handed over to you. No vendor lock-in, no hostage files." },
                    { t: "Specialists review every build", d: "Architecture, security and testing are checked by the responsible project team." },
                    { t: "Nothing is charged before it is agreed", d: "The scope, the price and the dates are documented and approved first." },
                    { t: "A dedicated project channel", d: "Clear updates from the team responsible for planning and delivering your project." },
                  ].map((c) => (
                    <div
                      key={c.t}
                      className="grid gap-x-8 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,15rem)_1fr]"
                    >
                      <dt className="text-body-base font-semibold text-ink">{c.t}</dt>
                      <dd className="text-body-sm leading-relaxed text-ink-soft">{c.d}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ── Proof ─────────────────────────────────────────────
            One advancing panel, not a grid and not a lead-plus-list.

            The previous shape gave one review a large pull quote and ran the
            rest as a ledger beside it. It read as two unrelated things stacked,
            and in practice only the first review was ever seen. Every review
            now gets the same room and the panel moves through them on its own.

            The carousel is a client component because it has to hold an index
            and a timer; everything around it stays server-rendered. */}
        {testimonials.length > 0 && (
          <Section className="border-b border-line bg-soft-panel">
            {ratingSchema && <JsonLd data={ratingSchema} />}
            {/* The eyebrow, heading and standfirst moved inside ReviewCarousel.
                The section is one centred composition now, and splitting its
                header across two files meant the heading could not be centred
                against the stage it introduces. */}
            <Reveal variant="lift">
              <ReviewCarousel
                reviews={testimonials.map((t) => ({
                  id: t.id,
                  clientName: t.clientName,
                  clientBusiness: t.clientBusiness,
                  rating: t.rating,
                  review: t.review,
                }))}
              />
            </Reveal>
          </Section>
        )}

        {/* Honest early-stage note when there are no published reviews yet —
            transparent instead of fake reviews or an empty gap. */}
        {testimonials.length === 0 && (
          <Section className="bg-soft-panel border-b border-line">
            <Reveal>
              <div className="mx-auto max-w-2xl rounded-panel border border-line bg-surface p-8 text-center sm:p-10">
                <h2 className="text-display-3 tracking-tight text-ink">
                  Real proof, shared transparently
                </h2>
                <p className="mt-3 text-body-sm text-ink-soft">
                  Skilloura focuses on clear project proof instead of inflated claims. As client work
                  is completed, verified reviews and project outcomes will be added with proper
                  context. Until then, you can review the process, pricing clarity and delivery
                  standards before starting.
                </p>
                <Link
                  href="/start-project"
                  className="mt-6 tap-safe inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-semibold text-white hover:bg-accent-deep transition-colors"
                >
                  Start your project <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </Reveal>
          </Section>
        )}

        {/* ── Section 8: FAQ Preview ──────────────────────── */}
        <Section className="bg-wash-mint border-b border-line">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <SectionHeading
                center={false}
                eyebrow="FAQ"
                title={
                  <>
                    Questions?{" "}
                    <span className="font-accent font-normal text-accent">Answered.</span>
                  </>
                }
                subtitle="The most common questions before starting a project. More on the FAQ page."
              />
              <Link
                href="/faq"
                className="mt-6 tap-safe inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:text-accent-deep"
              >
                View all FAQs <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion faqs={homeFaqs} />
            </Reveal>
          </div>
        </Section>

        {/* The closing offer lives in the footer now — it appears on every
            page, so repeating it here made this the ninth near-identical
            gradient CTA panel on the site. */}
      </main>
      <Footer />
      <WhatsAppSticky />
      <MobileCtaBar />
    </>
  );
}
