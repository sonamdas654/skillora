"use client";

import { useState } from "react";

// Concept demo: a warm, mobile-first restaurant website (Spice Route).
const MENU: Record<string, { name: string; desc: string; price: string; veg: boolean }[]> = {
  Starters: [
    { name: "Paneer Tikka", desc: "Char-grilled cottage cheese, mint chutney", price: "₹280", veg: true },
    { name: "Chicken 65", desc: "Crispy South-Indian spiced chicken", price: "₹320", veg: false },
    { name: "Tandoori Mushroom", desc: "Smoky clay-oven mushrooms", price: "₹260", veg: true },
  ],
  Mains: [
    { name: "Butter Chicken", desc: "Creamy tomato gravy, house butter", price: "₹390", veg: false },
    { name: "Dal Makhani", desc: "Slow-cooked black lentils, 8 hours", price: "₹280", veg: true },
    { name: "Paneer Lababdar", desc: "Rich onion-tomato masala", price: "₹320", veg: true },
  ],
  Breads: [
    { name: "Butter Naan", desc: "Tandoor-fresh, brushed with butter", price: "₹60", veg: true },
    { name: "Laccha Paratha", desc: "Flaky multi-layered whole wheat", price: "₹70", veg: true },
  ],
  Desserts: [
    { name: "Gulab Jamun", desc: "Warm, saffron syrup, 2 pcs", price: "₹120", veg: true },
    { name: "Kulfi Falooda", desc: "Rabri kulfi, rose, vermicelli", price: "₹160", veg: true },
  ],
};

const GALLERY = ["🍛", "🍢", "🫓", "🍮", "🥘", "🍗"];

export default function RestaurantDemo() {
  const cats = Object.keys(MENU);
  const [cat, setCat] = useState(cats[0]);

  return (
    <div className="bg-[#1a120b] text-orange-50 [font-family:system-ui,sans-serif]">
      {/* Nav */}
      <header className="sticky top-[41px] z-40 border-b border-white/10 bg-[#1a120b]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight text-orange-400">
            Spice<span className="text-orange-50">Route</span>
          </span>
          <nav className="hidden gap-6 text-sm text-orange-100/80 sm:flex">
            <a href="#menu" className="hover:text-orange-300">Menu</a>
            <a href="#gallery" className="hover:text-orange-300">Gallery</a>
            <a href="#book" className="hover:text-orange-300">Book</a>
            <a href="#visit" className="hover:text-orange-300">Visit</a>
          </nav>
          <a href="#book" className="rounded-full bg-green-500 px-4 py-2 text-xs font-bold text-white">
            Order on WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(80% 60% at 70% 0%, rgba(255,107,53,0.35), transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            North Indian · Since 1998
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
            Authentic flavours, <span className="text-orange-400">slow-cooked</span> the old way.
          </h1>
          <p className="mt-4 max-w-lg text-orange-100/70">
            Tandoor classics, rich curries and warm hospitality — dine in, or order to your door in minutes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#menu" className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-400">
              View Menu
            </a>
            <a href="#book" className="rounded-full border border-orange-300/40 px-6 py-3 text-sm font-bold text-orange-100 hover:bg-white/5">
              Book a Table
            </a>
          </div>
          <div className="mt-8 flex items-center gap-5 text-sm text-orange-100/70">
            <span className="font-bold text-orange-300">★ 4.8</span>
            <span>2,400+ reviews</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Open 11am – 11pm</span>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-black">Our Menu</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                cat === c ? "bg-orange-500 text-white" : "bg-white/5 text-orange-100/70 hover:bg-white/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {MENU[cat].map((item) => (
            <div key={item.name} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`size-3 rounded-sm border ${item.veg ? "border-green-500" : "border-red-500"}`}>
                    <span className={`block size-full scale-50 rounded-full ${item.veg ? "bg-green-500" : "bg-red-500"}`} />
                  </span>
                  <h3 className="font-bold text-orange-50">{item.name}</h3>
                </div>
                <p className="mt-1 text-sm text-orange-100/60">{item.desc}</p>
              </div>
              <span className="shrink-0 font-black text-orange-300">{item.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-3xl font-black">Gallery</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {GALLERY.map((g, i) => (
            <div
              key={i}
              className="grid aspect-square place-items-center rounded-2xl text-4xl"
              style={{ background: `linear-gradient(135deg, rgba(255,107,53,0.25), rgba(180,60,20,0.35))` }}
            >
              {g}
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black">Book a Table</h2>
            <p className="mt-3 text-orange-100/70">
              Reserve in seconds. We&apos;ll confirm on WhatsApp — no calls, no waiting.
            </p>
            <div className="mt-6 space-y-3">
              {["Name", "Phone number", "Date & time", "Guests"].map((f) => (
                <div key={f} className="rounded-xl border border-white/10 bg-[#1a120b] px-4 py-3 text-sm text-orange-100/50">
                  {f}
                </div>
              ))}
              <button className="w-full rounded-xl bg-green-500 py-3 text-sm font-bold text-white">
                Confirm on WhatsApp
              </button>
            </div>
          </div>
          <div id="visit" className="rounded-2xl border border-white/10 bg-[#1a120b] p-6">
            <h3 className="text-lg font-bold">Visit us</h3>
            <p className="mt-2 text-sm text-orange-100/70">
              12 Park Street, Kolkata · Open 11am – 11pm daily
            </p>
            <div className="mt-4 grid h-48 place-items-center rounded-xl bg-gradient-to-br from-orange-900/40 to-amber-900/30 text-orange-200/60">
              🗺️ Google Maps location
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              <span className="rounded-full bg-white/5 px-3 py-1.5">📞 Call</span>
              <span className="rounded-full bg-white/5 px-3 py-1.5">🧭 Directions</span>
              <span className="rounded-full bg-green-500/20 px-3 py-1.5 text-green-300">💬 WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-orange-100/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-orange-400">SpiceRoute</span>
          <span>© {new Date().getFullYear()} Spice Route (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
