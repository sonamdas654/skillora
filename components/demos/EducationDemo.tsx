"use client";

import { useState } from "react";

const COURSES: Record<string, { t: string; dur: string; fee: string }[]> = {
  "JEE / NEET": [
    { t: "JEE Main + Advanced (2 yr)", dur: "2 years", fee: "₹1,20,000" },
    { t: "NEET Complete (1 yr)", dur: "1 year", fee: "₹95,000" },
    { t: "Foundation (Class 9–10)", dur: "1 year", fee: "₹55,000" },
  ],
  "Commerce": [
    { t: "CA Foundation", dur: "8 months", fee: "₹40,000" },
    { t: "Class 11–12 Accounts + Eco", dur: "1 year", fee: "₹48,000" },
  ],
  "Skills": [
    { t: "Spoken English & Personality", dur: "3 months", fee: "₹12,000" },
    { t: "Coding for Kids", dur: "4 months", fee: "₹18,000" },
  ],
};
const TOPPERS = [
  { n: "Ananya S.", r: "AIR 214 · JEE Adv" },
  { n: "Rohan M.", r: "NEET 680/720" },
  { n: "Isha K.", r: "98.6% · Class 12" },
  { n: "Dev P.", r: "CA Found. 1st attempt" },
];

export default function EducationDemo() {
  const cats = Object.keys(COURSES);
  const [cat, setCat] = useState(cats[0]);

  return (
    <div className="bg-white text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight text-violet-700">Vidya<span className="text-slate-900">Point</span></span>
          <nav className="hidden gap-6 text-sm text-slate-500 sm:flex">
            <a href="#courses" className="hover:text-slate-900">Courses</a>
            <a href="#results" className="hover:text-slate-900">Results</a>
            <a href="#enquiry" className="hover:text-slate-900">Admission</a>
          </nav>
          <a href="#enquiry" className="rounded-full bg-violet-700 px-4 py-2 text-xs font-bold text-white">Enquire</a>
        </div>
      </header>

      <section className="border-b border-slate-100 bg-gradient-to-br from-violet-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Since 2009 · 12,000+ students</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">Learn from mentors who&apos;ve <span className="text-violet-700">been there</span>.</h1>
          <p className="mt-4 max-w-lg text-slate-500">Small batches, doubt-solving support and a results record parents trust.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#courses" className="rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white">Explore courses</a>
            <a href="#enquiry" className="rounded-full border border-violet-200 px-6 py-3 text-sm font-bold text-violet-700">Download brochure</a>
          </div>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black">Courses &amp; batches</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-bold ${cat === c ? "bg-violet-700 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES[cat].map((c) => (
            <div key={c.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-24px_rgba(124,58,237,0.6)]">
              <h3 className="font-bold">{c.t}</h3>
              <p className="mt-2 text-xs text-slate-500">⏱ {c.dur}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-black text-violet-700">{c.fee}</span>
                <a href="#enquiry" className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Enquire</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="results" className="border-y border-slate-100 bg-violet-50/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-black">Our toppers</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOPPERS.map((t) => (
              <div key={t.n} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl font-black text-white">{t.n.split(" ").map((x) => x[0]).join("")}</div>
                <h3 className="mt-3 font-bold">{t.n}</h3>
                <p className="text-xs font-semibold text-violet-700">{t.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="bg-violet-700">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center text-white">
          <h2 className="text-3xl font-black">Book a free counselling session</h2>
          <p className="mt-2 text-violet-100">Talk to a mentor about the right batch for you.</p>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <input placeholder="Student name & phone" className="flex-1 rounded-lg bg-white px-4 py-3 text-sm text-slate-900 outline-none" />
            <button className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold">Request call</button>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-violet-700">VidyaPoint</span>
          <span>© {new Date().getFullYear()} VidyaPoint (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
