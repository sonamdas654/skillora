"use client";

import { useState } from "react";

const REELS: Record<string, { t: string; len: string; views: string; grad: string }[]> = {
  Reels: [
    { t: "Cafe launch reel", len: "0:22", views: "1.2M", grad: "from-fuchsia-500 to-orange-400" },
    { t: "Fashion haul", len: "0:31", views: "840K", grad: "from-rose-500 to-purple-500" },
    { t: "Gym transformation", len: "0:18", views: "2.1M", grad: "from-emerald-500 to-cyan-500" },
  ],
  Ads: [
    { t: "App promo (30s)", len: "0:30", views: "560K", grad: "from-indigo-500 to-blue-500" },
    { t: "Product ad", len: "0:15", views: "1.0M", grad: "from-amber-500 to-red-500" },
  ],
  Weddings: [
    { t: "Cinematic teaser", len: "1:40", views: "310K", grad: "from-rose-400 to-pink-600" },
    { t: "Full film trailer", len: "2:10", views: "120K", grad: "from-purple-500 to-fuchsia-500" },
  ],
  Corporate: [
    { t: "Brand story", len: "1:20", views: "90K", grad: "from-slate-600 to-slate-800" },
    { t: "Event aftermovie", len: "1:05", views: "210K", grad: "from-cyan-600 to-teal-600" },
  ],
};

export default function VideoDemo() {
  const cats = Object.keys(REELS);
  const [cat, setCat] = useState(cats[0]);

  return (
    <div className="bg-[#0b0b0f] text-neutral-100 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-white/10 bg-[#0b0b0f]/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-black">Reel<span className="text-fuchsia-400">Craft</span></span>
          <a href="#book" className="rounded-full bg-fuchsia-500 px-4 py-2 text-xs font-bold text-white">Book an edit</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-400">Video &amp; content</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">Edits that <span className="text-fuchsia-400">stop the scroll</span>.</h1>
        <p className="mt-4 max-w-lg text-neutral-400">Reels, ads and films crafted to hold attention and drive action. Browse the reel below.</p>
        <div className="mt-6 flex gap-8 text-sm">
          <div><span className="block text-3xl font-black text-fuchsia-400">500+</span><span className="text-neutral-500">Videos</span></div>
          <div><span className="block text-3xl font-black text-fuchsia-400">80M+</span><span className="text-neutral-500">Views</span></div>
          <div><span className="block text-3xl font-black text-fuchsia-400">48h</span><span className="text-neutral-500">Avg turnaround</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${cat === c ? "bg-fuchsia-500 text-white" : "border border-white/15 text-neutral-300 hover:bg-white/5"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REELS[cat].map((r) => (
            <div key={r.t} className="group overflow-hidden rounded-2xl border border-white/10">
              <div className={`relative grid aspect-[9/12] place-items-center bg-gradient-to-br ${r.grad}`}>
                <span className="grid size-14 place-items-center rounded-full bg-white/25 text-2xl backdrop-blur transition-transform group-hover:scale-110">▶</span>
                <span className="absolute bottom-2 right-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold">{r.len}</span>
                <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold">▶ {r.views}</span>
              </div>
              <p className="p-3 text-sm font-bold">{r.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="book" className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-3xl font-black">Got footage? We&apos;ll make it pop.</h2>
          <p className="mt-2 text-neutral-400">Send raw clips, get scroll-stopping edits back.</p>
          <a href="#" onClick={(e) => e.preventDefault()} className="mt-6 inline-block rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-bold text-white">Start an edit</a>
        </div>
      </section>

      <p className="py-10 text-center text-xs text-neutral-500">© {new Date().getFullYear()} ReelCraft (concept). Built by Skilloura.</p>
    </div>
  );
}
