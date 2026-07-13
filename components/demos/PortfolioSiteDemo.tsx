"use client";

import { useState } from "react";

const WORK = [
  { t: "Aether — Brand Identity", cat: "Branding", emoji: "🎨", tag: "Identity" },
  { t: "Lumen — SaaS Website", cat: "Web", emoji: "💻", tag: "Web design" },
  { t: "Nomad — Travel App", cat: "Product", emoji: "📱", tag: "UI/UX" },
  { t: "Verde — Packaging", cat: "Branding", emoji: "📦", tag: "Packaging" },
  { t: "Pulse — Fintech Web", cat: "Web", emoji: "📈", tag: "Web design" },
  { t: "Orbit — Dashboard", cat: "Product", emoji: "🛰️", tag: "Product" },
];
const CATS = ["All", "Branding", "Web", "Product"];

export default function PortfolioSiteDemo() {
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? WORK : WORK.filter((w) => w.cat === cat);

  return (
    <div className="bg-[#0d0d0f] text-neutral-100 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-white/10 bg-[#0d0d0f]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight">STUDIO<span className="text-amber-400">.</span></span>
          <nav className="hidden gap-6 text-sm text-neutral-400 sm:flex">
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href="#contact" className="rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-900">Let&apos;s talk</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">Design studio</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[1.05] sm:text-7xl">
          We craft brands<br />that people <span className="italic text-amber-400">remember</span>.
        </h1>
        <p className="mt-6 max-w-md text-neutral-400">
          A multidisciplinary studio designing identities, websites and products for ambitious teams.
        </p>
        <div className="mt-8 flex gap-8 text-sm">
          <div><span className="block text-3xl font-black text-amber-400">120+</span><span className="text-neutral-500">Projects</span></div>
          <div><span className="block text-3xl font-black text-amber-400">40+</span><span className="text-neutral-500">Brands</span></div>
          <div><span className="block text-3xl font-black text-amber-400">9</span><span className="text-neutral-500">Awards</span></div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-black">Selected work</h2>
          <div className="flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${cat === c ? "bg-amber-400 text-neutral-900" : "border border-white/15 text-neutral-300 hover:bg-white/5"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((w) => (
            <div key={w.t} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-amber-500/10 to-fuchsia-500/10 text-6xl transition-transform duration-500 group-hover:scale-105">{w.emoji}</div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-bold">{w.t}</h3>
                  <p className="text-xs text-neutral-500">{w.tag}</p>
                </div>
                <span className="text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">↗</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl font-black">Have a project in mind?</h2>
          <p className="mt-3 text-neutral-400">Tell us about it — we reply within a day.</p>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input placeholder="Your email" className="flex-1 rounded-lg bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-neutral-500" />
            <button className="rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-neutral-900">Start a project</button>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-500">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black">STUDIO<span className="text-amber-400">.</span></span>
          <span>© {new Date().getFullYear()} Studio (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
