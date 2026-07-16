import type { ServiceCategory } from "@/lib/services";

function parsePrice(price: string): number | null {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? Number(digits) : null;
}
function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

// "Below X" / "X–Y" / "X+" / "Custom budget" -> a numeric ceiling to match
// against package prices. Returns null for "Custom budget" (no useful bound).
function parseBudgetCeiling(budget: string): number | null {
  if (!budget || /custom/i.test(budget)) return null;
  const nums = budget.match(/[\d,]+/g)?.map((n) => Number(n.replace(/,/g, ""))) ?? [];
  if (nums.length === 0) return null;
  if (/below/i.test(budget)) return nums[0];
  if (budget.includes("+")) return Infinity;
  return nums[nums.length - 1]; // the upper end of a "A–B" range
}

// A "what this typically costs" panel shown while the client fills the
// requirement form. Reacts to the budget they actually pick, instead of
// showing one static range regardless of what they select — because a
// number that never changes isn't a calculator, it's decoration.
export default function InvestmentEstimate({
  service,
  budget,
}: {
  service: ServiceCategory;
  budget?: string;
}) {
  const priced = service.packages
    .map((p) => ({ name: p.name, price: parsePrice(p.price) }))
    .filter((p): p is { name: string; price: number } => p.price !== null)
    .sort((a, b) => a.price - b.price);
  if (priced.length === 0) return null;

  const low = priced[0].price;
  const high = priced[priced.length - 1].price;
  // A general guide based on typical agency/freelancer pricing for
  // comparable scope in India — not scraped or surveyed data, just a
  // reasonable multiplier on our own guide price, said plainly as that.
  const marketLow = Math.round(low * 1.4);
  const marketHigh = Math.round(high * 1.8);

  const ceiling = budget ? parseBudgetCeiling(budget) : null;
  const fitting = ceiling !== null ? priced.filter((p) => p.price <= ceiling) : [];
  const bestFit = fitting.length > 0 ? fitting[fitting.length - 1] : null;
  const belowStart = ceiling !== null && ceiling < low;

  return (
    <div className="rounded-2xl border border-accent/20 bg-accent-soft/40 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">
        What this typically costs — {service.name}
      </p>

      {budget && belowStart && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm leading-6 text-ink">
          Our {service.name.toLowerCase()} projects usually start around{" "}
          <span className="font-bold">{inr(low)}</span>. Your selected budget (
          <span className="font-semibold">{budget}</span>) is below that — it&apos;s still worth
          submitting the request; we&apos;ll tell you honestly what&apos;s realistic in that budget,
          or suggest a smaller service that fits.
        </div>
      )}

      {budget && bestFit && !belowStart && (
        <div className="mt-3 rounded-xl bg-white p-3.5 ring-1 ring-line/60">
          <p className="text-[11px] font-semibold text-ink-soft">Closest match for your budget ({budget})</p>
          <p className="mt-1 text-lg font-extrabold text-ink">
            {bestFit.name} — {inr(bestFit.price)}
            <span className="text-accent">+</span>
          </p>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-3.5 text-center ring-1 ring-line/60">
          <p className="text-[11px] font-semibold text-ink-soft">Skilloura guide range</p>
          <p className="mt-1 text-lg font-extrabold text-ink">
            {inr(low)}–{inr(high)}
          </p>
        </div>
        <div className="rounded-xl bg-white/60 p-3.5 text-center ring-1 ring-line/40">
          <p className="text-[11px] font-semibold text-ink-soft">Typical market range</p>
          <p className="mt-1 text-lg font-extrabold text-ink-soft">
            {inr(marketLow)}–{inr(marketHigh)}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-4 text-ink-soft">
        The market range is a general guide based on typical agency/freelancer pricing in India for
        similar scope — we haven&apos;t run a formal survey, so treat it as context, not a fixed fact.
        Your exact Skilloura price depends on what you select below, and is always confirmed in
        writing before you pay anything — you pay only for your project, with no separate hidden
        margin on top.
      </p>
    </div>
  );
}
