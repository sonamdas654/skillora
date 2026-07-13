"use client";

import { useState } from "react";

const FEATURES = [
  { icon: "⚡", t: "Lightning fast", d: "Sub-second loads, edge-cached worldwide." },
  { icon: "🔒", t: "Bank-grade security", d: "SOC2, encryption and SSO built in." },
  { icon: "🔗", t: "50+ integrations", d: "Connect the tools your team already uses." },
  { icon: "📊", t: "Live analytics", d: "See what's working the moment it happens." },
  { icon: "🤖", t: "AI assist", d: "Automations that do the busywork for you." },
  { icon: "🌍", t: "Scales with you", d: "From 1 to 1M users without a rewrite." },
];

export default function SaaSDemo() {
  const [yearly, setYearly] = useState(false);
  const price = (m: number) => (yearly ? Math.round(m * 10) : m);

  return (
    <div className="bg-[#0a0a12] text-slate-100 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-white/10 bg-[#0a0a12]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight">Nova<span className="text-indigo-400">Flow</span></span>
          <nav className="hidden gap-6 text-sm text-slate-400 sm:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>
          <a href="#pricing" className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white">Start free</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.35), transparent 65%)" }} />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-indigo-300">✨ Now with AI workflows</span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Ship products <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">10× faster</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-slate-400">
            The all-in-one platform that turns scattered tools into one smooth workflow your whole team loves.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#pricing" className="rounded-lg bg-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-400">Start free trial</a>
            <a href="#features" className="rounded-lg border border-white/15 px-6 py-3 text-sm font-bold hover:bg-white/5">See features</a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-500">
            <span>Trusted by teams at</span>
            {["Acme", "Globex", "Umbrella", "Initech", "Hooli"].map((c) => (
              <span key={c} className="font-bold text-slate-400">{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-black">Everything in one place</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-indigo-500/40">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-bold">{f.t}</h3>
              <p className="mt-1 text-sm text-slate-400">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-3xl font-black">Simple pricing</h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className={!yearly ? "font-bold" : "text-slate-500"}>Monthly</span>
            <button onClick={() => setYearly((y) => !y)} className="relative h-7 w-12 rounded-full bg-indigo-500/40 transition-colors">
              <span className={`absolute top-1 size-5 rounded-full bg-indigo-400 transition-all ${yearly ? "left-6" : "left-1"}`} />
            </button>
            <span className={yearly ? "font-bold" : "text-slate-500"}>Yearly <span className="text-emerald-400">(2 months free)</span></span>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { n: "Starter", m: 0, perks: ["1 project", "Community support", "Basic analytics"] },
              { n: "Pro", m: 29, perks: ["Unlimited projects", "AI workflows", "Priority support", "Advanced analytics"], pop: true },
              { n: "Business", m: 79, perks: ["Everything in Pro", "SSO & SAML", "Dedicated manager", "SLA"] },
            ].map((p) => (
              <div key={p.n} className={`rounded-2xl border p-6 ${p.pop ? "border-indigo-500 bg-indigo-500/10" : "border-white/10"}`}>
                {p.pop && <span className="mb-3 inline-block rounded-full bg-indigo-500 px-3 py-1 text-[10px] font-black uppercase">Popular</span>}
                <h3 className="font-black">{p.n}</h3>
                <p className="mt-2 text-3xl font-black">${price(p.m)}<span className="text-sm font-bold text-slate-500">/{yearly ? "yr" : "mo"}</span></p>
                <ul className="mt-4 space-y-2 text-sm text-slate-400">
                  {p.perks.map((k) => <li key={k}>✓ {k}</li>)}
                </ul>
                <button className={`mt-6 w-full rounded-lg py-2.5 text-sm font-bold ${p.pop ? "bg-indigo-500 text-white" : "border border-white/15"}`}>
                  {p.m === 0 ? "Start free" : "Choose plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black">Nova<span className="text-indigo-400">Flow</span></span>
          <span>© {new Date().getFullYear()} NovaFlow (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
