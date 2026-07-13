"use client";

import { useState } from "react";

const RESTAURANTS = [
  { n: "Spice Route", tag: "North Indian · 30 min", emoji: "🍛", rating: "4.6" },
  { n: "Sushi Bay", tag: "Japanese · 40 min", emoji: "🍣", rating: "4.8" },
  { n: "Pizza Cart", tag: "Italian · 25 min", emoji: "🍕", rating: "4.4" },
];
const ORDERS = [
  { n: "Butter Chicken + Naan", s: "On the way · 12 min", emoji: "🛵" },
  { n: "Veg Biryani", s: "Delivered", emoji: "✅" },
];

function Screen({ tab }: { tab: string }) {
  if (tab === "Home")
    return (
      <div className="space-y-4 p-4">
        <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-4 text-white">
          <p className="text-xs opacity-90">Deliver to · Home</p>
          <p className="text-lg font-black">Hungry? 🍽️</p>
          <div className="mt-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-slate-500">🔍 Search dishes, restaurants…</div>
        </div>
        <p className="text-sm font-bold text-slate-800">Popular near you</p>
        {RESTAURANTS.map((r) => (
          <div key={r.n} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
            <span className="grid size-12 place-items-center rounded-xl bg-orange-50 text-2xl">{r.emoji}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{r.n}</p>
              <p className="text-[11px] text-slate-500">{r.tag}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">★ {r.rating}</span>
          </div>
        ))}
      </div>
    );
  if (tab === "Search")
    return (
      <div className="space-y-3 p-4">
        <div className="rounded-full border border-slate-200 px-4 py-2.5 text-xs text-slate-400">🔍 Try “biryani”, “pizza”…</div>
        <div className="flex flex-wrap gap-2">
          {["🍕 Pizza", "🍔 Burger", "🍜 Noodles", "🍰 Dessert", "🥗 Healthy", "☕ Coffee"].map((c) => (
            <span key={c} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{c}</span>
          ))}
        </div>
        <p className="pt-2 text-sm font-bold text-slate-800">Trending 🔥</p>
        {RESTAURANTS.slice(0, 2).map((r) => (
          <div key={r.n} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
            <span className="text-2xl">{r.emoji}</span><span className="text-sm font-semibold">{r.n}</span>
          </div>
        ))}
      </div>
    );
  if (tab === "Orders")
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm font-bold text-slate-800">Your orders</p>
        {ORDERS.map((o) => (
          <div key={o.n} className="rounded-2xl border border-slate-100 p-3">
            <div className="flex items-center gap-2"><span className="text-xl">{o.emoji}</span><span className="text-sm font-bold text-slate-800">{o.n}</span></div>
            <p className="mt-1 text-[11px] font-semibold text-orange-600">{o.s}</p>
          </div>
        ))}
      </div>
    );
  return (
    <div className="space-y-3 p-4 text-center">
      <div className="mx-auto mt-4 grid size-16 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-rose-500 text-2xl text-white">A</div>
      <p className="font-bold text-slate-800">Aarav Sharma</p>
      <p className="text-xs text-slate-500">+91 98765 43210</p>
      <div className="space-y-2 pt-3 text-left text-sm">
        {["Saved addresses", "Payment methods", "Offers & rewards", "Help & support"].map((x) => (
          <div key={x} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"><span>{x}</span><span className="text-slate-400">›</span></div>
        ))}
      </div>
    </div>
  );
}

export default function MobileAppDemo() {
  const [tab, setTab] = useState("Home");
  const tabs = [["Home", "🏠"], ["Search", "🔍"], ["Orders", "🧾"], ["Profile", "👤"]];

  return (
    <div className="bg-slate-100 [font-family:system-ui,sans-serif]">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">On-demand app concept</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">An app your customers <span className="text-orange-600">keep coming back</span> to.</h1>
          <p className="mt-4 max-w-md text-slate-500">Browse, order, track and reorder in a few taps — with push notifications that bring them back. Try the live screens on the right 👉</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-700">
            <li>✓ Native-feel iOS &amp; Android</li>
            <li>✓ Live order tracking &amp; notifications</li>
            <li>✓ Secure in-app payments</li>
            <li>✓ Reorder in one tap</li>
          </ul>
        </div>
        {/* Phone */}
        <div className="mx-auto w-[300px]">
          <div className="rounded-[2.5rem] border-[10px] border-slate-900 bg-white shadow-2xl">
            <div className="relative h-[560px] overflow-hidden rounded-[1.8rem] bg-slate-50">
              <div className="flex items-center justify-between bg-white px-5 py-2 text-[11px] font-semibold text-slate-800"><span>9:41</span><span>📶 🔋</span></div>
              <div className="h-[468px] overflow-y-auto"><Screen tab={tab} /></div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-slate-100 bg-white py-2">
                {tabs.map(([t, icon]) => (
                  <button key={t} onClick={() => setTab(t)} className={`flex flex-col items-center gap-0.5 px-2 text-[10px] font-semibold ${tab === t ? "text-orange-600" : "text-slate-400"}`}>
                    <span className="text-lg">{icon}</span>{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <p className="pb-10 text-center text-xs text-slate-400">© {new Date().getFullYear()} Delivery app (concept). Built by Skilloura.</p>
    </div>
  );
}
