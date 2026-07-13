"use client";

import { useState } from "react";

const MODULES = ["Dashboard", "Orders", "Inventory", "Customers"] as const;

const ORDERS = [
  ["#1042", "Ravi Kumar", "₹4,200", "Paid", "text-emerald-600 bg-emerald-50"],
  ["#1041", "Sana Ali", "₹1,850", "Pending", "text-amber-600 bg-amber-50"],
  ["#1040", "Dev Patel", "₹9,300", "Paid", "text-emerald-600 bg-emerald-50"],
  ["#1039", "Mira Roy", "₹2,100", "Refunded", "text-rose-600 bg-rose-50"],
];
const STOCK = [
  ["Handwoven Bag", 42, "In stock"],
  ["Terracotta Vase", 8, "Low"],
  ["Brass Diya Set", 0, "Out"],
  ["Ceramic Mug", 120, "In stock"],
];

export default function SoftwareDemo() {
  const [mod, setMod] = useState<(typeof MODULES)[number]>("Dashboard");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 [font-family:system-ui,sans-serif]">
      <div className="mx-auto flex max-w-6xl">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 border-r border-slate-200 bg-white p-4 sm:block">
          <span className="text-lg font-black">Ops<span className="text-indigo-600">Suite</span></span>
          <nav className="mt-6 space-y-1">
            {MODULES.map((m) => (
              <button key={m} onClick={() => setMod(m)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${mod === m ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>{m}</button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5">
          {/* mobile tabs */}
          <div className="mb-4 flex gap-1 overflow-x-auto sm:hidden">
            {MODULES.map((m) => (
              <button key={m} onClick={() => setMod(m)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${mod === m ? "bg-indigo-600 text-white" : "bg-white text-slate-500"}`}>{m}</button>
            ))}
          </div>
          <h1 className="text-2xl font-black">{mod}</h1>

          {mod === "Dashboard" && (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[["Revenue (mo)", "₹8.4L", "+12%"], ["Orders", "1,284", "+8%"], ["Low-stock items", "3", "attention"]].map(([l, v, c]) => (
                  <div key={l} className="rounded-2xl bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{l}</p>
                    <p className="mt-1.5 text-2xl font-black">{v}</p>
                    <p className="mt-1 text-xs font-bold text-indigo-600">{c}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-bold">Sales this week</h3>
                <div className="mt-4 flex h-32 items-end gap-2">
                  {[50, 68, 60, 82, 74, 95, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-indigo-200 to-indigo-600" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {mod === "Orders" && (
            <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <tr>{["Order", "Customer", "Amount", "Status"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {ORDERS.map((o) => (
                    <tr key={o[0]} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-bold">{o[0]}</td>
                      <td className="px-4 py-3">{o[1]}</td>
                      <td className="px-4 py-3 font-semibold">{o[2]}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${o[4]}`}>{o[3]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {mod === "Inventory" && (
            <div className="mt-5 space-y-3">
              {STOCK.map(([name, qty, status]) => (
                <div key={name as string} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-xs text-slate-500">Qty: {qty}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "In stock" ? "bg-emerald-50 text-emerald-600" : status === "Low" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>{status}</span>
                </div>
              ))}
            </div>
          )}

          {mod === "Customers" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Ravi Kumar", "Sana Ali", "Dev Patel", "Mira Roy"].map((c, i) => (
                <div key={c} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="grid size-11 place-items-center rounded-full bg-indigo-100 font-black text-indigo-700">{c.split(" ").map((n) => n[0]).join("")}</span>
                  <div>
                    <p className="font-bold">{c}</p>
                    <p className="text-xs text-slate-500">{3 + i} orders · ₹{(i + 2) * 3100}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">© {new Date().getFullYear()} OpsSuite (concept). Built by Skilloura.</p>
        </main>
      </div>
    </div>
  );
}
