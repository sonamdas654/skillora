"use client";

import { useState } from "react";

const TEMPLATES = ["Classic", "Modern", "Bold"] as const;
const ACCENTS: Record<(typeof TEMPLATES)[number], string> = {
  Classic: "#0f172a",
  Modern: "#2563eb",
  Bold: "#7c3aed",
};

export default function ResumeDemo() {
  const [tpl, setTpl] = useState<(typeof TEMPLATES)[number]>("Modern");
  const accent = ACCENTS[tpl];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-lg font-black">Resume<span style={{ color: accent }}>Forge</span></span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">✓ ATS-friendly</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Your career, professionally presented</h1>
            <p className="text-sm text-slate-500">ATS-optimised resume + matching LinkedIn. Switch a template to preview.</p>
          </div>
          <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm">
            {TEMPLATES.map((t) => (
              <button key={t} onClick={() => setTpl(t)} className="rounded-full px-3.5 py-1.5 text-xs font-bold text-white transition-colors" style={{ background: tpl === t ? accent : "transparent", color: tpl === t ? "#fff" : "#64748b" }}>{t}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* Resume paper */}
          <div className="rounded-2xl bg-white p-7 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)]">
            <div className="border-b-2 pb-4" style={{ borderColor: accent }}>
              <h2 className="text-2xl font-black" style={{ color: accent }}>Priya Sharma</h2>
              <p className="text-sm font-semibold text-slate-600">Senior Product Designer</p>
              <p className="mt-1 text-xs text-slate-500">priya@email.com · +91 98765 43210 · Bengaluru · linkedin.com/in/priya</p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: accent }}>Summary</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">Product designer with 6+ years shipping user-loved apps. Led design for 3 products from 0→1, improving activation by 40%.</p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: accent }}>Experience</p>
              {[["Lead Designer · Nova", "2022 – Now", "Owned design system; +40% activation."], ["Product Designer · Byte", "2019 – 2022", "Redesigned onboarding; −30% drop-off."]].map(([r, d, s]) => (
                <div key={r} className="mt-2">
                  <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-800">{r}</span><span className="text-[11px] text-slate-500">{d}</span></div>
                  <p className="text-xs text-slate-600">{s}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: accent }}>Skills</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Figma", "UX Research", "Prototyping", "Design Systems", "HTML/CSS"].map((s) => (
                  <span key={s} className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: `${accent}14`, color: accent }}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* LinkedIn + score */}
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn headline</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">Senior Product Designer · I turn complex problems into simple, delightful products · Ex-Nova, Byte</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS score</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid size-16 place-items-center rounded-full text-lg font-black text-white" style={{ background: accent }}>92</div>
                <p className="text-sm text-slate-600">Keyword-matched, clean structure, recruiter-ready.</p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400">© {new Date().getFullYear()} ResumeForge (concept). Built by Skilloura.</p>
      </section>
    </div>
  );
}
