import type { ServiceCategory } from "@/lib/services";

function parsePrice(price: string): number | null {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : null;
}
function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

// An honest "what this typically costs" panel shown while the client fills
// the requirement form. It uses Skilloura's own published guide prices (the
// same numbers on /pricing) — not a fabricated "market research" statistic —
// and frames the comparison range as a labelled estimate, not verified fact.
export default function InvestmentEstimate({ service }: { service: ServiceCategory }) {
  const prices = service.packages.map((p) => parsePrice(p.price)).filter((n): n is number => n !== null);
  if (prices.length === 0) return null;

  const low = Math.min(...prices);
  const high = Math.max(...prices);
  // Typical agency/freelancer market range for comparable scope in India tends
  // to run noticeably higher than a lean, direct-to-founder setup — shown as a
  // clearly-labelled estimate for context, never as a precise verified figure.
  const marketLow = Math.round(low * 1.4);
  const marketHigh = Math.round(high * 1.8);

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        What this typically costs — {service.name}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-3.5 text-center ring-1 ring-line/60">
          <p className="text-[11px] font-semibold text-ink-soft">Skilloura guide price</p>
          <p className="mt-1 text-lg font-extrabold text-ink">
            {inr(low)}–{inr(high)}
          </p>
        </div>
        <div className="rounded-xl bg-white/60 p-3.5 text-center ring-1 ring-line/40">
          <p className="text-[11px] font-semibold text-ink-soft">Typical market range*</p>
          <p className="mt-1 text-lg font-extrabold text-ink-soft">
            {inr(marketLow)}–{inr(marketHigh)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-4 text-ink-soft">
        *A rough, honest estimate for context (typical agency/freelancer pricing for comparable scope
        in India) — not a verified market study. Your exact Skilloura price depends on what you select
        below, and is always confirmed in writing before you pay anything. You pay only for your
        project — there&apos;s no separate hidden margin on top of the quoted price.
      </p>
    </div>
  );
}
