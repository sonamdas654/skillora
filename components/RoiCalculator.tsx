"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "./Icons";

// A simple, honest ROI estimator for automation. Every output is clearly an
// estimate — it does not promise results. Numbers stay on the client.
function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(n))
  );
}

export default function RoiCalculator() {
  const [people, setPeople] = useState(1);
  const [hoursPerWeek, setHoursPerWeek] = useState(6);
  const [hourlyCost, setHourlyCost] = useState(150);
  const [automatable, setAutomatable] = useState(60); // % of that time a system can take over
  const [buildCost, setBuildCost] = useState(18000);

  const weeklyHoursSaved = (people * hoursPerWeek * automatable) / 100;
  const monthlyHoursSaved = weeklyHoursSaved * 4.33;
  const monthlySaving = monthlyHoursSaved * hourlyCost;
  const paybackMonths = monthlySaving > 0 ? buildCost / monthlySaving : Infinity;

  const field =
    "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";
  const label = "block text-sm font-semibold text-ink";

  return (
    <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.28)]">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="roi-people">
              People doing this work
            </label>
            <input id="roi-people" type="number" min={1} value={people} onChange={(e) => setPeople(+e.target.value || 0)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="roi-hours">
              Hours each spends on it per week
            </label>
            <input id="roi-hours" type="number" min={0} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(+e.target.value || 0)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="roi-cost">
              Rough cost of that time (₹ / hour)
            </label>
            <input id="roi-cost" type="number" min={0} value={hourlyCost} onChange={(e) => setHourlyCost(+e.target.value || 0)} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="roi-auto">
              How much of it a system can take over: <span className="text-accent">{automatable}%</span>
            </label>
            <input id="roi-auto" type="range" min={10} max={90} step={5} value={automatable} onChange={(e) => setAutomatable(+e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
          </div>
          <div>
            <label className={label} htmlFor="roi-build">
              One-time build (guide)
            </label>
            <input id="roi-build" type="number" min={0} step={1000} value={buildCost} onChange={(e) => setBuildCost(+e.target.value || 0)} className={field} />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col justify-center rounded-2xl bg-background p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Time saved / month</p>
              <p className="mt-1 text-2xl font-extrabold text-ink">{Math.round(monthlyHoursSaved)} hrs</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Value saved / month</p>
              <p className="mt-1 text-2xl font-extrabold text-ink">{inr(monthlySaving)}</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-accent-soft p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Estimated payback</p>
            <p className="mt-1 text-3xl font-black text-ink">
              {Number.isFinite(paybackMonths) ? `${paybackMonths < 1 ? "< 1" : Math.ceil(paybackMonths)} month${Math.ceil(paybackMonths) === 1 ? "" : "s"}` : "—"}
            </p>
          </div>
          <p className="mt-4 text-[11px] leading-4 text-ink-soft">
            This is a rough estimate to help you think it through — not a guarantee. Your real numbers
            depend on the exact workflow, which we confirm in writing before any payment.
          </p>
          <Link
            href="/start-project?service=ai-automation"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-deep transition-colors"
          >
            Get a real quote <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
