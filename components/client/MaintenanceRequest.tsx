"use client";

import { useState } from "react";
import NewTicketForm from "./NewTicketForm";

// Plan cards + one-click request: selecting a plan opens a prefilled
// ticket the owner follows up with a quotation/invoice. No auto-billing.
export default function MaintenanceRequest({
  plans,
}: {
  plans: { name: string; price: string; period: string; features: string[]; highlighted?: boolean }[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl border bg-white p-6 ${
              plan.highlighted ? "border-accent shadow-[0_18px_40px_-24px_rgba(40,87,255,0.45)]" : "border-line"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-3 self-start rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold text-accent">
                Most popular
              </span>
            )}
            <h3 className="text-base font-bold text-ink">{plan.name}</h3>
            <p className="mt-2 text-2xl font-extrabold text-ink">
              {plan.price}
              <span className="text-sm font-semibold text-ink-soft">{plan.period}</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(plan.name)}
              className={`mt-6 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                selected === plan.name
                  ? "bg-mint text-white"
                  : plan.highlighted
                    ? "bg-accent text-white hover:bg-accent-deep"
                    : "border border-line bg-white text-ink hover:border-accent hover:text-accent"
              }`}
            >
              {selected === plan.name ? "Selected ✓" : "Request this plan"}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-8 rounded-3xl border border-line bg-white p-6 sm:p-8">
          <h2 className="text-base font-bold text-ink">Request: {selected}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Send this and we&apos;ll confirm scope + start date, then share the first invoice.
          </p>
          <div className="mt-4">
            <NewTicketForm
              key={selected}
              presetSubject={`Maintenance plan request: ${selected}`}
              presetMessage={`Hi! I'd like to start the ${selected} plan for my project. Please share the details and first invoice.`}
              buttonLabel="Send maintenance request"
            />
          </div>
        </div>
      )}
    </div>
  );
}
