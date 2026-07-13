"use client";

import { useState } from "react";

const DATA = {
  "30 days": {
    kpis: [["Leads", "342", "+24%"], ["Cost / lead", "₹86", "−12%"], ["Reach", "1.4L", "+31%"], ["ROAS", "4.2×", "+0.6"]],
    funnel: [["Impressions", 100], ["Clicks", 42], ["Leads", 18], ["Customers", 7]],
    channels: [["Google Ads", 46], ["Instagram", 31], ["SEO", 15], ["WhatsApp", 8]],
  },
  "90 days": {
    kpis: [["Leads", "1,180", "+38%"], ["Cost / lead", "₹79", "−18%"], ["Reach", "5.2L", "+44%"], ["ROAS", "4.8×", "+1.1"]],
    funnel: [["Impressions", 100], ["Clicks", 39], ["Leads", 21], ["Customers", 9]],
    channels: [["Google Ads", 42], ["Instagram", 34], ["SEO", 18], ["WhatsApp", 6]],
  },
} as const;
const COLORS = ["#2563eb", "#ec4899", "#10b981", "#f59e0b"];

export default function MarketingDemo() {
  const periods = Object.keys(DATA) as (keyof typeof DATA)[];
  const [p, setP] = useState<keyof typeof DATA>(periods[0]);
  const d = DATA[p];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-black">Grow<span className="text-blue-600">Metrics</span></span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" /> Campaign live</span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Marketing results</h1>
            <p className="text-sm text-slate-500">Real customers from Google, social and SEO — tracked end to end.</p>
          </div>
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
            {periods.map((x) => (
              <button key={x} onClick={() => setP(x)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${p === x ? "bg-blue-600 text-white" : "text-slate-500"}`}>{x}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.kpis.map(([label, val, chg]) => (
            <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
              <p className="mt-1.5 text-2xl font-black">{val}</p>
              <p className="mt-1 text-xs font-bold text-emerald-600">{chg}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Funnel */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold">Conversion funnel</h3>
            <div className="mt-4 space-y-2">
              {d.funnel.map(([stage, pct], i) => (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-slate-600">{stage}</span>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-slate-100">
                    <div className="flex h-full items-center justify-end rounded-md px-2 text-[10px] font-bold text-white" style={{ width: `${pct}%`, background: COLORS[i] }}>{pct}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Channels */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold">Leads by channel</h3>
            <div className="mt-4 flex h-4 overflow-hidden rounded-full">
              {d.channels.map(([n, pct], i) => <div key={n} style={{ width: `${pct}%`, background: COLORS[i] }} />)}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {d.channels.map(([n, pct], i) => (
                <li key={n} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: COLORS[i] }} />{n}</span>
                  <span className="font-bold">{pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} GrowMetrics (concept). Built by Skilloura.</p>
      </div>
    </div>
  );
}
