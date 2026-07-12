"use client";

import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Handwoven Jute Bag", price: 899, emoji: "👜", tag: "Bestseller" },
  { id: 2, name: "Terracotta Vase", price: 649, emoji: "🏺", tag: "" },
  { id: 3, name: "Block-Print Cushion", price: 499, emoji: "🛋️", tag: "New" },
  { id: 4, name: "Brass Diya Set", price: 749, emoji: "🪔", tag: "" },
  { id: 5, name: "Macramé Wall Art", price: 1299, emoji: "🧶", tag: "Bestseller" },
  { id: 6, name: "Ceramic Mug Pair", price: 599, emoji: "☕", tag: "" },
];

export default function EcommerceDemo() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
  const add = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id: number) => setCart((c) => { const n = { ...c }; if (n[id]) { n[id]--; if (!n[id]) delete n[id]; } return n; });

  return (
    <div className="bg-white text-slate-900 [font-family:system-ui,sans-serif]">
      <header className="sticky top-[41px] z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-black tracking-tight text-emerald-600">Craft<span className="text-slate-900">Kart</span></span>
          <nav className="hidden gap-6 text-sm text-slate-500 sm:flex">
            <a href="#shop" className="hover:text-slate-900">Shop</a>
            <a href="#shop" className="hover:text-slate-900">New</a>
            <a href="#shop" className="hover:text-slate-900">Bestsellers</a>
          </nav>
          <a href="#cart" className="relative rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
            🛒 Cart
            {count > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-orange-500 text-[10px] font-black">{count}</span>}
          </a>
        </div>
      </header>

      <section className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Handmade in India</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            Crafts that carry a <span className="text-emerald-600">story</span>.
          </h1>
          <p className="mt-4 max-w-lg text-slate-500">Buy directly from artisans. Secure checkout, fast delivery, easy returns — no middlemen.</p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span>🚚 Free shipping over ₹999</span><span>🔒 Secure payments</span><span>↩️ 7-day returns</span>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-black">Shop all</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-22px_rgba(15,23,42,0.4)]">
              <div className="relative grid aspect-[4/3] place-items-center bg-gradient-to-br from-emerald-50 to-slate-50 text-6xl">
                {p.emoji}
                {p.tag && <span className="absolute left-3 top-3 rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white">{p.tag}</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold">{p.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-black">₹{p.price}</span>
                  {cart[p.id] ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => remove(p.id)} className="grid size-7 place-items-center rounded-full border border-slate-200 font-bold">−</button>
                      <span className="w-5 text-center font-bold">{cart[p.id]}</span>
                      <button onClick={() => add(p.id)} className="grid size-7 place-items-center rounded-full bg-emerald-600 font-bold text-white">+</button>
                    </div>
                  ) : (
                    <button onClick={() => add(p.id)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600">Add to cart</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="cart" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-black">Your cart</h2>
          {count === 0 ? (
            <p className="mt-3 text-slate-500">Cart is empty — add a few handmade pieces above to see checkout.</p>
          ) : (
            <div className="mt-6 max-w-md rounded-2xl border border-slate-200 bg-white p-6">
              {PRODUCTS.filter((p) => cart[p.id]).map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-slate-100 py-2.5 text-sm">
                  <span>{p.emoji} {p.name} × {cart[p.id]}</span>
                  <span className="font-bold">₹{cart[p.id] * p.price}</span>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-black text-emerald-600">₹{total}</span>
              </div>
              <button className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white">Secure Checkout →</button>
              <p className="mt-2 text-center text-[11px] text-slate-400">UPI · Cards · Netbanking · Razorpay</p>
            </div>
          )}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-black text-emerald-600">CraftKart</span>
          <span>© {new Date().getFullYear()} CraftKart (concept). Built by Skilloura.</span>
        </div>
      </footer>
    </div>
  );
}
