import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppSticky from "@/components/WhatsAppSticky";
import MobileCtaBar from "@/components/MobileCtaBar";
import HomeHero from "@/components/heroes/HomeHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard, PackageCard } from "@/components/Cards";
import { serviceCategories, SECONDARY_SERVICE_SLUGS } from "@/lib/services";
import { homeFaqs } from "@/lib/faqs";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { createPublicClient } from "@/lib/supabase/public";
import EstimateTeaser from "@/components/EstimateTeaser";

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
    "Websites, apps and AI automation for growing businesses in India. Get a written scope, timeline and transparent quote before you pay anything. From ₹7,000.",
};

// Homepage shows a 4-step summary; the full 8-step process lives on
// /how-it-works. Voice kept consistently "we" (a small, personally-run studio).
const homeSteps = [
  { title: "Share your requirement", desc: "Pick a service and fill a smart form built for that project type — upload any files in one place." },
  { title: "Get a written scope & quote", desc: "We personally review every request and reply within 24 hours, with a clear written quote before any payment." },
  { title: "Approve & we build", desc: "A 40–50% advance starts the work. You approve a preview first, then revisions happen." },
  { title: "Delivery & handover", desc: "Final delivery with a clean, documented handover — files, access and everything you need to own it." },
];

// Impact / trust numbers — honest, capability-based stats (no fake client counts).
// Four facts about how this business runs. These used to carry a gradient
// tile and a coloured glow each — four more colour stories on a page that
// already had twelve in the rail.
const impactStats = [
  {
    num: 20,
    suffix: "+",
    label: "Digital services",
    desc: "Websites, apps, AI, design, video and more under one roof.",
  },
  {
    num: 50,
    suffix: "+",
    label: "Reference layouts & project ideas",
    desc: "Browse real reference layouts, automations and dashboards before work starts.",
    href: "/references",
  },
  {
    num: 24,
    suffix: "h",
    label: "Reply window",
    desc: "We reply within 24 hours — direct WhatsApp and email, no ticket queues.",
  },
  {
    num: 100,
    suffix: "%",
    label: "Clear requirement process",
    desc: "Written scope and quote before any payment, every time.",
  },
];

// Trimmed to 4 to cut mobile length and avoid repeating the "who's behind
// Skilloura" cards (ownership / scope / personal contact live there now).
const whyChoose = [
  { icon: "shield", title: "No hidden charges", desc: "The quoted price is the price. Any extra is always discussed and agreed first." },
  { icon: "shield", title: "Secure file handling", desc: "Your files stay private, linked only to your project — never public or shared." },
  { icon: "clock", title: "Preview before final delivery", desc: "You see and approve the work before the final payment — no nasty surprises." },
  { icon: "spark", title: "Maintenance support available", desc: "Monthly care plans from ₹1,999/month keep your project healthy after launch." },
];

// The twelve capabilities, as an index rather than a toy carousel. These used
// to be full-saturation rainbow gradient tiles — twelve different colour
// stories in one strip, which is the loudest thing the old homepage did and
// the first thing that read as template. Same twelve links, same hrefs; the
// colour now comes from one brand family and the hierarchy from typography.
const serviceRailItems = [
  { text: "WhatsApp Automation", icon: "whatsapp", href: "/start-project?service=ai-automation" },
  { text: "Logo & Branding", icon: "palette", href: "/start-project?service=logo-branding" },
  { text: "Video Editing", icon: "video", href: "/start-project?service=video-editing" },
  { text: "SEO & Marketing", icon: "megaphone", href: "/start-project?service=digital-marketing" },
  { text: "Power BI Dashboards", icon: "chart", href: "/start-project?service=data-dashboard" },
  { text: "ATS Resumes", icon: "file", href: "/start-project?service=resume-career" },
  { text: "Custom Software", icon: "code", href: "/start-project?service=custom-software" },
  { text: "Booking Systems", icon: "clock", href: "/start-project?service=website-development" },
  { text: "Business Websites", icon: "globe", href: "/start-project?service=website-development" },
  { text: "Mobile Apps", icon: "smartphone", href: "/start-project?service=mobile-app-development" },
  { text: "AI Chatbots", icon: "bot", href: "/start-project?service=ai-automation" },
  { text: "Ecommerce Stores", icon: "briefcase", href: "/start-project?service=website-development" },
];

