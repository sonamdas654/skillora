"use client";

import { useState } from "react";

const PLANS = [
  { name: "Monthly", price: "₹1,499", per: "/mo", perks: ["Gym floor access", "1 trainer session", "Locker"] },
  { name: "Quarterly", price: "₹3,999", per: "/3mo", perks: ["All Monthly perks", "4 trainer sessions", "Diet plan", "Steam"], popular: true },
  { name: "Annual", price: "₹11,999", per: "/yr", perks: ["All Quarterly perks", "Unlimited PT", "Free supplements starter", "Guest passes"] },
];
const TRAINERS = [
  { name: "Rahul Verma", tag: "Strength & Conditioning", exp: "8 yrs" },
  { name: "Sneha Kapoor", tag: "Fat Loss & HIIT", exp: "6 yrs" },
  { name: "Arjun Mehta", tag: "Powerlifting", exp: "10 yrs" },
];
const SCHEDULE = [
  ["6:00 AM", "HIIT Blast"],
  ["8:00 AM", "Strength Circuit"],
  ["6:00 PM", "CrossFit"],
  ["8:00 PM", "Yoga & Mobility"],
];

export default function GymDemo() {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const bmi = h && w ? (Number(w) / Math.pow(Number(h) / 100, 2)).toFixed(1) : null;
  const band = bmi ? (Number(bmi) < 18.5 ? "Underweight" : Number(bmi) < 25 ? "Healthy" : Number(bmi) < 30 ? "Overweight" : "Obese") : null;

  return (
    <div className="bg-zinc-950 text-zinc-100 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black italic tracking-tight text-rose-500">IRON<span className="text-white">CORE</span></span>
          <nav className="hidden gap-6 text-sm text-zinc-400 sm:flex">
            <a href="#plans" className="hover:text-white">Plans</a>
            <a href="#trainers" className="hover:text-white">Trainers</a>
            <a href="#schedule" className="hover:text-white">Schedule</a>
            <a href="#join" className="hover:text-white">Join</a>
          </nav>
          <a href="#join" className="rounded-md bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">Join Now</a>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 20% 0%, rgba(225,29,72,0.35), transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-rose-500">No excuses</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-none sm:text-6xl">
            Build the <span className="text-rose-500">strongest</span> version of you
          </h1>
          <p className="mt-4 max-w-lg text-zinc-400">
            State-of-the-art equipment, expert trainers and a community that pushes you. First session free.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#plans" className="rounded-md bg-rose-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-rose-500">See Plans</a>
            <a href="#join" className="rounded-md border border-white/20 px-6 py-3 text-sm font-black uppercase hover:bg-white/5">Free Trial</a>
          </div>
          <div className="mt-8 flex gap-8 text-sm">
            <div><span className="block text-2xl font-black text-rose-500">2,000+</span><span className="text-zinc-500">Members</span></div>
            <div><span className="block text-2xl font-black text-rose-500">15+</span><span className="text-zinc-500">Trainers</span></div>
            <div><span className="block text-2xl font-black text-rose-500">24/7</span><span className="text-zinc-500">Access</span></div>
          </div>
        </div>
      </section>

      <section id="plans" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black uppercase">Membership Plans</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 ${p.popular ? "border-rose-500 bg-rose-500/5" : "border-white/10 bg-white/[0.02]"}`}>
              {p.popular && <span className="mb-3 inline-block rounded-full bg-rose-600 px-3 py-1 text-[10px] font-black uppercase">Most Popular</span>}
              <h3 className="text-lg font-black uppercase">{p.name}</h3>
              <p className="mt-2 text-3xl font-black">{p.price}<span className="text-sm font-bold text-zinc-500">{p.per}</span></p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                {p.perks.map((k) => <li key={k}>✓ {k}</li>)}
              </ul>
              <button className={`mt-6 w-full rounded-md py-2.5 text-sm font-black uppercase ${p.popular ? "bg-rose-600 text-white" : "border border-white/15"}`}>Choose</button>
            </div>
          ))}
        </div>
      </section>

      <section id="trainers" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-black uppercase">Expert Trainers</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TRAINERS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/10 p-6">
                <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-rose-600 to-orange-500 text-2xl font-black">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="mt-4 font-black">{t.name}</h3>
                <p className="text-sm text-rose-400">{t.tag}</p>
                <p className="mt-1 text-xs text-zinc-500">{t.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black uppercase">Class Schedule</h2>
            <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/10">
              {SCHEDULE.map(([time, cls]) => (
                <div key={time} className="flex items-center justify-between px-5 py-4">
                  <span className="font-black text-rose-400">{time}</span>
                  <span className="text-zinc-300">{cls}</span>
                </div>
              ))}
            </div>
          </div>
          {/* BMI calculator (interactive) */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-lg font-black uppercase">Free BMI Check</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <input value={h} onChange={(e) => setH(e.target.value)} inputMode="numeric" placeholder="Height (cm)" className="rounded-md border border-white/15 bg-zinc-900 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-rose-500" />
              <input value={w} onChange={(e) => setW(e.target.value)} inputMode="numeric" placeholder="Weight (kg)" className="rounded-md border border-white/15 bg-zinc-900 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-rose-500" />
            </div>
            <div className="mt-5 grid place-items-center rounded-xl bg-zinc-900 py-6">
              {bmi ? (
                <>
                  <span className="text-4xl font-black text-rose-500">{bmi}</span>
                  <span className="mt-1 text-sm font-bold text-zinc-300">{band}</span>
                </>
              ) : (
                <span className="text-sm text-zinc-600">Enter height &amp; weight</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="border-t border-white/10 bg-rose-600">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-3xl font-black uppercase">Start your free trial</h2>
          <p className="mt-2 text-rose-100">Drop your number — we&apos;ll set up your first session.</p>
          <div className="mx-auto mt-6 flex max-w-md gap-2">
            <input placeholder="Your phone number" className="flex-1 rounded-md bg-white/95 px-4 py-3 text-sm text-zinc-900 outline-none" />
            <button className="rounded-md bg-zinc-950 px-5 py-3 text-sm font-black uppercase text-white">Go</button>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black italic text-rose-500">IRONCORE</span>
          <span>© {new Date().getFullYear()} IronCore (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
