"use client";

import { useState } from "react";

const DOCTORS = [
  { n: "Dr. Meera Nair", spec: "General Physician", opd: "10 AM – 2 PM", emoji: "👩‍⚕️" },
  { n: "Dr. Arjun Rao", spec: "Dentist", opd: "11 AM – 6 PM", emoji: "🦷" },
  { n: "Dr. Kavya Sharma", spec: "Dermatologist", opd: "4 PM – 8 PM", emoji: "🧑‍⚕️" },
];
const SERVICES = ["General Consultation", "Dental Care", "Skin & Hair", "Health Checkup", "Vaccination", "Lab Tests"];
const SLOTS = ["10:00", "10:30", "11:00", "11:30", "12:00", "4:00", "4:30", "5:00"];

export default function ClinicDemo() {
  const [doc, setDoc] = useState(DOCTORS[0].n);
  const [slot, setSlot] = useState<string | null>(null);

  return (
    <div className="bg-white text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="flex items-center gap-1.5 text-lg font-black tracking-tight text-teal-600">✚ Care<span className="text-slate-900">Well</span></span>
          <nav className="hidden gap-6 text-sm text-slate-500 sm:flex">
            <a href="#doctors" className="hover:text-slate-900">Doctors</a>
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#book" className="hover:text-slate-900">Book</a>
          </nav>
          <a href="#book" className="rounded-full bg-teal-600 px-4 py-2 text-xs font-bold text-white">Book appointment</a>
        </div>
      </header>

      <section className="border-b border-slate-100 bg-gradient-to-br from-teal-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600">Trusted neighbourhood clinic</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">Quality care, <span className="text-teal-600">without the wait</span>.</h1>
          <p className="mt-4 max-w-lg text-slate-500">Book appointments online, see live OPD timings, and get WhatsApp reminders before your visit.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#book" className="rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white">Book appointment</a>
            <a href="#doctors" className="rounded-full border border-teal-200 px-6 py-3 text-sm font-bold text-teal-700">Meet our doctors</a>
          </div>
        </div>
      </section>

      <section id="doctors" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black">Our doctors</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {DOCTORS.map((d) => (
            <div key={d.n} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_10px_30px_-24px_rgba(13,148,136,0.6)]">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-teal-100 text-3xl">{d.emoji}</div>
              <h3 className="mt-3 font-bold">{d.n}</h3>
              <p className="text-sm text-teal-600">{d.spec}</p>
              <p className="mt-1 text-xs text-slate-500">OPD: {d.opd}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="border-y border-slate-100 bg-teal-50/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-black">Services</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold">
                <span className="grid size-7 place-items-center rounded-lg bg-teal-100 text-teal-600">✚</span> {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(13,148,136,0.6)]">
          <h2 className="text-2xl font-black">Book an appointment</h2>
          <label className="mt-5 block text-sm font-semibold text-slate-600">Choose doctor</label>
          <select value={doc} onChange={(e) => setDoc(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500">
            {DOCTORS.map((d) => <option key={d.n}>{d.n}</option>)}
          </select>
          <label className="mt-4 block text-sm font-semibold text-slate-600">Available slots</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SLOTS.map((t) => (
              <button key={t} onClick={() => setSlot(t)} className={`rounded-full px-4 py-2 text-sm font-semibold ${slot === t ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-700 hover:border-teal-400"}`}>{t}</button>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white">
            {slot ? `Confirm ${slot} with ${doc}` : "Select a slot to continue"}
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">You&apos;ll get a WhatsApp reminder before your visit.</p>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-teal-600">✚ CareWell</span>
          <span>© {new Date().getFullYear()} CareWell (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
