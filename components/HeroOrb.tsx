import Image from "next/image";
import Icon from "./Icons";
import { WhatsAppIcon } from "./Header";

// Premium hero visual: a big glowing "Skilloura orb" (the brand mark inside a
// 3D gradient sphere with halo + rotating orbit ring) surrounded by floating
// service chips and four glass "flow" cards — WhatsApp reply, smart project
// form, written-scope preview and a live project-health dashboard. Pure
// CSS/visual — rich on desktop, cleanly simplified on mobile.

const services: { label: string; icon: string; pos: string; delay: string }[] = [
  { label: "Website Design", icon: "globe", pos: "left-2 top-28", delay: "0s" },
  { label: "App Development", icon: "smartphone", pos: "right-2 top-40", delay: "0.6s" },
  { label: "AI Automation", icon: "bot", pos: "-left-2 top-1/2 -translate-y-1/2", delay: "1.2s" },
  { label: "Branding", icon: "palette", pos: "-right-1 top-1/2 -translate-y-1/2", delay: "0.9s" },
  { label: "SEO & Marketing", icon: "megaphone", pos: "left-6 bottom-44", delay: "0.3s" },
  { label: "Maintenance", icon: "clock", pos: "right-8 bottom-52", delay: "1.5s" },
];

function ServiceCard({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[16px] border border-white/80 bg-white/85 px-3 py-2 shadow-[0_16px_36px_-22px_rgba(15,23,42,0.4)] ring-1 ring-line/50 backdrop-blur-md">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon name={icon} className="size-4" />
      </span>
      <span className="whitespace-nowrap text-xs font-bold text-ink">{label}</span>
    </div>
  );
}

// Central 3D brand orb — layered glow, glossy sphere, halo and a slowly
// rotating conic orbit ring for depth and motion.
function Orb() {
  return (
    <div className="relative grid size-52 place-items-center">
      {/* soft outer glow */}
      <span
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(37,99,235,0.6), rgba(139,92,246,0.4) 52%, rgba(16,185,129,0.18) 78%, transparent)",
        }}
        aria-hidden
      />
      {/* rotating orbit ring */}
      <span
        className="animate-spin-slow absolute inset-1 rounded-full opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(37,99,235,0.55) 60deg, transparent 130deg, transparent 230deg, rgba(16,185,129,0.5) 300deg, transparent 360deg)",
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
        }}
        aria-hidden
      />
      {/* halo ring */}
      <span className="absolute inset-3 rounded-full ring-1 ring-white/50" aria-hidden />
      {/* glossy sphere */}
      <div
        className="relative grid size-40 place-items-center rounded-full ring-1 ring-white/60 shadow-[0_36px_70px_-26px_rgba(37,99,235,0.75),inset_0_3px_18px_rgba(255,255,255,0.7)]"
        style={{
          background:
            "radial-gradient(circle at 34% 26%, #ffffff 0%, #e8efff 20%, #bcd0ff 44%, #8ea6ff 66%, #6d7bf0 100%)",
        }}
      >
        {/* top gloss highlight */}
        <span
          className="pointer-events-none absolute left-1/2 top-3 h-10 w-24 -translate-x-1/2 rounded-full blur-md"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.85), transparent)" }}
          aria-hidden
        />
        <Image
          src="/logo-mark.png"
          alt="Skilloura"
          width={120}
          height={120}
          className="relative size-24 object-contain drop-shadow-[0_6px_14px_rgba(37,99,235,0.4)]"
        />
      </div>
      {/* contact reflection for 3D grounding */}
      <span
        className="absolute -bottom-4 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full blur-md"
        style={{ background: "radial-gradient(closest-side, rgba(37,99,235,0.3), transparent)" }}
        aria-hidden
      />
    </div>
  );
}

// Smart project-form preview — signals the one-form, quote-first flow.
function SmartFormPreview() {
  return (
    <div className="w-44 rounded-[18px] border border-white/80 bg-white/90 p-3.5 shadow-[0_20px_44px_-22px_rgba(37,99,235,0.55)] ring-1 ring-line/50 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <span className="grid size-5 place-items-center rounded-md bg-accent-soft text-accent">
          <Icon name="spark" className="size-3" />
        </span>
        <p className="text-[11px] font-bold text-ink">New project request</p>
      </div>
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5">
          <span className="text-[9px] font-semibold text-ink-soft">Service</span>
          <span className="text-[9px] font-bold text-ink">Website + App</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-background px-2.5 py-1.5">
          <span className="text-[9px] font-semibold text-ink-soft">Budget</span>
          <span className="text-[9px] font-bold text-ink">₹50k–1L</span>
        </div>
      </div>
      <div className="mt-2.5 grid place-items-center rounded-lg bg-accent py-2 text-[10px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.9)]">
        Get free quote →
      </div>
    </div>
  );
}