const featuredPackages = [
  {
    name: "Basic Website",
    price: "₹7,000+",
    features: ["1–3 pages", "Mobile responsive", "Contact form", "WhatsApp button", "Basic SEO"],
    delivery: "3–5 days",
    revisions: "1 revision",
  },
  {
    name: "Business Website",
    price: "₹12,600+",
    features: ["5–8 pages", "Professional design", "Gallery + Google Maps", "WhatsApp integration", "Basic SEO"],
    delivery: "5–10 days",
    revisions: "2 revisions",
    highlighted: true,
  },
  {
    name: "Ecommerce Website",
    price: "₹24,500+",
    features: ["Product catalog", "Cart & checkout", "Payment gateway", "Admin panel", "SEO setup"],
    delivery: "10–20 days",
    revisions: "3 revisions",
  },
  {
    name: "AI Automation",
    price: "₹7,000+",
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
    .select("id, client_name, client_business, rating, review")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6);
  const testimonials = (testimonialRows ?? []).map((t) => ({
    id: t.id,
    clientName: t.client_name,
    clientBusiness: t.client_business,
    rating: t.rating,
    review: t.review,
  }));

  return (
    <>
      {/* Organization + WebSite + ProfessionalService JSON-LD is emitted once
          site-wide in app/layout.tsx — not repeated here (was a duplicate). */}
      <Header />
      <main id="main-content">
        {/* ── Section 1: Hero ─────────────────────────────── */}
        <HomeHero />

        {/* Service rail — nine real categories, drifting under the hero. */}
        <section className="relative overflow-hidden border-y border-line bg-surface-sunken">
          {/* The track is tripled for a seamless loop; only the FIRST copy is
              real to assistive tech and the keyboard — the two duplicates are
              aria-hidden and non-focusable, so screen readers and Tab don't
              hit every link three times. */}
          <div className="relative w-full overflow-hidden py-5 sm:py-6">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgb(224 145 63 / 0.07) 30%, rgb(14 82 87 / 0.06) 70%, transparent)",
              }}
              aria-hidden
            />
            <div className="relative flex w-max gap-3 px-4 animate-service-rail hover:[animation-play-state:paused] sm:gap-4 sm:px-5">
              {[...serviceRailItems, ...serviceRailItems, ...serviceRailItems].map((item, i) => {
                const dup = i >= serviceRailItems.length;
                return (
                <Link
                  key={item.text + i}
                  href={item.href}
                  aria-hidden={dup || undefined}
                  tabIndex={dup ? -1 : undefined}
                  className="card-lift group flex h-24 w-40 shrink-0 flex-col justify-between rounded-card border border-line bg-surface px-3.5 py-3 shadow-e1 sm:w-44"
                >
                  <span className="grid size-8 place-items-center rounded-chip bg-brand-soft text-brand">
                    {item.icon === "whatsapp" ? (
                      <WhatsAppIcon className="size-4" />
                    ) : (
                      <Icon name={item.icon} className="size-4" />
                    )}
                  </span>
                  <span className="font-display text-body-sm font-semibold leading-snug text-ink">
                    {item.text}
                  </span>
                </Link>
                );
              })}
            </div>
          </div>
        </section>

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
                className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:text-accent-deep"
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
        {/* Was four glassmorphic cards with per-stat gradient tiles and hover
            glow blobs — the exact combination the brief rules out. The numbers
            are the content, so they sit on the scope line and nothing else
            competes with them. */}
        <Section className="border-b border-line">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-micro font-mono uppercase text-ink-muted">Impact</p>
              <h2 className="mt-3 text-display-3 text-ink">
                How this actually{" "}
                <span className="font-accent italic text-brand">runs</span>
              </h2>
              <p className="mt-3 text-body-lg text-ink-soft">
                Every project starts with a written requirement and ends with a clean,
                documented handover.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="scope-line mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat) => {
                const body = (
                  <>
                    <dt className="font-mono text-display-3 tabular-nums text-ink">
                      {stat.num}
                      <span className="text-brand">{stat.suffix}</span>
                    </dt>
                    <dd className="mt-2 text-body-base font-semibold text-ink">{stat.label}</dd>
                    <dd className="mt-1 text-body-sm text-ink-soft">{stat.desc}</dd>
                  </>
                );
                return stat.href ? (
                  <Link
                    key={stat.label}
                    href={stat.href}
                    className="group block transition-colors hover:text-brand"
                  >
                    {body}
                    <span className="mt-2 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand">
                      See them
                      <Icon
                        name="arrow"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                ) : (
                  <div key={stat.label}>{body}</div>
                );
              })}
            </dl>
          </Reveal>
        </Section>

        {/* ── Section 4: Services Overview ────────────────── */}
        <Section padding="pt-14 sm:pt-16 pb-20 sm:pb-28" className="bg-soft-panel border-y border-line" id="services">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title={
                <>
                  Websites, AI systems &amp; the{" "}
                  <span className="font-accent font-normal text-accent">work around them</span>
                </>
              }
              subtitle="Our core focus is websites, AI automation and custom business systems — plus the design, marketing and content support to launch them. One clear process, one smart form per project type."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories
              .filter((s) => !SECONDARY_SERVICE_SLUGS.includes(s.slug))
              .map((s, i) => (
                <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.3)}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
          </div>

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

        {/* ── Section 5: How It Works (4-step summary; full 8 on /how-it-works) ── */}
        <Section id="how-it-works" className="bg-wash-mint border-b border-line">
          <Reveal>
            <SectionHeading
              eyebrow="Process"
              title={
                <>
                  From idea to delivery in{" "}
                  <span className="font-accent font-normal text-accent">4 simple steps</span>
                </>
              }
              subtitle="No confusion, no surprises — you always know exactly where your project stands. Every project ends with a clean, documented handover."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homeSteps.map((step, i) => (
              <Reveal key={step.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="card-lift relative h-full rounded-card border border-line bg-surface p-6">
                  <span className="font-mono text-display-3 text-line-strong">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-title-3 text-ink">{step.title}</h3>
                  <p className="mt-2 text-body-sm text-ink-soft">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 text-center">
              <Link href="/how-it-works" className="inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:text-accent-deep">
                See the full 8-step process <Icon name="arrow" className="size-4" />
              </Link>
            </p>
          </Reveal>
        </Section>

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
              <Reveal key={pkg.name} delay={Math.min(i * 0.06, 0.3)}>
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
              <Reveal key={item.title} delay={Math.min(i * 0.05, 0.25)}>
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

        {/* Who's behind Skilloura: real founder, human-accountable */}
        <Section className="bg-soft-panel border-y border-line">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1 text-micro font-mono uppercase text-ink-soft">
                Who&apos;s behind Skilloura
              </p>
              <h2 className="mt-4 text-display-2 tracking-tight leading-[1.14] text-ink">
                AI-enabled, but{" "}
                <span className="font-accent font-normal text-accent">human-accountable</span>
              </h2>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-8 grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-10 xl:gap-14 items-start">
                {/* Founder photo card */}
                <div className="mx-auto w-full max-w-sm rounded-panel border border-line bg-surface p-3 shadow-e2">
                  <Image
                    src="/founder.png"
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
                    M.Tech, BITS Pilani · ~10 years hands-on experience · 5+ years enterprise IT
                  </p>

                  <p className="mt-4 text-body-base text-ink-soft">
                    Hi, I&apos;m Sonam, founder of Skilloura.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    I built Skilloura to deliver digital projects with enterprise-level clarity,
                    founder-led accountability and professional execution. Every project here follows
                    a defined process: requirements are reviewed properly, scope is written before
                    payment, quotes are clear, previews are shared before final delivery, and handover
                    is managed professionally.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    Skilloura is backed by nearly a decade of hands-on experience across websites,
                    software systems, AI automation, dashboards, cloud-based solutions and digital
                    operations, along with 5+ years of enterprise IT experience and an M.Tech from
                    BITS Pilani.
                  </p>
                  <p className="mt-3 text-body-base text-ink-soft">
                    Skilloura runs on a different standard: a real written scope and quote before you
                    pay anything, a preview before the final payment, and a clean handover of code,
                    accounts and credentials, all yours. Communication stays direct: message on
                    WhatsApp and get a real answer, not a ticket bouncing between departments. We use
                    AI where it genuinely speeds things up, but every build goes through human review
                    and testing before it&apos;s delivered, accountable from the first message to
                    launch.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: "file", t: "You own everything", d: "Code, content and accounts handed over to you, no vendor lock-in." },
                  { icon: "shield", t: "Human review on every build", d: "Architecture, security and testing checked by a person, not just generated." },
                  { icon: "check", t: "Written scope before payment", d: "You approve exactly what's included before anything is charged." },
                  { icon: "spark", t: "Direct, real contact", d: "You get a real reply on WhatsApp, not a ticket queue or an autoresponder." },
                ].map((c) => (
                  <div key={c.t} className="rounded-card border border-line bg-surface p-5">
                    <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <h3 className="mt-3 text-body-sm font-semibold text-ink">{c.t}</h3>
                    <p className="mt-1 text-body-sm text-ink-soft">{c.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ── Real client reviews (only shown when they exist) ── */}
        {testimonials.length > 0 && (
          <Section className="bg-soft-panel border-b border-line">
            <Reveal>
              <SectionHeading
                eyebrow="Client reviews"
                title={
                  <>
                    What clients{" "}
                    <span className="font-accent font-normal text-accent">say</span>
                  </>
                }
                subtitle="Honest feedback from people we&apos;ve worked with."
              />
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i * 0.06, 0.3)}>
                  <div className="card-lift h-full rounded-card border border-line bg-canvas p-6">
                    <p className="text-warning text-title-2" aria-label={`${t.rating} out of 5 stars`}>
                      {"★".repeat(t.rating)}
                      <span className="text-line">{"★".repeat(5 - t.rating)}</span>
                    </p>
                    <p className="mt-3 text-body-sm text-ink-soft">&quot;{t.review}&quot;</p>
                    <p className="mt-4 text-body-sm font-semibold text-ink">
                      {t.clientName}
                      {t.clientBusiness && (
                        <span className="font-normal text-ink-soft"> · {t.clientBusiness}</span>
                      )}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
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
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-semibold text-white hover:bg-accent-deep transition-colors"
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
                className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-accent hover:text-accent-deep"
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
