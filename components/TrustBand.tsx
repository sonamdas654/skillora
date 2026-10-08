import Link from "next/link";
import Icon from "./Icons";

// Honest trust signals — real guarantees, no fabricated testimonials or
// client counts. This is what actually earns trust before the first project.
const signals = [
  {
    icon: "check",
    title: "Written scope before payment",
    desc: "You approve a clear scope and quote in writing before you pay anything.",
  },
  {
    icon: "spark",
    title: "Preview before delivery",
    desc: "You review your project and approve it before the final handover.",
  },
  {
    icon: "shield",
    title: "Fair payment & refund policy",
    desc: "40–50% advance, milestone options, and a written refund & revision policy.",
  },
  {
    icon: "clock",
    title: "Reply within 24 hours",
    desc: "Direct WhatsApp and email access — no ticket queues, no chasing.",
  },
  {
    icon: "globe",
    title: "Real, working demos",
    desc: "Every concept is a live, working sample you can explore before you commit — so you judge the quality yourself.",
  },
  {
    icon: "bot",
    title: "Your work stays yours",
    desc: "Secure file handling, and source code included when it's part of your package.",
  },
];

export default function TrustBand() {
  return (
    <div className="rounded-panel border border-line bg-soft-panel p-8 sm:p-12">
      <div className="text-center">
        <p className="text-body-sm font-bold uppercase tracking-wider text-brand">Why trust Skilloura</p>
        <h2 className="mt-2 text-title-1 font-bold text-ink sm:text-display-3">
          Real guarantees — not{" "}
          <span className="font-accent font-normal text-brand">empty promises</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-body-sm leading-6 text-ink-soft">
          We put our whole process in writing — this is exactly how every project runs, from your
          first message to the final handover.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map((s) => (
          <div key={s.title} className="flex gap-3.5 rounded-card border border-line bg-surface p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-field bg-brand-soft text-brand">
              <Icon name={s.icon} className="size-5" />
            </span>
            <div>
              <h3 className="text-body-sm font-bold text-ink">{s.title}</h3>
              <p className="mt-1 text-body-sm leading-5 text-ink-soft">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Honest founding-client offer instead of fake social proof */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-card border border-brand/20 bg-brand-soft p-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-start gap-3">
          <span className="text-title-1">🚀</span>
          <div>
            <h3 className="text-body-sm font-bold text-ink">Be one of our first featured clients</h3>
            <p className="mt-1 text-body-sm leading-5 text-ink-soft">
              Early projects get extra attention, priority support and a featured spot in this
              portfolio — with your permission.
            </p>
          </div>
        </div>
        <Link
          href="/start-project"
          className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Start your project
        </Link>
      </div>
    </div>
  );
}
