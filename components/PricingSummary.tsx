import type { EstimateResult } from "@/lib/pricingEngine";

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

// The reactive "live pricing summary" — recomputed by the caller on every
// answer change via lib/pricingEngine.computeEstimate() and just rendered
// here. Market-price figures are Skilloura's own guide price scaled by a
// stated multiplier for context, not a fabricated verified survey — said
// plainly in the footer note, same as the rest of the site's pricing pages.
export default function PricingSummary({ serviceName, estimate }: { serviceName: string; estimate: EstimateResult }) {
  return (
    <div className="rounded-card border border-brand/20 bg-brand-soft/40 p-5">
      <p className="text-body-sm font-bold uppercase tracking-wider text-brand">Live pricing summary — {serviceName}</p>

      {estimate.customQuoteRequired ? (
        <div className="mt-3 rounded-field border border-warning/25 bg-warning-soft p-4 text-body-sm leading-6 text-ink">
          <p className="font-bold">Custom quote required</p>
          <p className="mt-1">
            Your requirements need a custom quotation — Skilloura will review the scope and confirm the
            final price in writing.
          </p>
          {estimate.customQuoteReason && (
            <p className="mt-2 text-body-sm text-ink-soft">{estimate.customQuoteReason}</p>
          )}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-field bg-surface p-3.5 text-center ring-1 ring-line/60">
            <p className="text-micro font-semibold text-ink-soft">Estimated Skilloura price</p>
            <p className="mt-1 text-title-1 font-extrabold text-ink">{inr(estimate.skillouraOneTime)}</p>
          </div>
          <div className="rounded-field bg-surface/60 p-3.5 text-center ring-1 ring-line/40">
            <p className="text-micro font-semibold text-ink-soft">Typical market price</p>
            <p className="mt-1 text-title-1 font-extrabold text-ink-soft">{inr(estimate.marketOneTime)}</p>
          </div>
        </div>
      )}

      {!estimate.customQuoteRequired && estimate.savingsOneTime > 0 && (
        <p className="mt-2 text-center text-body-sm font-semibold text-success">
          You save an estimated {inr(estimate.savingsOneTime)} vs. typical market pricing
        </p>
      )}

      {/* Line-item breakdown */}
      {estimate.lineItems.some((li) => li.marketPrice !== 0 || li.skillouraPrice !== 0) && (
        <div className="mt-4 space-y-1.5">
          {estimate.lineItems
            .filter((li) => li.marketPrice !== 0 || li.skillouraPrice !== 0)
            .map((li, i) => (
              <div key={i} className="flex items-center justify-between text-body-sm text-ink-soft">
                <span>
                  {li.label}
                  {li.recurring && <span className="ml-1 text-nano text-brand">/month</span>}
                </span>
                <span className="font-semibold text-ink">{inr(li.skillouraPrice)}</span>
              </div>
            ))}
        </div>
      )}

      {(estimate.marketRecurringMonthly > 0 || estimate.skillouraRecurringMonthly > 0) && (
        <div className="mt-3 rounded-field bg-surface p-3 text-center ring-1 ring-line/60">
          <p className="text-micro font-semibold text-ink-soft">Ongoing / monthly</p>
          <p className="mt-0.5 text-body-sm font-extrabold text-ink">{inr(estimate.skillouraRecurringMonthly)}/month</p>
        </div>
      )}

      {estimate.externalCosts.length > 0 && (
        <div className="mt-3 rounded-field border border-line bg-surface/70 p-3.5">
          <p className="text-micro font-bold uppercase tracking-wide text-ink-soft">Third-party costs (not Skilloura&apos;s fee, not discounted)</p>
          <div className="mt-2 space-y-1">
            {estimate.externalCosts.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-body-sm text-ink-soft">
                <span>
                  {c.name}
                  {c.recurring && <span className="ml-1 text-nano">/year</span>}
                </span>
                <span className="font-semibold text-ink">{c.cost > 0 ? inr(c.cost) : "Varies"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 flex items-center justify-between text-body-sm font-semibold text-ink-soft">
        <span>Estimated delivery</span>
        <span className="text-ink">{estimate.estimatedDelivery}</span>
      </p>

      <p className="mt-3 text-micro leading-4 text-ink-soft">
        The market price is a general guide based on typical agency/freelancer pricing in India for similar
        scope — not a formal survey, just context. Your exact price is always confirmed in writing before
        you pay anything, and updates live as you answer the questions below.
      </p>
    </div>
  );
}
