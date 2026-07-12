"use client";

import { useState } from "react";

const DATA = {
  "This Month": {
    kpis: [
      { label: "Revenue", value: "₹8.4L", up: "+12%" },
      { label: "Orders", value: "1,284", up: "+8%" },
      { label: "Avg Order", value: "₹654", up: "+4%" },
      { label: "Returns", value: "2.1%", up: "−0.3%" },
    ],
    bars: [40, 55, 48, 62, 70, 65, 82, 78, 90, 85, 96, 88],
    products: [["Handwoven Bag", 82], ["Terracotta Vase", 64], ["Cushion Cover", 51], ["Brass Diya", 38]],
    regions: [["West", 42], ["North", 28], ["South", 19], ["East", 11]],
  },
  "This Quarter": {
    kpis: [
      { label: "Revenue", value: "₹24.7L", up: "+18%" },
      { label: "Orders", value: "3,910", up: "+15%" },
      { label: "Avg Order", value: "₹632", up: "+2%" },
      { label: "Returns", value: "2.4%", up: "−0.1%" },
    ],
    bars: [52, 60, 58, 66, 72, 70, 80, 76, 88, 84, 92, 98],
    products: [["Handwoven Bag", 240], ["Macramé Art", 190], ["Terracotta Vase", 175], ["Ceramic Mugs", 120]],
    regions: [["West", 38], ["North", 31], ["South", 21], ["East", 10]],
  },
  "This Year": {
    kpis: [
      { label: "Revenue", value: "₹1.02Cr", up: "+34%" },
      { label: "Orders", value: "16,420", up: "+29%" },
      { label: "Avg Order", value: "₹621", up: "+6%" },
      { label: "Returns", value: "2.6%", up: "+0.2%" },
    ],
    bars: [30, 42, 50, 55, 60, 68, 74, 80, 86, 90, 95, 100],
    products: [["Handwoven Bag", 980], ["Macramé Art", 760], ["Cushion Cover", 640], ["Brass Diya", 520]],
    regions: [["West", 40], ["North", 29], ["South", 20], ["East", 11]],
  },
} as const;

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const REGION_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#a855f7"];

export default function DashboardDemo() {
  const periods = Object.keys(DATA) as (keyof typeof DATA)[];
  const [period, setPeriod] = useState<keyof typeof DATA>(periods[0]);
  const d = DATA[period];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-amber-500 text-white">◆</span>
            Pulse<span className="-ml-1.5 text-amber-500">Board</span>
          </span>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-slate-400 sm:inline">Auto-refresh</span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" /> Live</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Sales Overview</h1>
            <p className="text-sm text-slate-500">Turn raw exports into decisions — updated automatically.</p>
          </div>
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
            {periods.map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${period === p ? "bg-amber-500 text-white" : "text-slate-500 hover:text-slate-900"}`}>{p}</button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {d.kpis.map((k) => (
            <div key={k.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{k.label}</p>
              <p className="mt-1.5 text-2xl font-black">{k.value}</p>
              <p className={`mt-1 text-xs font-bold ${k.up.startsWith("−") || k.up.startsWith("-") ? "text-emerald-600" : "text-emerald-600"}`}>{k.up} vs prev</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Revenue trend */}
          <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
            <h3 className="font-bold">Revenue trend</h3>
            <div className="mt-6 flex h-48 items-end gap-1.5">
              {d.bars.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full rounded-t bg-gradient-to-t from-amber-200 to-amber-500 transition-all" style={{ height: `${h * 1.6}px` }} />
                  <span className="text-[9px] text-slate-400">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Region donut (stacked bar) */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-bold">Sales by region</h3>
            <div className="mt-4 flex h-4 overflow-hidden rounded-full">
              {d.regions.map(([name, pct], i) => (
                <div key={name} style={{ width: `${pct}%`, background: REGION_COLORS[i] }} title={`${name} ${pct}%`} />
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {d.regions.map(([name, pct], i) => (
                <li key={name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: REGION_COLORS[i] }} />{name}</span>
                  <span className="font-bold">{pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top products */}
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="font-bold">Top products</h3>
          <div className="mt-4 space-y-3">
            {d.products.map(([name, val]) => {
              const max = Math.max(...d.products.map((p) => p[1] as number));
              return (
                <div key={name as string} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 truncate text-sm">{name}</span>
                  <div className="h-5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: `${((val as number) / max) * 100}%` }} />
                  </div>
                  <span className="w-12 shrink-0 text-right text-sm font-bold">{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} PulseBoard (concept). Built by Skilloura.</p>
      </div>
    </div>
  );
}
