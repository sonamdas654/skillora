import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppSticky from "@/components/WhatsAppSticky";
import Hero3DLoader from "@/components/Hero3DLoader";
import HeroMotion from "@/components/HeroMotion";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icons";
import FaqAccordion from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard, PackageCard } from "@/components/Cards";
import { serviceCategories } from "@/lib/services";
import { homeFaqs } from "@/lib/faqs";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/Header";
import { prisma } from "@/lib/db";
import JsonLd from "@/components/JsonLd";
import { professionalServiceSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/" },
};

const trustPoints = [
  "Clear pricing before work",
  "Preview before final delivery",
  "Secure file handling",
  "WhatsApp support",
  "Requirement-based custom solution",
];

const steps = [
  { title: "Select the service", desc: "Pick from 9 service categories — websites, apps, AI, design, marketing and more." },
  { title: "Fill the smart requirement form", desc: "Answer questions designed for your exact project type. No confusion." },
  { title: "Upload your files", desc: "Logo, images, videos or documents — everything in one secure place." },
  { title: "Submit your request", desc: "One click. You get instant confirmation on screen and email." },
  { title: "I review and contact you", desc: "Personal review of every request, reply within 24 hours on WhatsApp/email." },
  { title: "Scope, price and timeline finalized", desc: "Written quotation with exactly what's included. No hidden charges." },
  { title: "Advance payment and work start", desc: "40–50% advance and your project officially begins." },
  { title: "Preview, revision and final delivery", desc: "You approve a preview first, revisions happen, then full delivery." },
];

// Impact / trust numbers — honest, capability-based stats (no fake client counts).
const impactStats = [
  {
    value: "20+",
    label: "Digital Services",
    desc: "Websites, apps, AI, design, video and more under one roof.",
    icon: "spark",
    tile: "from-blue-500 to-indigo-600",
    glow: "rgba(40,87,255,0.35)",
  },
  {
    value: "50+",
    label: "Project Concepts",
    desc: "Ready reference designs to lock your vision before work starts.",
    icon: "palette",
    tile: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.35)",
  },
  {
    value: "24/7",
    label: "Support Ready",
    desc: "Direct WhatsApp and email access — no ticket queues.",
    icon: "clock",
    tile: "from-emerald-400 to-teal-600",
    glow: "rgba(16,185,129,0.35)",
  },
  {
    value: "100%",
    label: "Clear Requirement Process",
    desc: "Written scope and quote before any payment, every time.",
    icon: "check",
    tile: "from-sky-400 to-cyan-600",
    glow: "rgba(14,165,233,0.35)",
  },
];

