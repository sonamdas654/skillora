"use client";

import { useState } from "react";

const SERVICES = [
  { name: "Haircut & Styling", price: "₹499", time: "45 min" },
  { name: "Hair Spa & Treatment", price: "₹1,299", time: "60 min" },
  { name: "Bridal Makeup", price: "₹8,999", time: "3 hrs" },
  { name: "Facial & Clean-up", price: "₹899", time: "50 min" },
  { name: "Manicure & Pedicure", price: "₹1,099", time: "70 min" },
  { name: "Hair Colour (Global)", price: "₹2,499", time: "90 min" },
];
const SLOTS = ["10:00", "11:30", "1:00", "2:30", "4:00", "5:30", "7:00"];

export default function SalonDemo() {
  const [slot, setSlot] = useState<string | null>(null);
  const [svc, setSvc] = useState(SERVICES[0].name);

  return (
    <div className="bg-[#fbf7ff] text-[#2a1b3d] [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-purple-100 bg-[#fbf7ff]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight text-purple-700" style={{ fontFamily: "Georgia, serif" }}>Luxe <span className="font-light italic">Salon</span></span>
          <nav className="hidden gap-6 text-sm text-purple-900/70 sm:flex">
            <a href="#services" className="hover:text-purple-700">Services</a>
            <a href="#book" className="hover:text-purple-700">Book</a>
            <a href="#gallery" className="hover:text-purple-700">Gallery</a>
          </nav>
          <a href="#book" className="rounded-full bg-purple-700 px-4 py-2 text-xs font-bold text-white">Book Now</a>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 80% 0%, rgba(168,85,247,0.18), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Hair · Skin · Bridal</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-6xl" style={{ fontFamily: "Georgia, serif" }}>
            Look effortless. <span className="italic text-purple-700">Feel radiant.</span>
          </h1>
          <p className="mt-4 max-w-lg text-purple-900/60">
            A premium salon experience with expert stylists, luxury products and online booking that fits your schedule.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#book" className="rounded-full bg-purple-700 px-6 py-3 text-sm font-bold text-white hover:bg-purple-800">Book Appointment</a>
            <a href="#services" className="rounded-full border border-purple-300 px-6 py-3 text-sm font-bold text-purple-800 hover:bg-purple-50">View Services</a>
          </div>
          <div className="mt-8 flex items-center gap-5 text-sm text-purple-900/60">
            <span className="font-bold text-purple-700">★ 4.9</span><span>1,100+ happy clients</span>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>Services &amp; Prices</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.name} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(126,34,206,0.5)]">
              <h3 className="font-bold">{s.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-black text-purple-700">{s.price}</span>
                <span className="text-xs text-purple-900/50">{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="book" className="border-y border-purple-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>Book an Appointment</h2>
            <p className="mt-3 text-purple-900/60">Pick a service and slot. We&apos;ll confirm instantly on WhatsApp.</p>
            <label className="mt-6 block text-sm font-semibold text-purple-900/70">Service</label>
            <select value={svc} onChange={(e) => setSvc(e.target.value)} className="mt-1.5 w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500">
              {SERVICES.map((s) => <option key={s.name}>{s.name}</option>)}
            </select>
            <label className="mt-4 block text-sm font-semibold text-purple-900/70">Available slots today</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SLOTS.map((t) => (
                <button key={t} onClick={() => setSlot(t)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${slot === t ? "bg-purple-700 text-white" : "border border-purple-200 text-purple-800 hover:border-purple-400"}`}>{t}</button>
              ))}
            </div>
            <button className="mt-6 w-full rounded-xl bg-purple-700 py-3 text-sm font-bold text-white">
              {slot ? `Confirm ${svc} at ${slot}` : "Select a slot to continue"}
            </button>
          </div>
          <div id="gallery" className="grid grid-cols-2 gap-3">
            {["💇‍♀️", "💅", "💄", "✨", "🧖‍♀️", "🌸"].map((g, i) => (
              <div key={i} className="grid aspect-square place-items-center rounded-2xl text-4xl" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.14), rgba(217,70,239,0.12))" }}>{g}</div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-purple-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-purple-700" style={{ fontFamily: "Georgia, serif" }}>Luxe Salon</span>
          <span>© {new Date().getFullYear()} Luxe Salon (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
