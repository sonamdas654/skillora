"use client";

import type { ReactNode } from "react";

// Realistic output mockups for concept previews — each renders what the
// final deliverable roughly looks like (resume page, dashboard, software
// screen, website landing) so clients can judge the style before selecting.

/* ── tiny shared atoms ─────────────────────────────────────────── */

function BarChart({ values, color }: { values: number[]; color: string }) {
  return (
    <div className="flex items-end gap-1.5 h-16 w-full">
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${v}%`, background: color, opacity: 0.55 + (i % 3) * 0.15 }} />
      ))}
    </div>
  );
}

function Kpi({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
      <p className="text-[7px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
      <p className="text-sm font-black text-white mt-0.5">{value}</p>
      <p className={`text-[8px] font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "▲" : "▼"} {delta}</p>
    </div>
  );
}

function PaperLine({ w, dark = false }: { w: string; dark?: boolean }) {
  return <div className={`h-1.5 rounded-full ${dark ? "bg-slate-400" : "bg-slate-200"}`} style={{ width: w }} />;
}

/* ── WEBSITE landing mockups (portfolio / realestate / education / clinic) ── */

const WEB_CONTENT: Record<string, { brand: string; hero: string; sub: string; cards: { t: string; s: string }[]; cta: string }> = {
  "web-portfolio": {
    brand: "Studio Nova",
    hero: "Design that wins clients",
    sub: "Case studies, process and results — beautifully presented.",
    cards: [
      { t: "Brand Refresh — Café Rio", s: "+40% walk-ins" },
      { t: "SaaS UI — TrackFlow", s: "4.9★ reviews" },
      { t: "Campaign — FitLab", s: "2M reach" },
    ],
    cta: "Start a project",
  },
  "web-realestate": {
    brand: "UrbanNest Realty",
    hero: "Find your next address",
    sub: "Verified listings with photos, EMI calculator and instant site visits.",
    cards: [
      { t: "3BHK · Green Meadows", s: "₹78L · Ready" },
      { t: "2BHK · Lake View", s: "₹52L · New" },
      { t: "Villa · Palm County", s: "₹1.4Cr" },
    ],
    cta: "Book site visit",
  },
  "web-education": {
    brand: "Ascent Academy",
    hero: "Crack your target exam",
    sub: "Expert faculty, small batches and a results wall that speaks.",
    cards: [
      { t: "NEET Foundation", s: "Batch: Mon–Sat" },
      { t: "JEE Advanced", s: "New batch: 1 Aug" },
      { t: "Class 10 Boards", s: "Weekend batch" },
    ],
    cta: "Get admission call",
  },
  "web-clinic": {
    brand: "CarePoint Clinic",
    hero: "Book a doctor in 30 seconds",
    sub: "OPD timings, specialist profiles and instant token booking.",
    cards: [
      { t: "Dr. Mehta · Physician", s: "10am–2pm · ₹500" },
      { t: "Dr. Rao · Dental", s: "4pm–8pm · ₹400" },
      { t: "Dr. Iyer · Skin", s: "11am–1pm · ₹600" },
    ],
    cta: "Book appointment",
  },
  // Portfolio concept cards reuse the same renderer with their own content
  "web-restaurant": {
    brand: "Spice Route",
    hero: "Order your favourites in 2 taps",
    sub: "Full menu with photos, table booking and WhatsApp ordering — zero commission.",
    cards: [
      { t: "Paneer Tikka", s: "₹240 · bestseller" },
      { t: "Dal Makhani", s: "₹210" },
      { t: "Butter Naan", s: "₹45" },
    ],
    cta: "Order on WhatsApp",
  },
  "web-gym": {
    brand: "IronCore Gym",
    hero: "Stronger every single week",
    sub: "Membership plans, trainer profiles and class schedule — join in 60 seconds.",
    cards: [
      { t: "Monthly Plan", s: "₹1,499" },
      { t: "Quarterly", s: "₹3,999 · save 11%" },
      { t: "Annual Pro", s: "₹11,999" },
    ],
    cta: "Get free trial",
  },
  "web-salon": {
    brand: "Luxe Salon",
    hero: "Look amazing, book in seconds",
    sub: "Service menu with prices, stylist picks and online slot booking.",
    cards: [
      { t: "Hair Spa", s: "₹899 · 45 min" },
      { t: "Bridal Package", s: "₹12,500" },
      { t: "Classic Facial", s: "₹1,199" },
    ],
    cta: "Book appointment",
  },
  "web-ecommerce": {
    brand: "CraftKart",
    hero: "Handmade. Delivered pan-India.",
    sub: "Product catalog, secure checkout and order tracking — built to convert.",
    cards: [
      { t: "Terracotta Vase", s: "₹649 · ★4.8" },
      { t: "Jute Tote Bag", s: "₹399" },
      { t: "Brass Diya Set", s: "₹899 · new" },
    ],
    cta: "Shop now",
  },
};

