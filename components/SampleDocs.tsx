import Icon from "./Icons";

// Realistic (but clearly-labelled) SAMPLE documents that show clients exactly
// what they receive before paying — builds trust by making the process visible.
// These are illustrative examples, not any real client's documents.

function SampleTag() {
  return (
    <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-nano font-bold uppercase tracking-wider text-warning-ink">
      Sample
    </span>
  );
}

// ── The written quotation = "What you receive before payment" ──────────────
export function SampleQuotation() {
  const scope = [
   "6-page responsive website (Home, Menu, About, Gallery, Booking, Contact)",
   "WhatsApp order button + enquiry form",
   "Google Maps + basic on-page SEO",
   "Admin-editable menu section",
  ];
  const exclusions = [
   "Domain & hosting (billed by provider, ~₹3,000/yr)",
   "Paid photography / videography",
   "Ongoing monthly maintenance (optional plan)",
  ];
  const rows: [string, string][] = [
    ["Requirement summary", "Mobile-first restaurant site to show the menu, take table bookings and receive WhatsApp orders."],
    ["Timeline", "6–8 working days from advance payment"],
    ["Revisions included", "2 rounds of revisions"],
    ["Payment terms", "40% advance · 60% after preview approval"],
  ];

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-surface shadow-e4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-soft-panel px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-field bg-brand text-white">
            <Icon name="check" className="size-5" />
          </span>
          <div>
            <p className="flex items-center gap-2 text-body-sm font-bold text-ink">
              Project Quotation <SampleTag />
            </p>
            <p className="text-body-sm text-ink-soft">No. SKL-Q-2043 · Valid 14 days</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-body-sm font-semibold uppercase tracking-wide text-ink-soft">Final quote</p>
          <p className="text-title-1 font-black tracking-tight text-ink">
            ₹18,500<span className="text-body-sm font-bold text-brand"> incl.</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <div className="space-y-4">
          {rows.map(([k, v]) => (
            <div key={k}>
              <p className="text-micro font-bold uppercase tracking-wider text-ink-soft">{k}</p>
              <p className="mt-0.5 text-body-sm leading-6 text-ink">{v}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-micro font-bold uppercase tracking-wider text-ink-soft">
            Scope — what&apos;s included
          </p>
          <ul className="mt-2 space-y-1.5">
            {scope.map((s) => (
              <li key={s} className="flex items-start gap-2 text-body-sm leading-6 text-ink">
                <Icon name="check" className="mt-1 size-3.5 shrink-0 text-success" /> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-micro font-bold uppercase tracking-wider text-ink-soft">
            Not included (exclusions)
          </p>
          <ul className="mt-2 space-y-1.5">
            {exclusions.map((s) => (
              <li key={s} className="flex items-start gap-2 text-body-sm leading-6 text-ink-soft">
                <span className="mt-1 size-3.5 shrink-0 text-center text-ink-soft/60">–</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas px-6 py-4 sm:px-8">
        <p className="text-body-sm text-ink-soft">
          Nothing starts until you approve this in writing. No hidden charges.
        </p>
        <span className="rounded-full bg-success/10 px-3 py-1 text-body-sm font-bold text-success">
          Approve to start →
        </span>
      </div>
    </div>
  );
}

// ── Sample project timeline ────────────────────────────────────────────────
export function SampleTimeline() {
  const phases = [
    { d: "Day 1–2", t: "Requirement lock", done: true },
    { d: "Day 3–5", t: "Design & build", done: true },
    { d: "Day 6", t: "Preview shared", done: true },
    { d: "Day 7", t: "Revisions", done: false },
    { d: "Day 8", t: "Final delivery", done: false },
  ];
  return (
    <DocCard title="Project timeline" icon="clock">
      <ol className="relative space-y-4">
        {phases.map((p, i) => (
          <li key={p.t} className="flex items-center gap-3">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full text-nano font-bold ${
                p.done ? "bg-mint text-white" : "border border-line bg-surface-raised text-ink-soft"
              }`}
            >
              {p.done ? "✓" : i + 1}
            </span>
            <div className="flex flex-1 items-center justify-between">
              <span className="text-body-sm font-semibold text-ink">{p.t}</span>
              <span className="text-body-sm font-medium text-ink-soft">{p.d}</span>
            </div>
          </li>
        ))}
      </ol>
    </DocCard>
  );
}

// ── Sample revision checklist ──────────────────────────────────────────────
export function SampleRevisionChecklist() {
  const items = [
    { t: "Change hero heading & colours", done: true },
    { t: "Swap 3 menu photos", done: true },
    { t: "Adjust booking form fields", done: true },
    { t: "Add festive offer banner", done: false },
  ];
  return (
    <DocCard title="Revision checklist" icon="check" badge="Round 1 of 2">
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it.t} className="flex items-center gap-2.5 text-body-sm">
            <span className={`grid size-4 place-items-center rounded border ${it.done ? "border-mint bg-mint text-white" : "border-line"}`}>
              {it.done && <span className="text-nano">✓</span>}
            </span>
            <span className={it.done ? "text-ink-soft line-through" : "text-ink"}>{it.t}</span>
          </li>
        ))}
      </ul>
    </DocCard>
  );
}

// ── Sample handover checklist ──────────────────────────────────────────────
export function SampleHandoverChecklist() {
  const items = ["Source files & code (per agreement)", "Admin login & credentials", "Hosting / domain details", "Documentation PDF", "Training video (walkthrough)", "Final paid invoice"];
  return (
    <DocCard title="Handover checklist" icon="shield">
      <ul className="space-y-2.5">
        {items.map((t) => (
          <li key={t} className="flex items-center gap-2.5 text-body-sm text-ink">
            <span className="grid size-4 place-items-center rounded border border-mint bg-success text-nano text-white">✓</span>
            {t}
          </li>
        ))}
      </ul>
    </DocCard>
  );
}

// ── Sample invoice ─────────────────────────────────────────────────────────
export function SampleInvoice() {
  const lines: [string, string][] = [
    ["Restaurant website (6 pages)", "₹15,700"],
    ["WhatsApp + booking setup", "≈ included"],
  ];
  return (
    <DocCard title="Invoice format" icon="spark" badge="INV-1187">
      <div className="space-y-2">
        {lines.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between text-body-sm">
            <span className="text-ink-soft">{k}</span>
            <span className="font-semibold text-ink">{v}</span>
          </div>
        ))}
        <div className="border-t border-line pt-2">
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-semibold text-ink">₹15,700</span>
          </div>
          <div className="flex items-center justify-between text-body-sm">
            <span className="text-ink-soft">GST @ 18%</span>
            <span className="font-semibold text-ink">₹2,826</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-body-sm font-bold text-ink">Total</span>
            <span className="text-title-2 font-black text-ink">₹18,526</span>
          </div>
        </div>
        <span className="mt-1 inline-block rounded-md border border-mint/40 px-2 py-0.5 text-nano font-bold uppercase tracking-wider text-success">
          Paid ✓
        </span>
      </div>
    </DocCard>
  );
}

// Shared frame for the smaller sample docs.
function DocCard({
  title,
  icon,
  badge,
  children,
}: {
  title: string;
  icon: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-brand">
            <Icon name={icon} className="size-4" />
          </span>
          <h3 className="text-body-sm font-bold text-ink">{title}</h3>
        </div>
        {badge ? (
          <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-nano font-bold text-ink-soft">{badge}</span>
        ) : (
          <SampleTag />
        )}
      </div>
      {children}
    </div>
  );
}
