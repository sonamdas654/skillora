"use client";

import { useState } from "react";

const PALETTES = {
  Sunset: ["#ff6b35", "#f7c59f", "#2a1b3d", "#ffffff"],
  Ocean: ["#0ea5e9", "#22d3ee", "#0f172a", "#f8fafc"],
  Forest: ["#10b981", "#a3e635", "#064e3b", "#f0fdf4"],
  Berry: ["#a855f7", "#ec4899", "#3b0764", "#faf5ff"],
} as const;

export default function BrandingDemo() {
  const names = Object.keys(PALETTES) as (keyof typeof PALETTES)[];
  const [pal, setPal] = useState<keyof typeof PALETTES>("Sunset");
  const [c1, c2, dark, light] = PALETTES[pal];

  return (
    <div className="bg-white text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-black">Brand<span style={{ color: c1 }}>Kit</span></span>
          <span className="text-xs font-semibold text-slate-500">Identity system · concept</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: c1 }}>Brand identity</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">A complete look, built to be <span style={{ color: c1 }}>unmistakable</span>.</h1>
        <p className="mt-4 max-w-lg text-slate-500">Logo, colours, type and mockups — one consistent system. Switch a palette below to see how flexible it is.</p>

        {/* Palette switcher */}
        <div className="mt-6 flex flex-wrap gap-2">
          {names.map((n) => (
            <button key={n} onClick={() => setPal(n)} className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${pal === n ? "text-white" : "border border-slate-200 text-slate-700"}`} style={pal === n ? { background: (PALETTES[n] as readonly string[])[0] } : {}}>{n}</button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-14 lg:grid-cols-3">
        {/* Logo lockup */}
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Logo</p>
          <div className="mt-4 grid h-40 place-items-center rounded-xl" style={{ background: light }}>
            <div className="text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl text-2xl font-black text-white" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>◆</div>
              <p className="mt-2 text-lg font-black" style={{ color: dark }}>Aurora</p>
            </div>
          </div>
        </div>
        {/* Palette */}
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Colour palette</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[c1, c2, dark, light].map((c) => (
              <div key={c} className="overflow-hidden rounded-xl border border-slate-100">
                <div className="h-16" style={{ background: c }} />
                <p className="px-2 py-1 text-[10px] font-mono text-slate-500">{c}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Typography */}
        <div className="rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Typography</p>
          <div className="mt-4 space-y-2">
            <p className="text-3xl font-black" style={{ color: dark }}>Aa</p>
            <p className="text-sm font-black">Headline · Extra Bold</p>
            <p className="text-sm text-slate-500">Body · Regular — clean, legible, friendly.</p>
            <p className="font-mono text-xs text-slate-400">Mono · captions &amp; code</p>
          </div>
        </div>
      </section>

      {/* Mockups */}
      <section className="border-t border-slate-100" style={{ background: light }}>
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">In the wild</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {[["Business card", "💳"], ["Packaging", "📦"], ["Social post", "📱"]].map(([t, e]) => (
              <div key={t} className="grid h-40 place-items-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
                <div className="text-center"><div className="text-4xl">{e}</div><p className="mt-2 text-sm font-bold">{t}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="py-10 text-center text-xs text-slate-400">© {new Date().getFullYear()} Aurora brand kit (concept). Built by Skilloura.</p>
    </div>
  );
}