const whyChoose = [
  { icon: "file", title: "Requirement-based development", desc: "Everything starts from your written requirement — so you get what you actually asked for." },
  { icon: "check", title: "Clear project scope", desc: "Scope, inclusions and exclusions in writing before any payment." },
  { icon: "shield", title: "No hidden charges", desc: "The quoted price is the price. Extras are always discussed first." },
  { icon: "spark", title: "WhatsApp support", desc: "Direct communication — no ticket systems, no waiting days for replies." },
  { icon: "shield", title: "Secure file handling", desc: "Your files stay private, linked only to your project." },
  { icon: "clock", title: "Preview before final delivery", desc: "You see and approve the work before final payment." },
  { icon: "check", title: "Professional delivery process", desc: "Documentation, credentials, training video — proper handover, every time." },
  { icon: "spark", title: "Maintenance support available", desc: "Monthly plans from ₹5,600 so your project stays healthy after launch." },
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
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <>
      <JsonLd data={professionalServiceSchema()} />
      <Header />
      <main>
        {/* ── Section 1: Hero ─────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow" aria-hidden />
          {/* Interactive motion backdrop — aurora ribbons + particle constellation */}
          <HeroMotion />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-8 sm:pb-10">
            <div className="flex flex-col items-center text-center">
              <div className="max-w-4xl flex flex-col items-center">
                <Reveal>
                  <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink-soft shadow-sm">
                    <span className="size-2 rounded-full bg-mint animate-pulse" />
                    Accepting new projects
                  </p>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.08] text-ink max-w-4xl">
                    Get Your Website, App,{" "}
                    <span className="bg-gradient-to-r from-accent via-indigo-600 to-mint bg-clip-text font-accent font-normal text-transparent">
                      AI Automation
                    </span>
                    , Design and Digital Work Done in{" "}
                    <span className="bg-gradient-to-r from-accent via-indigo-600 to-accent bg-clip-text text-transparent">
                      One Place.
                    </span>
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="mt-6 max-w-2xl text-base sm:text-lg leading-7 text-ink-soft mx-auto">
                    Tell me your requirement clearly through a smart project form. Upload your
                    logo, images, videos, documents and references. I will review your project
                    and contact you on WhatsApp or email with the best solution.
                  </p>
                </Reveal>
                <Reveal delay={0.24}>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href="/start-project"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_-10px_rgba(40,87,255,0.7)] hover:bg-accent-deep hover:scale-[1.02] transition-all"
                    >
                      Submit Project Requirement
                      <Icon name="arrow" className="size-5" />
                    </Link>
                    <a
                      href={whatsappLink("Hi! I want to discuss a project.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-base font-semibold text-ink hover:border-mint hover:text-mint transition-colors"
                    >
                      <WhatsAppIcon className="size-5 text-mint" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </Reveal>
                <Reveal delay={0.32}>
                  <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
                    {trustPoints.map((t) => (
                      <li key={t} className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
                        <Icon name="check" className="size-4 text-mint" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>

          {/* Full-width gradient service rail — floats over the hero backdrop */}
          <div className="relative w-screen overflow-hidden py-6 sm:py-8">
            <div className="flex w-max gap-4 px-4 animate-service-rail hover:[animation-play-state:paused] sm:gap-5 sm:px-5">
              {[...serviceRailItems, ...serviceRailItems, ...serviceRailItems].map((item, i) => (
                <Link
                  key={item.text + i}
                  href={item.href}
                  className={`flex h-[118px] w-[162px] shrink-0 flex-col items-center justify-center rounded-3xl px-3 text-center text-white ring-1 ring-white/25 transition duration-300 hover:-translate-y-1.5 hover:-rotate-1 hover:brightness-110 sm:h-[132px] sm:w-[178px] lg:w-[188px] ${item.card}`}
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
                    {item.icon === "whatsapp" ? (
                      <WhatsAppIcon className="size-7 text-white" />
                    ) : (
                      <Icon name={item.icon} className="size-7 text-white" />
                    )}
                  </span>
                  <span className="mt-3 text-[15px] font-extrabold leading-[1.12] tracking-normal drop-shadow-sm sm:text-base">
                    {item.text}
                  </span>
                </Link>
              ))}
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
              {impactStats.map((stat, i) => (
                <Reveal key={stat.label} delay={Math.min(i * 0.07, 0.28)}>
                  <div
                    className="group relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-7 text-center shadow-[0_24px_55px_-30px_rgba(15,23,42,0.3)] ring-1 ring-line/60 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5"
                    style={{ ["--stat-glow" as string]: stat.glow }}
                  >
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
                    <p className="relative mt-5 text-4xl font-extrabold tracking-tight text-ink">
                      {stat.value}
                    </p>
                    <p className="relative mt-1.5 text-sm font-bold uppercase tracking-wide text-ink">
                      {stat.label}
                    </p>
                    <p className="relative mt-2 text-sm leading-6 text-ink-soft">{stat.desc}</p>
                  </div>
                </Reveal>
              ))}
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
                  Digital Services You Can{" "}
                  <span className="font-accent font-normal text-accent">Request</span>
                </>
              }
              subtitle="Nine service categories, one clear process. Every card leads to a smart form built for that project type."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((s, i) => (
              <Reveal key={s.slug} delay={Math.min(i * 0.06, 0.3)}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </Section>

        {/* ── Section 5: How It Works ─────────────────────── */}
        <Section id="how-it-works" className="bg-wash-mint border-b border-line">
          <Reveal>
            <SectionHeading
              eyebrow="Process"
              title={
                <>
                  From idea to delivery in{" "}
                  <span className="font-accent font-normal text-accent">8 clear steps</span>
                </>
              }
              subtitle="No confusion, no surprises. You always know exactly where your project stands."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
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
              subtitle="Guide prices follow the same live-estimate rule: Skilloura is kept about 30% below market benchmark, then final quote is adjusted by selected scope."
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
                No fake reviews, no inflated numbers. Just a professional working process that protects your money and your time.
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
                subtitle="Real reviews from real projects — never purchased, never faked."
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
                  Submit your requirement now and I will review it properly before sharing the
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
    </>
  );
}
