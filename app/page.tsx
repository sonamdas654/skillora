import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppSticky from "@/components/WhatsAppSticky";
import MobileCtaBar from "@/components/MobileCtaBar";
import HeroMotion from "@/components/HeroMotion";
import HeroOrb from "@/components/HeroOrb";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard, PackageCard } from "@/components/Cards";
import { serviceCategories, SECONDARY_SERVICE_SLUGS } from "@/lib/services";
import { homeFaqs } from "@/lib/faqs";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import CountUp from "@/components/CountUp";
import EstimateTeaser from "@/components/EstimateTeaser";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/" },
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
const impactStats = [
  {
    num: 20,
    suffix: "+",
    label: "Digital Services",
    desc: "Websites, apps, AI, design, video and more under one roof.",
    icon: "spark",
    tile: "from-blue-500 to-indigo-600",
    glow: "rgba(40,87,255,0.35)",
  },
  {
    num: 50,
    suffix: "+",
    label: "Reference Layouts & Project Ideas",
    desc: "Browse real reference layouts, automations and dashboards before work starts.",
    icon: "palette",
    tile: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.35)",
    href: "/references",
  },
  {
    num: 24,
    suffix: "h",
    label: "Reply Window",
    desc: "We reply within 24 hours — direct WhatsApp and email, no ticket queues.",
    icon: "clock",
    tile: "from-emerald-400 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
  },
  {
    num: 100,
    suffix: "%",
    label: "Clear Requirement Process",
    desc: "Written scope and quote before any payment, every time.",
    icon: "check",
    tile: "from-sky-400 to-cyan-600",
    glow: "rgba(14,165,233,0.35)",
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

// Every rail card carries its own full gradient (Power BI / Custom Software
// style) — icon sits in a frosted white tile, text stays white.
const serviceRailItems = [
  {
    text: "WhatsApp Automation",
    icon: "whatsapp",
    href: "/start-project?service=ai-automation",
    card: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-[0_22px_42px_-24px_rgba(16,185,129,0.9)]",
  },
  {
    text: "Logo & Branding",
    icon: "palette",
    href: "/start-project?service=logo-branding",
    card: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-[0_22px_42px_-24px_rgba(249,115,22,0.9)]",
  },
  {
    text: "Video Editing",
    icon: "video",
    href: "/start-project?service=video-editing",
    card: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 shadow-[0_22px_42px_-24px_rgba(236,72,153,0.9)]",
  },
  {
    text: "SEO & Marketing",
    icon: "megaphone",
    href: "/start-project?service=digital-marketing",
    card: "bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 shadow-[0_22px_42px_-24px_rgba(6,182,212,0.9)]",
  },
  {
    text: "Power BI Dashboards",
    icon: "chart",
    href: "/start-project?service=data-dashboard",
    card: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-[0_22px_42px_-24px_rgba(40,87,255,0.9)]",
  },
  {
    text: "ATS Resumes",
    icon: "file",
    href: "/start-project?service=resume-career",
    card: "bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 shadow-[0_22px_42px_-24px_rgba(14,165,233,0.9)]",
  },
  {
    text: "Custom Software",
    icon: "code",
    href: "/start-project?service=custom-software",
    card: "bg-gradient-to-br from-violet-500 via-indigo-600 to-purple-700 shadow-[0_22px_42px_-24px_rgba(109,40,217,0.88)]",
  },
  {
    text: "Booking Systems",
    icon: "clock",
    href: "/start-project?service=website-development",
    card: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 shadow-[0_22px_42px_-24px_rgba(244,63,94,0.9)]",
  },
  {
    text: "Business Websites",
    icon: "globe",
    href: "/start-project?service=website-development",
    card: "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 shadow-[0_22px_42px_-24px_rgba(59,130,246,0.9)]",
  },
  {
    text: "Mobile Apps",
    icon: "smartphone",
    href: "/start-project?service=mobile-app-development",
    card: "bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600 shadow-[0_22px_42px_-24px_rgba(236,72,153,0.9)]",
  },
  {
    text: "AI Chatbots",
    icon: "bot",
    href: "/start-project?service=ai-automation",
    card: "bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 shadow-[0_22px_42px_-24px_rgba(139,92,246,0.9)]",
  },
  {
    text: "Ecommerce Stores",
    icon: "briefcase",
    href: "/start-project?service=website-development",
    card: "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 shadow-[0_22px_42px_-24px_rgba(249,115,22,0.9)]",
  },
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
  const supabase = await createClient();
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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow" aria-hidden />
          {/* Interactive motion backdrop — aurora ribbons + particle constellation */}
          <HeroMotion />
          <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-8 sm:pb-10">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Left — value proposition. Uses CSS .rise (not JS Reveal) so it
                  paints immediately on first load and never sits blank on mobile. */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-sm">
                  <span className="size-2 rounded-full bg-mint animate-pulse" />
                  Accepting new projects
                </p>
                <h1 className="rise mt-6 text-4xl sm:text-5xl lg:text-[3.3rem] font-extrabold tracking-tight leading-[1.08] text-ink" style={{ ["--rise-delay" as string]: "80ms" }}>
                  Websites &amp; AI systems that help growing businesses{" "}
                  <span className="bg-gradient-to-r from-accent via-indigo-600 to-mint bg-clip-text text-transparent">
                    get more leads and save manual work
                  </span>
                </h1>
                <p className="rise mt-6 max-w-xl text-base sm:text-lg leading-7 text-ink-soft" style={{ ["--rise-delay" as string]: "160ms" }}>
                  Share your requirement once — get a written scope, timeline and transparent quote
                  before any payment.
                </p>
                <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start" style={{ ["--rise-delay" as string]: "240ms" }}>
                  <Link
                    href="/start-project"
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_-10px_rgba(40,87,255,0.7)] hover:bg-accent-deep hover:scale-[1.02] transition-all"
                  >
                    Get My Project Plan
                    <Icon name="arrow" className="size-5" />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-base font-semibold text-ink hover:border-accent hover:text-accent transition-colors"
                  >
                    See How It Works
                  </Link>
                </div>
                <ul className="rise mt-9 grid grid-cols-2 gap-x-6 gap-y-3 text-left" style={{ ["--rise-delay" as string]: "320ms" }}>
                  {["Fast Turnaround", "Transparent Pricing", "Expert Support", "Written Scope Before Payment"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
                      <Icon name="check" className="size-4 shrink-0 text-mint" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — premium Skilloura orb + floating service cards */}
              <div className="rise w-full" style={{ ["--rise-delay" as string]: "200ms" }}>
                <HeroOrb />
              </div>
            </div>
          </div>

          {/* Full-width gradient service rail — floats over the hero backdrop.
              The track is tripled for a seamless marquee loop; only the FIRST
              copy is real to assistive tech + keyboard — the two duplicates are
              aria-hidden and non-focusable so screen readers and Tab don't hit
              every link three times. */}
          <div className="relative w-screen overflow-hidden py-5 sm:py-6">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(40,87,255,0.05) 30%, rgba(139,92,246,0.05) 60%, rgba(16,185,129,0.05))",
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
                  className={`flex h-[94px] w-[132px] shrink-0 flex-col items-center justify-center rounded-2xl px-2.5 text-center text-white ring-1 ring-white/25 transition duration-300 hover:-translate-y-1.5 hover:-rotate-1 hover:brightness-110 sm:h-[104px] sm:w-[144px] lg:w-[152px] ${item.card}`}
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                    {item.icon === "whatsapp" ? (
                      <WhatsAppIcon className="size-5 text-white" />
                    ) : (
                      <Icon name={item.icon} className="size-5 text-white" />
                    )}
                  </span>
                  <span className="mt-2 text-[13px] font-extrabold leading-[1.12] tracking-normal drop-shadow-sm sm:text-sm">
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
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-deep"
              >
                See how the process works <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)]">
                <div className="space-y-4">
                  {[
                    { text: "“I need a website... something nice... you decide”" },
                    { text: "20 WhatsApp voice notes, zero clear requirements" },
                    { text: "Wrong quotation → arguments → project stuck" },
                  ].map((row) => (
                    <div key={row.text} className="flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-red-100 text-red-500 text-xs font-bold">✕</span>
                      <p className="text-sm text-ink-soft">{row.text}</p>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 rounded-xl bg-mint/10 px-4 py-3.5 border border-mint/20">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-mint text-white">
                      <Icon name="check" className="size-3" />
                    </span>
                    <p className="text-sm font-medium text-ink">
                      Smart form → clear requirement → correct quote → smooth delivery. That&apos;s the Skilloura way.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ── Section 3: Impact / Trust Numbers ───────────── */}
        <Section
          padding="py-16 sm:py-20"
          className="relative overflow-hidden border-b border-line bg-gradient-to-b from-[#f4f8ff] via-[#f9fbff] to-[#f1f9f5]"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 65% at 10% 5%, rgba(40,87,255,0.09), transparent 60%), radial-gradient(45% 60% at 90% 95%, rgba(16,185,129,0.09), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative">
            <Reveal>
              <SectionHeading
                eyebrow="Impact"
                title={
                  <>
                    Skilloura Impact in{" "}
                    <span className="font-accent font-normal text-accent">Numbers</span>
                  </>
                }
                subtitle="Measurable digital delivery — every project starts with a written requirement and ends with a clean, documented handover."
              />
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat, i) => {
                const cardCls =
                  "group relative block h-full overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-7 text-center shadow-[0_24px_55px_-30px_rgba(15,23,42,0.3)] ring-1 ring-line/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5";
                const cardStyle = { ["--stat-glow" as string]: stat.glow };
                const cardInner = (
                  <>
                    <div
                      className="pointer-events-none absolute inset-x-0 -top-16 h-32 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: "radial-gradient(60% 100% at 50% 0%, var(--stat-glow), transparent 70%)" }}
                      aria-hidden
                    />
                    <span
                      className={`relative mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-[0_14px_28px_-12px_var(--stat-glow)] ring-1 ring-white/40 ${stat.tile}`}
                    >
                      <Icon name={stat.icon} className="size-6" />
                    </span>
                    <p className="relative mt-5 text-4xl font-extrabold tracking-tight text-ink tabular-nums">
                      <CountUp value={stat.num} suffix={stat.suffix} />
                    </p>
                    <p className="relative mt-1.5 text-sm font-bold uppercase tracking-wide text-ink">
                      {stat.label}
                    </p>
                    <p className="relative mt-2 text-sm leading-6 text-ink-soft">{stat.desc}</p>
                  </>
                );
                return (
                  <Reveal key={stat.label} delay={Math.min(i * 0.07, 0.28)}>
                    {stat.href ? (
                      <Link href={stat.href} className={cardCls} style={cardStyle}>
                        {cardInner}
                      </Link>
                    ) : (
                      <div className={cardCls} style={cardStyle}>
                        {cardInner}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
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
            <div className="mt-14 rounded-3xl border border-line bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">Additional services</p>
                  <h3 className="mt-1 text-lg font-bold text-ink">Also available alongside your project</h3>
                </div>
                <p className="text-sm text-ink-soft">Often added on to a website or system build.</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {serviceCategories
                  .filter((s) => SECONDARY_SERVICE_SLUGS.includes(s.slug))
                  .map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="card-lift flex items-center gap-3 rounded-2xl border border-line bg-background px-4 py-3.5 hover:border-accent/40"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Icon name={s.icon} className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-ink">{s.name}</span>
                        <span className="block truncate text-xs text-ink-soft">{s.outcome}</span>
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
                <div className="card-lift relative h-full rounded-2xl border border-line bg-white p-6">
                  <span className="text-4xl font-extrabold text-accent/15">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 text-center">
              <Link href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-deep">
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
              <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-deep">
                View full pricing details <Icon name="arrow" className="size-4" />
              </Link>
            </p>
          </Reveal>

          {/* Instant estimate teaser — same data + 30% rule as the full form */}
          <Reveal delay={0.25}>
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="mb-6 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-ink">
                  Curious what <span className="font-accent font-normal text-accent">your project</span>{" "}
                  costs?
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Two taps for a guide price — exact quote comes from the smart form.
                </p>
              </div>
              <EstimateTeaser />
            </div>
          </Reveal>
        </Section>

        {/* ── Section 7: Why Choose Me ────────────────────── */}
        <Section className="bg-ink text-white">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Why Skilloura
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.12]">
                Built on process,{" "}
                <span className="font-accent font-normal text-[#8fa8ff]">not promises</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-7 text-white/70">
                A clear, professional process from your first message to final delivery — one that protects your money and your time.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/10">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent/20 text-[#8fa8ff]">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Who's behind Skilloura: real founder, human-accountable */}
        <Section className="bg-soft-panel border-y border-line">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Who&apos;s behind Skilloura
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight leading-[1.14] text-ink">
                AI-enabled, but{" "}
                <span className="font-accent font-normal text-accent">human-accountable</span>
              </h2>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-8 grid gap-6 sm:gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:gap-10 lg:gap-14 items-start">
                {/* Founder photo card */}
                <div className="mx-auto w-full max-w-[360px] rounded-3xl border border-line bg-white p-3 shadow-[0_20px_50px_-24px_rgba(11,19,48,0.18)]">
                  <Image
                    src="/founder.png"
                    alt="Sonam Das, founder of Skilloura"
                    width={360}
                    height={450}
                    className="aspect-[4/5] w-full rounded-2xl object-cover object-top"
                  />
                </div>

                {/* Founder bio card */}
                <div className="rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-[0_24px_60px_-30px_rgba(11,19,48,0.2)]">
                  <p className="text-xl font-bold text-ink">Sonam Das</p>
                  <p className="text-sm font-semibold text-accent">Founder, Skilloura</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    M.Tech, BITS Pilani · ~10 years hands-on experience · 5+ years enterprise IT
                  </p>

                  <p className="mt-4 text-base leading-7 text-ink-soft">
                    Hi, I&apos;m Sonam, founder of Skilloura.
                  </p>
                  <p className="mt-3 text-base leading-7 text-ink-soft">
                    I built Skilloura to deliver digital projects with enterprise-level clarity,
                    founder-led accountability and professional execution. Every project here follows
                    a defined process: requirements are reviewed properly, scope is written before
                    payment, quotes are clear, previews are shared before final delivery, and handover
                    is managed professionally.
                  </p>
                  <p className="mt-3 text-base leading-7 text-ink-soft">
                    Skilloura is backed by nearly a decade of hands-on experience across websites,
                    software systems, AI automation, dashboards, cloud-based solutions and digital
                    operations, along with 5+ years of enterprise IT experience and an M.Tech from
                    BITS Pilani.
                  </p>
                  <p className="mt-3 text-base leading-7 text-ink-soft">
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
                  <div key={c.t} className="rounded-2xl border border-line bg-white p-5">
                    <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-ink">{c.t}</h3>
                    <p className="mt-1 text-xs leading-5 text-ink-soft">{c.d}</p>
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
                  <div className="card-lift h-full rounded-2xl border border-line bg-background p-6">
                    <p className="text-amber-500 text-lg" aria-label={`${t.rating} out of 5 stars`}>
                      {"★".repeat(t.rating)}
                      <span className="text-line">{"★".repeat(5 - t.rating)}</span>
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ink-soft">&quot;{t.review}&quot;</p>
                    <p className="mt-4 text-sm font-bold text-ink">
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
              <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-8 text-center sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                  Real proof, shared transparently
                </h2>
                <p className="mt-3 text-sm leading-7 text-ink-soft">
                  Skilloura focuses on clear project proof instead of inflated claims. As client work
                  is completed, verified reviews and project outcomes will be added with proper
                  context. Until then, you can review the process, pricing clarity and delivery
                  standards before starting.
                </p>
                <Link
                  href="/start-project"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors"
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
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-deep"
              >
                View all FAQs <Icon name="arrow" className="size-4" />
              </Link>
            </Reveal>
            <Reveal delay={0.1}>
              <FaqAccordion faqs={homeFaqs} />
            </Reveal>
          </div>
        </Section>

        {/* ── Section 9: Final CTA ────────────────────────── */}
        <Section className="pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-accent-deep px-6 py-14 sm:px-12 sm:py-20 text-center text-white shadow-[0_30px_80px_-30px_rgba(40,87,255,0.6)]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 80% at 20% 10%, rgba(255,255,255,0.16), transparent 60%), radial-gradient(50% 70% at 85% 90%, rgba(255,255,255,0.12), transparent 60%)",
                }}
                aria-hidden
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
                  Ready to start your{" "}
                  <span className="font-accent font-normal">digital project?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/85">
                  Submit your requirement now and we will review it properly before sharing the
                  best solution, pricing and timeline.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/start-project"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-bold text-accent hover:scale-[1.03] transition-transform"
                  >
                    Submit Project Requirement
                    <Icon name="arrow" className="size-5" />
                  </Link>
                  <a
                    href={whatsappLink("Hi! I'm ready to start my project.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <WhatsAppIcon className="size-5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
      <WhatsAppSticky />
      <MobileCtaBar />
    </>
  );
}