export function WebPreview({ id, accent }: { id: string; accent: string }) {
  const c = WEB_CONTENT[id] ?? WEB_CONTENT["web-portfolio"];
  return (
    <div className="flex-1 flex flex-col p-4 gap-3 text-left">
      <div className="flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 px-3 py-2">
        <span className="text-[10px] font-black text-white">{c.brand}</span>
        <div className="flex gap-2.5 text-[8px] text-slate-400 font-semibold">
          <span>Home</span><span>Services</span><span>Gallery</span><span>Contact</span>
        </div>
      </div>
      <div className="text-center py-3 space-y-1.5">
        <h4 className="text-base font-black text-white">{c.hero}</h4>
        <p className="text-[9px] text-slate-400 max-w-[240px] mx-auto leading-4">{c.sub}</p>
        <span className="inline-block mt-1.5 rounded-full px-3.5 py-1.5 text-[9px] font-bold text-white shadow" style={{ background: accent }}>
          {c.cta}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {c.cards.map((card) => (
          <div key={card.t} className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 space-y-1.5">
            <div className="h-10 rounded-md" style={{ background: `linear-gradient(135deg, ${accent}55, ${accent}22)` }} />
            <p className="text-[8px] font-bold text-white leading-3">{card.t}</p>
            <p className="text-[8px] font-semibold" style={{ color: accent }}>{card.s}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
        <span className="text-[8px] text-emerald-300 font-semibold">✓ WhatsApp enquiry connected</span>
        <span className="text-[8px] text-slate-500">Mobile responsive</span>
      </div>
    </div>
  );
}

/* ── DASHBOARD mockups (dash-*) ────────────────────────────────── */

const DASH_CONTENT: Record<string, { title: string; kpis: [string, string, string, boolean][]; bars: number[]; rows: [string, string, string][] }> = {
  "dash-sales": {
    title: "Sales Performance — July",
    kpis: [["Revenue", "₹18.4L", "12% vs last mo", true], ["Orders", "1,284", "8%", true], ["Avg order", "₹1,433", "3%", false]],
    bars: [40, 55, 45, 70, 62, 85, 78, 92, 70, 88, 95, 82],
    rows: [["Business Websites", "₹6.2L", "▲"], ["Ecommerce Builds", "₹4.8L", "▲"], ["Maintenance Plans", "₹2.1L", "—"]],
  },
  "dash-finance": {
    title: "Cashflow & Receivables",
    kpis: [["Cash in", "₹12.6L", "9%", true], ["Cash out", "₹8.9L", "4%", false], ["Overdue", "₹1.7L", "3 invoices", false]],
    bars: [60, 45, 72, 50, 66, 58, 80, 62, 75, 68, 84, 71],
    rows: [["Acme Traders — INV104", "₹42,000", "30d overdue"], ["Bluewave — INV121", "₹78,500", "12d"], ["Zenith Co — INV128", "₹55,000", "Due Fri"]],
  },
  "dash-inventory": {
    title: "Stock & Reorder Alerts",
    kpis: [["SKUs", "482", "12 new", true], ["Low stock", "9", "reorder now", false], ["Dead stock", "₹86K", "34 items", false]],
    bars: [80, 65, 90, 40, 55, 30, 70, 85, 45, 60, 75, 50],
    rows: [["Steel Bottle 1L", "6 left", "Reorder"], ["Yoga Mat Pro", "3 left", "Reorder"], ["LED Strip 5m", "142", "OK"]],
  },
  "dash-marketing": {
    title: "Marketing ROI — All Channels",
    kpis: [["Spend", "₹92K", "on plan", true], ["Leads", "418", "22%", true], ["CPL", "₹220", "-14%", true]],
    bars: [30, 48, 60, 55, 75, 68, 88, 80, 95, 85, 70, 90],
    rows: [["Google Search", "212 leads", "₹185 CPL"], ["Meta Ads", "158 leads", "₹240 CPL"], ["Organic/SEO", "48 leads", "₹0"]],
  },
  "dash-hr": {
    title: "HR & Attendance Analytics",
    kpis: [["Headcount", "86", "4 joining", true], ["Attendance", "94.2%", "1.1%", true], ["OT cost", "₹1.2L", "18%", false]],
    bars: [88, 92, 85, 95, 90, 94, 89, 96, 91, 93, 87, 94],
    rows: [["Production", "97% attendance", "▲"], ["Sales", "93%", "—"], ["Support", "91%", "▼"]],
  },
  "dash-excel": {
    title: "Automated MIS — Daily Report",
    kpis: [["Sheets merged", "14", "auto", true], ["Errors fixed", "37", "validation", true], ["Refresh", "1-click", "9:00 AM", true]],
    bars: [50, 62, 58, 70, 66, 78, 72, 85, 80, 88, 84, 92],
    rows: [["Branch A — daily sales", "synced", "9:01 AM"], ["Branch B — daily sales", "synced", "9:01 AM"], ["Purchase register", "synced", "9:02 AM"]],
  },
  "dash-exec": {
    title: "Executive Command Center",
    kpis: [["MRR", "₹24.8L", "6%", true], ["Cash runway", "11 mo", "healthy", true], ["Pipeline", "₹68L", "32 deals", true]],
    bars: [55, 60, 58, 68, 72, 70, 78, 82, 80, 88, 85, 94],
    rows: [["Sales pipeline", "₹68L", "▲"], ["Ops health", "97.8%", "—"], ["Support SLA", "99.1%", "▲"]],
  },
};

export function DashboardPreview({ id, accent }: { id: string; accent: string }) {
  const c = DASH_CONTENT[id] ?? DASH_CONTENT["dash-sales"];
  return (
    <div className="flex-1 flex flex-col p-4 gap-3 text-left">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-white">{c.title}</p>
        <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-[7px] font-bold text-slate-300">Live · Auto-refresh</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {c.kpis.map(([l, v, d, up]) => <Kpi key={l} label={l} value={v} delta={d} up={up} />)}
      </div>
      <div className="rounded-lg bg-slate-900 border border-slate-800 p-3">
        <p className="text-[7px] uppercase tracking-wider text-slate-500 font-bold mb-2">Last 12 periods</p>
        <BarChart values={c.bars} color={accent} />
      </div>
      <div className="rounded-lg bg-slate-900 border border-slate-800 divide-y divide-slate-800">
        {c.rows.map(([a, b, s]) => (
          <div key={a} className="flex items-center justify-between px-3 py-1.5">
            <span className="text-[8px] font-semibold text-slate-300">{a}</span>
            <span className="text-[8px] font-black text-white">{b}</span>
            <span className="text-[7px] font-bold" style={{ color: accent }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── RESUME / CAREER mockups (cv-*) ────────────────────────────── */

export function ResumePreview({ id, accent }: { id: string; accent: string }) {
  if (id === "cv-linkedin") {
    return (
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-[260px] rounded-xl bg-white overflow-hidden shadow-2xl text-left">
          <div className="h-14" style={{ background: `linear-gradient(120deg, ${accent}, ${accent}88)` }} />
          <div className="px-4 pb-4 -mt-6 space-y-2">
            <div className="size-12 rounded-full bg-slate-700 border-4 border-white flex items-center justify-center text-white text-xs font-black">RS</div>
            <div>
              <p className="text-[11px] font-black text-slate-900">Rahul Sharma</p>
              <p className="text-[8px] text-slate-600 leading-3">Operations Manager · Driving 30% cost savings in supply chain | Six Sigma</p>
              <p className="text-[7px] text-slate-400 mt-0.5">Mumbai · 500+ connections</p>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-full px-3 py-1 text-[8px] font-bold text-white" style={{ background: accent }}>Open to work</span>
              <span className="rounded-full border border-slate-300 px-3 py-1 text-[8px] font-bold text-slate-600">Message</span>
            </div>
            <div className="border-t border-slate-100 pt-2 space-y-1.5">
              <PaperLine w="90%" /><PaperLine w="75%" /><PaperLine w="82%" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (id === "cv-portfolio") {
    return (
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-[280px] rounded-xl bg-white overflow-hidden shadow-2xl text-left">
          <div className="p-4 text-center space-y-1" style={{ background: `${accent}15` }}>
            <div className="size-10 rounded-full mx-auto flex items-center justify-center text-white text-[10px] font-black" style={{ background: accent }}>AK</div>
            <p className="text-[11px] font-black text-slate-900">Ananya Kapoor</p>
            <p className="text-[8px] text-slate-500">UI Designer · Bengaluru</p>
            <span className="inline-block rounded-full px-3 py-1 text-[8px] font-bold text-white" style={{ background: accent }}>Download Resume</span>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {["Food app redesign", "Fintech dashboard", "Travel branding", "SaaS website"].map((p) => (
              <div key={p} className="rounded-lg border border-slate-200 p-2 space-y-1">
                <div className="h-8 rounded" style={{ background: `${accent}25` }} />
                <p className="text-[7px] font-bold text-slate-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (id === "cv-coverletter") {
    return (
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-[250px] rounded-lg bg-white shadow-2xl p-5 space-y-2.5 text-left">
          <p className="text-[10px] font-black text-slate-900">Priya Nair</p>
          <p className="text-[7px] text-slate-400">priya@email.com · +91 98XXX XXXXX</p>
          <div className="border-t border-slate-100 pt-2 space-y-1.5">
            <p className="text-[8px] font-bold text-slate-700">Dear Hiring Manager,</p>
            <PaperLine w="100%" /><PaperLine w="94%" /><PaperLine w="97%" /><PaperLine w="60%" />
            <PaperLine w="100%" /><PaperLine w="88%" /><PaperLine w="45%" />
          </div>
          <p className="text-[8px] font-bold" style={{ color: accent }}>Warm regards, Priya</p>
        </div>
      </div>
    );
  }
  // document-style resumes: cv-ats (default), cv-fresher, cv-tech, cv-executive
  const variants: Record<string, { name: string; role: string; first: string; chips: string[] }> = {
    "cv-ats": { name: "ROHAN VERMA", role: "Senior Sales Manager", first: "EXPERIENCE", chips: ["CRM", "B2B Sales", "Forecasting", "Team Lead"] },
    "cv-fresher": { name: "SNEHA DAS", role: "B.Tech CSE · 2026", first: "PROJECTS", chips: ["Python", "SQL", "React", "2 Internships"] },
    "cv-tech": { name: "ARJUN MEHTA", role: "Full-Stack Developer", first: "TECH STACK", chips: ["Node.js", "React", "PostgreSQL", "AWS"] },
    "cv-executive": { name: "VIKRAM SETH", role: "VP Operations · 18 yrs", first: "LEADERSHIP HIGHLIGHTS", chips: ["P&L ₹40Cr", "Team of 120", "3 Plants"] },
  };
  const v = variants[id] ?? variants["cv-ats"];
  return (
    <div className="flex-1 flex items-center justify-center p-5">
      <div className="w-full max-w-[250px] rounded-lg bg-white shadow-2xl p-5 space-y-3 text-left">
        <div className="border-b-2 pb-2" style={{ borderColor: accent }}>
          <p className="text-[11px] font-black tracking-wide text-slate-900">{v.name}</p>
          <p className="text-[8px] font-semibold" style={{ color: accent }}>{v.role}</p>
          <p className="text-[7px] text-slate-400 mt-0.5">email@domain.com · +91 98XXX XXXXX · LinkedIn</p>
        </div>
        <div className="space-y-1.5">
          <p className="text-[8px] font-black tracking-wider" style={{ color: accent }}>{v.first}</p>
          <PaperLine w="95%" dark /><PaperLine w="88%" /><PaperLine w="92%" /><PaperLine w="70%" />
        </div>
        <div className="space-y-1.5">
          <p className="text-[8px] font-black tracking-wider" style={{ color: accent }}>SKILLS</p>
          <div className="flex flex-wrap gap-1">
            {v.chips.map((c) => (
              <span key={c} className="rounded px-1.5 py-0.5 text-[7px] font-bold text-slate-700" style={{ background: `${accent}18` }}>{c}</span>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[8px] font-black tracking-wider" style={{ color: accent }}>EDUCATION</p>
          <PaperLine w="80%" dark /><PaperLine w="55%" />
        </div>
        <p className="text-[6px] text-emerald-600 font-bold">✓ ATS-parse tested · clean single column</p>
      </div>
    </div>
  );
}

/* ── CUSTOM SOFTWARE mockups (soft-*) ──────────────────────────── */

export function SoftwarePreview({ id, accent }: { id: string; accent: string }) {
  const shells: Record<string, { title: string; body: ReactNode }> = {
    "soft-crm": {
      title: "LeadDesk CRM",
      body: (
        <div className="grid grid-cols-3 gap-2 flex-1">
          {[["New", ["Café Rio — website", "GymFit — app"]], ["Follow-up", ["Zenith — CRM demo", "UrbanNest — quote sent"]], ["Won", ["TrackFlow — ₹85K"]]].map(([col, cards]) => (
            <div key={col as string} className="rounded-lg bg-slate-900 border border-slate-800 p-2 space-y-1.5">
              <p className="text-[7px] font-black uppercase tracking-wider" style={{ color: accent }}>{col as string}</p>
              {(cards as string[]).map((card) => (
                <div key={card} className="rounded bg-slate-800 border border-slate-700/60 px-2 py-1.5 text-[7px] font-semibold text-slate-200 leading-3">{card}</div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    "soft-billing": {
      title: "BillFlow — GST Invoicing",
      body: (
        <div className="flex-1 rounded-lg bg-white p-3.5 text-left space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-black text-slate-900">TAX INVOICE #A-1042</p>
              <p className="text-[7px] text-slate-500">GSTIN: 21XXXXX1234Z5 · 07 Jul 2026</p>
            </div>
            <span className="rounded bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[7px] font-black">PAID</span>
          </div>
          {[["Business website — 6 pages", "₹12,600"], ["Maintenance (1 mo)", "₹1,999"], ["CGST+SGST @18%", "₹2,628"]].map(([a, b]) => (
            <div key={a} className="flex justify-between text-[8px] text-slate-700 border-t border-slate-100 pt-1"><span>{a}</span><b>{b}</b></div>
          ))}
          <div className="flex justify-between text-[9px] font-black text-slate-900 border-t-2 pt-1" style={{ borderColor: accent }}>
            <span>Total</span><span>₹17,227</span>
          </div>
        </div>
      ),
    },
    "soft-inventory": {
      title: "StockPilot — Inventory",
      body: (
        <div className="flex-1 rounded-lg bg-slate-900 border border-slate-800 divide-y divide-slate-800 text-left">
          {[["Steel Bottle 1L", "SKU-104", "6", true], ["Yoga Mat Pro", "SKU-221", "3", true], ["LED Strip 5m", "SKU-318", "142", false], ["Desk Stand", "SKU-407", "58", false]].map(([n, s, q, low]) => (
            <div key={s as string} className="flex items-center justify-between px-3 py-2">
              <div><p className="text-[8px] font-bold text-white">{n as string}</p><p className="text-[7px] text-slate-500">{s as string}</p></div>
              <span className={`rounded px-2 py-0.5 text-[7px] font-black ${low ? "bg-rose-500/15 text-rose-400" : "bg-emerald-500/15 text-emerald-400"}`}>
                {q as string} {low ? "· REORDER" : "in stock"}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    "soft-booking": {
      title: "SlotMaster — Bookings",
      body: (
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-4 gap-1.5">
            {["Mon 10", "Mon 11", "Mon 12", "Mon 4", "Tue 10", "Tue 11", "Tue 3", "Tue 5"].map((slot, i) => (
              <div key={slot} className={`rounded px-1 py-1.5 text-center text-[7px] font-bold border ${i % 3 === 0 ? "text-white border-transparent" : "bg-slate-900 text-slate-400 border-slate-800"}`} style={i % 3 === 0 ? { background: accent } : {}}>
                {slot}{i % 3 === 0 ? " ✓" : ""}
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 flex justify-between items-center">
            <span className="text-[8px] font-semibold text-slate-300">Branch: Koramangala · Staff: Meera</span>
            <span className="text-[7px] font-black text-emerald-400">Advance ₹500 held</span>
          </div>
        </div>
      ),
    },
    "soft-erp": {
      title: "FactoryOS — Mini ERP",
      body: (
        <div className="flex-1 space-y-2">
          {[["Order #218 — 500 units", 80], ["Order #219 — 1,200 units", 45], ["Order #221 — 300 units", 15]].map(([o, p]) => (
            <div key={o as string} className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 space-y-1.5">
              <div className="flex justify-between text-[8px] font-bold text-white"><span>{o as string}</span><span style={{ color: accent }}>{p as number}%</span></div>
              <div className="h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${p}%`, background: accent }} /></div>
              <p className="text-[7px] text-slate-500">Intake → Cutting → Assembly → QC → Dispatch</p>
            </div>
          ))}
        </div>
      ),
    },
    "soft-portal": {
      title: "ClientHub — Portal",
      body: (
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-2">
            <p className="text-[8px] font-black text-white">Welcome, Kiran</p>
            <div className="rounded bg-slate-800 px-2 py-1.5 text-[7px] text-slate-300">Project status: <b style={{ color: accent }}>In review</b></div>
            <div className="rounded bg-slate-800 px-2 py-1.5 text-[7px] text-slate-300">Next milestone: 12 Jul</div>
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 space-y-1.5">
            <p className="text-[7px] font-black uppercase tracking-wider text-slate-500">Documents</p>
            {["Quotation_v2.pdf", "Design_preview.fig", "Invoice_1042.pdf"].map((d) => (
              <p key={d} className="text-[7px] font-semibold truncate" style={{ color: accent }}>📄 {d}</p>
            ))}
          </div>
        </div>
      ),
    },
    "soft-api": {
      title: "SyncBridge — Integrations",
      body: (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            {["CRM", "Sheets", "WhatsApp", "Payments"].map((n, i) => (
              <div key={n} className="flex items-center gap-2">
                <div className="rounded-lg border px-2.5 py-2 text-[8px] font-black text-white" style={{ borderColor: `${accent}66`, background: `${accent}18` }}>{n}</div>
                {i < 3 && <span className="text-[10px]" style={{ color: accent }}>⇄</span>}
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 w-full max-w-[260px] space-y-1">
            {[["Lead synced CRM → Sheets", "2s ago"], ["Payment webhook received", "1m ago"], ["Retry queued (timeout)", "4m ago"]].map(([e, t]) => (
              <div key={e} className="flex justify-between text-[7px]"><span className="text-slate-300 font-semibold">{e}</span><span className="text-slate-500">{t}</span></div>
            ))}
          </div>
        </div>
      ),
    },
  };
  const shell = shells[id] ?? shells["soft-crm"];
  return (
    <div className="flex-1 flex flex-col p-4 gap-2.5 text-left">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-white">{shell.title}</p>
        <div className="flex gap-1.5 text-[7px] font-bold">
          <span className="rounded bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-300">Admin</span>
          <span className="rounded px-2 py-0.5 text-white" style={{ background: accent }}>+ New</span>
        </div>
      </div>
      {shell.body}
      <p className="text-[7px] text-slate-500">✓ Role-based login · reports export · runs on web & mobile</p>
    </div>
  );
}
