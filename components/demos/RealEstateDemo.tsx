"use client";

import { useState } from "react";

const PROPS = [
  { t: "3 BHK Sea-View Apartment", city: "Mumbai", price: 12500000, emoji: "🏢", beds: 3 },
  { t: "Modern Villa with Garden", city: "Pune", price: 8500000, emoji: "🏡", beds: 4 },
  { t: "2 BHK Smart Flat", city: "Mumbai", price: 6200000, emoji: "🏬", beds: 2 },
  { t: "Studio near IT Park", city: "Bengaluru", price: 3900000, emoji: "🏙️", beds: 1 },
  { t: "Farmhouse Retreat", city: "Pune", price: 15000000, emoji: "🌳", beds: 5 },
  { t: "Budget 1 BHK Starter", city: "Bengaluru", price: 2800000, emoji: "🔑", beds: 1 },
];
const CITIES = ["All", "Mumbai", "Pune", "Bengaluru"];
const fmt = (n: number) => "₹" + (n / 10000000 >= 1 ? (n / 10000000).toFixed(2) + " Cr" : (n / 100000).toFixed(1) + " L");

export default function RealEstateDemo() {
  const [city, setCity] = useState("All");
  const [maxP, setMaxP] = useState(15000000);
  const shown = PROPS.filter((p) => (city === "All" || p.city === city) && p.price <= maxP);

  const [loan, setLoan] = useState(5000000);
  const emi = Math.round((loan * 0.0075 * Math.pow(1.0075, 240)) / (Math.pow(1.0075, 240) - 1));

  return (
    <div className="bg-slate-50 text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight text-sky-600">Estate<span className="text-slate-900">Hub</span></span>
          <a href="#visit" className="rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white">Book a visit</a>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-gradient-to-br from-sky-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">Find a home you&apos;ll <span className="text-sky-600">love</span> coming back to.</h1>
          <p className="mt-3 max-w-lg text-slate-500">Verified listings, real photos, instant site-visit booking on WhatsApp.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button key={c} onClick={() => setCity(c)} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${city === c ? "bg-sky-600 text-white" : "border border-slate-200 text-slate-600"}`}>{c}</button>
            ))}
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-semibold text-slate-500">Max budget: <span className="text-slate-900">{fmt(maxP)}</span></label>
            <input type="range" min={2800000} max={15000000} step={100000} value={maxP} onChange={(e) => setMaxP(Number(e.target.value))} className="w-full accent-sky-600" />
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <div key={p.t} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)]">
              <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-sky-100 to-slate-100 text-6xl">{p.emoji}</div>
              <div className="p-4">
                <h3 className="font-bold">{p.t}</h3>
                <p className="text-xs text-slate-500">📍 {p.city} · {p.beds} BHK</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-black text-sky-600">{fmt(p.price)}</span>
                  <a href="#visit" className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">Book visit</a>
                </div>
              </div>
            </div>
          ))}
          {shown.length === 0 && <p className="text-slate-500">No properties match — raise the budget or change city.</p>}
        </div>
      </section>

      <section id="visit" className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-2">
          {/* EMI calculator */}
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-black">EMI Calculator</h3>
            <label className="mt-4 block text-sm font-semibold text-slate-600">Loan amount: <span className="text-sky-600">{fmt(loan)}</span></label>
            <input type="range" min={1000000} max={15000000} step={100000} value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full accent-sky-600" />
            <div className="mt-5 grid place-items-center rounded-xl bg-sky-50 py-6">
              <span className="text-sm text-slate-500">Approx. monthly EMI (20 yrs @ 9%)</span>
              <span className="text-3xl font-black text-sky-600">₹{emi.toLocaleString("en-IN")}</span>
            </div>
          </div>
          {/* Visit booking */}
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-black">Book a site visit</h3>
            <div className="mt-4 space-y-2.5">
              {["Your name", "Phone number", "Preferred date"].map((f) => (
                <div key={f} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">{f}</div>
              ))}
              <button className="w-full rounded-xl bg-sky-600 py-3 text-sm font-bold text-white">Confirm on WhatsApp</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-sky-600">EstateHub</span>
          <span>© {new Date().getFullYear()} EstateHub (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