// Written scope preview — the "clarity before payment" promise, made visual.
function ScopePreview() {
  const items = ["6-page business website", "WhatsApp automation", "Payment gateway"];
  return (
    <div className="w-56 rounded-[20px] border border-white/80 bg-white/92 p-4 shadow-[0_26px_54px_-26px_rgba(37,99,235,0.6)] ring-1 ring-accent/15 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-ink">Written Scope Preview</span>
        <span className="rounded-full bg-mint/10 px-2 py-0.5 text-[9px] font-bold text-mint">
          Before payment
        </span>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
            <Icon name="check" className="size-3 shrink-0 text-mint" />
            {it}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-end justify-between border-t border-line pt-2.5">
        <p className="text-lg font-extrabold tracking-tight text-ink">
          ₹12,600<span className="text-xs font-bold text-accent">+</span>
        </p>
        <span className="text-[10px] font-semibold text-ink-soft">5–10 days</span>
      </div>
    </div>
  );
}

// Live project-health dashboard — small KPIs + a mini chart.
function DashboardPreview() {
  const bars = [40, 60, 50, 75, 68, 90];
  return (
    <div className="w-44 rounded-[18px] border border-white/80 bg-white/90 p-3.5 shadow-[0_18px_40px_-22px_rgba(15,23,42,0.42)] ring-1 ring-line/50 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-ink">Project Health</p>
        <span className="flex items-center gap-1 text-[8px] font-bold text-mint">
          <span className="size-1.5 rounded-full bg-mint" /> Live
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-background px-2 py-1.5">
          <p className="text-sm font-extrabold text-ink">98%</p>
          <p className="text-[8px] font-semibold text-ink-soft">On-time</p>
        </div>
        <div className="rounded-lg bg-background px-2 py-1.5">
          <p className="text-sm font-extrabold text-ink">4.9★</p>
          <p className="text-[8px] font-semibold text-ink-soft">Rating</p>
        </div>
      </div>
      <div className="mt-2 flex h-8 items-end gap-1">
        {bars.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-accent/30 to-accent"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function WhatsAppBubble() {
  return (
    <div className="flex items-center gap-2 rounded-[18px] rounded-tl-sm border border-mint/25 bg-mint/10 px-3 py-2 shadow-[0_16px_36px_-22px_rgba(16,185,129,0.7)] backdrop-blur-md">
      <span className="grid size-6 place-items-center rounded-full bg-mint text-white">
        <WhatsAppIcon className="size-3.5" />
      </span>
      <span className="text-[11px] font-semibold text-ink">Reviewed — scope ready ✓</span>
    </div>
  );
}

export default function HeroOrb() {
  return (
    <div className="relative w-full">
      {/* Soft gradient glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 45% at 60% 32%, rgba(37,99,235,0.16), transparent 70%), radial-gradient(40% 40% at 25% 82%, rgba(16,185,129,0.13), transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Desktop: full immersive composition ── */}
      <div className="relative mx-auto hidden h-[600px] w-full max-w-lg lg:block">
        {/* orb centered */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="animate-float">
            <Orb />
          </div>
        </div>

        {/* service chips floating around */}
        {services.map((s) => (
          <div
            key={s.label}
            className={`absolute animate-float ${s.pos}`}
            style={{ animationDelay: s.delay }}
          >
            <ServiceCard label={s.label} icon={s.icon} />
          </div>
        ))}

        {/* WhatsApp reply — top left */}
        <div className="absolute left-0 top-1 animate-float" style={{ animationDelay: "0.4s" }}>
          <WhatsAppBubble />
        </div>

        {/* Live dashboard — top right */}
        <div className="absolute -right-3 top-3 animate-float" style={{ animationDelay: "1.3s" }}>
          <DashboardPreview />
        </div>

        {/* Smart form preview — bottom left */}
        <div className="absolute -left-4 bottom-3 animate-float" style={{ animationDelay: "0.8s" }}>
          <SmartFormPreview />
        </div>

        {/* Written scope preview — bottom right */}
        <div className="absolute -right-3 bottom-1 animate-float" style={{ animationDelay: "1.1s" }}>
          <ScopePreview />
        </div>
      </div>

      {/* ── Mobile / tablet: clean simplified version ── */}
      <div className="lg:hidden">
        <div className="flex justify-center">
          <div className="animate-float">
            <Orb />
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <ServiceCard key={s.label} label={s.label} icon={s.icon} />
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-3">
          <WhatsAppBubble />
          <ScopePreview />
        </div>
      </div>
    </div>
  );
}
