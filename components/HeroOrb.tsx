import Image from "next/image";
import Icon from "./Icons";
import { WhatsAppIcon } from "./Header";

// Premium hero visual: a glowing "Skilloura orb" (the brand mark inside a
// gradient sphere) surrounded by floating service cards, plus small accent
// cards (WhatsApp reply, written quote, mini dashboard). Pure CSS/visual —
// rich on desktop, cleanly simplified on mobile.

const services: { label: string; icon: string; pos: string; delay: string }[] = [
  { label: "Website Design", icon: "globe", pos: "left-0 top-10", delay: "0s" },
  { label: "App Development", icon: "smartphone", pos: "right-0 top-20", delay: "0.6s" },
  { label: "AI Automation", icon: "bot", pos: "-left-2 top-1/2 -translate-y-1/2", delay: "1.2s" },
  { label: "Branding", icon: "palette", pos: "right-0 top-1/2 -translate-y-1/2", delay: "0.9s" },
  { label: "SEO & Marketing", icon: "megaphone", pos: "left-10 bottom-44", delay: "0.3s" },
  { label: "Maintenance", icon: "clock", pos: "right-6 bottom-6", delay: "1.5s" },
];

function ServiceCard({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[18px] border border-white/80 bg-white/85 px-3 py-2 shadow-[0_16px_36px_-22px_rgba(15,23,42,0.4)] ring-1 ring-line/50 backdrop-blur-md">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
        <Icon name={icon} className="size-4" />
      </span>
      <span className="whitespace-nowrap text-xs font-bold text-ink">{label}</span>
    </div>
  );
}

// Compact "new project request" form preview — signals the one-form,
// quote-first flow right inside the hero art.
function SmartFormPreview() {
  return (
    <div className="w-40 rounded-[18px] border border-white/80 bg-white/90 p-3 shadow-[0_18px_40px_-22px_rgba(37,99,235,0.5)] ring-1 ring-line/50 backdrop-blur-md">
      <div className="flex items-center gap-1.5">
        <span className="grid size-5 place-items-center rounded-md bg-accent-soft text-accent">
          <Icon name="spark" className="size-3" />
        </span>
        <p className="text-[10px] font-bold text-ink">New project request</p>
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between rounded-lg bg-background px-2 py-1">
          <span className="text-[9px] font-semibold text-ink-soft">Service</span>
          <span className="text-[9px] font-bold text-ink">Website + App</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-background px-2 py-1">
          <span className="text-[9px] font-semibold text-ink-soft">Budget</span>
          <span className="text-[9px] font-bold text-ink">₹50k–1L</span>
        </div>
      </div>
      <div className="mt-2 grid place-items-center rounded-lg bg-accent py-1.5 text-[9px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.9)]">
        Get free quote →
      </div>
    </div>
  );
}

function Orb() {
  return (
    <div className="relative grid size-44 place-items-center">
      {/* outer glow */}
      <span
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(40,87,255,0.55), rgba(139,92,246,0.35) 55%, rgba(16,185,129,0.15) 80%, transparent)",
        }}
        aria-hidden
      />
      {/* sphere */}
      <div
        className="relative grid size-40 place-items-center rounded-full ring-1 ring-white/60 shadow-[0_30px_60px_-24px_rgba(40,87,255,0.7),inset_0_2px_14px_rgba(255,255,255,0.6)]"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, #ffffff 0%, #e8efff 22%, #bcd0ff 45%, #8ea6ff 68%, #7c6cf0 100%)",
        }}
      >
        <Image
          src="/logo-mark.png"
          alt="Skilloura"
          width={110}
          height={110}
          className="size-24 object-contain drop-shadow-[0_6px_14px_rgba(37,99,235,0.35)]"
        />
      </div>
      {/* Soft contact reflection for 3D grounding */}
      <span
        className="absolute -bottom-3 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full blur-md"
        style={{ background: "radial-gradient(closest-side, rgba(37,99,235,0.28), transparent)" }}
        aria-hidden
      />
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
            "radial-gradient(45% 45% at 60% 35%, rgba(40,87,255,0.14), transparent 70%), radial-gradient(40% 40% at 30% 80%, rgba(16,185,129,0.12), transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── Desktop: full immersive composition ── */}
      <div className="relative mx-auto hidden h-[540px] w-full max-w-lg lg:block">
        {/* orb centered */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="animate-float">
            <Orb />
          </div>
        </div>

        {/* service cards floating around */}
        {services.map((s) => (
          <div
            key={s.label}
            className={`absolute animate-float ${s.pos}`}
            style={{ animationDelay: s.delay }}
          >
            <ServiceCard label={s.label} icon={s.icon} />
          </div>
        ))}

        {/* WhatsApp reply bubble — top */}
        <div
          className="absolute left-1/2 top-1 -translate-x-1/2 animate-float"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-2 rounded-[18px] rounded-tl-sm border border-mint/25 bg-mint/10 px-3 py-2 shadow-[0_16px_36px_-22px_rgba(16,185,129,0.7)] backdrop-blur-md">
            <span className="grid size-6 place-items-center rounded-full bg-mint text-white">
              <WhatsAppIcon className="size-3.5" />
            </span>
            <span className="text-[11px] font-semibold text-ink">Reviewed — scope ready ✓</span>
          </div>
        </div>

        {/* Quote preview card — bottom center */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-float"
          style={{ animationDelay: "1.1s" }}
        >
          <div className="w-52 rounded-[22px] border border-white/80 bg-white/90 p-3.5 shadow-[0_24px_50px_-26px_rgba(40,87,255,0.6)] ring-1 ring-accent/15 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-ink">Written quote</span>
              <span className="rounded-full bg-mint/10 px-2 py-0.5 text-[9px] font-bold text-mint">
                Before payment
              </span>
            </div>
            <div className="mt-1.5 flex items-end justify-between">
              <p className="text-xl font-extrabold tracking-tight text-ink">
                ₹12,600<span className="text-sm font-bold text-accent">+</span>
              </p>
              <span className="text-[10px] font-semibold text-ink-soft">5–10 days</span>
            </div>
          </div>
        </div>

        {/* Smart project-form preview — bottom left */}
        <div
          className="absolute -left-5 bottom-2 animate-float"
          style={{ animationDelay: "0.8s" }}
        >
          <SmartFormPreview />
        </div>
      </div>

      {/* ── Mobile / tablet: clean simplified version ── */}
      <div className="lg:hidden">
        <div className="flex justify-center">
          <div className="animate-float">
            <Orb />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <ServiceCard key={s.label} label={s.label} icon={s.icon} />
          ))}
        </div>
        <div className="mx-auto mt-5 w-60 rounded-[22px] border border-white/80 bg-white/90 p-3.5 shadow-[0_20px_44px_-26px_rgba(40,87,255,0.6)] ring-1 ring-accent/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink">Written quote</span>
            <span className="rounded-full bg-mint/10 px-2 py-0.5 text-[9px] font-bold text-mint">
              Before payment
            </span>
          </div>
          <div className="mt-1.5 flex items-end justify-between">
            <p className="text-xl font-extrabold tracking-tight text-ink">
              ₹12,600<span className="text-sm font-bold text-accent">+</span>
            </p>
            <span className="text-[10px] font-semibold text-ink-soft">5–10 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
