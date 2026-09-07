"use client";

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
      {/* slate-400, not slate-500: on this dark panel slate-500 measures
          3.74:1 at 7px, below the 4.5:1 AA floor. These previews imitate
          other people's sites, but the text in them is real text a person
          sees, and a mockup is not an exemption. slate-400 is 6.78:1. */}
      <p className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">{label}</p>
      <p className="text-sm font-black text-white mt-0.5">{value}</p>
      <p className={`text-[8px] font-bold ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "▲" : "▼"} {delta}</p>
    </div>
  );
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

/**
 * Pick black or white for text sitting on an arbitrary accent colour.
 *
 * These previews are miniatures of other people's websites, so the accent is
 * whatever that concept's brand colour is — and hardcoding white on top of it
 * failed WCAG contrast on the lighter accents (measured on /portfolio and
 * /contact). The text is small and genuinely visible, and a mockup does not
 * exempt real rendered text from being readable.
 */
function onAccent(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const srgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  // Contrast against white vs against near-black; take whichever is higher.
  return (1.05 / (lum + 0.05)) >= ((lum + 0.05) / 0.05) ? "#ffffff" : "#0b0f10";
}

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
        <span
          className="inline-block mt-1.5 rounded-full px-3.5 py-1.5 text-[9px] font-bold shadow"
          style={{ background: accent, color: onAccent(accent) }}
        >
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
        <span className="text-[8px] text-slate-400">Mobile responsive</span>
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
        <p className="text-[7px] uppercase tracking-wider text-slate-400 font-bold mb-2">Last 12 periods</p>
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

/* ── CUSTOM SOFTWARE mockups (soft-*) ──────────────────────────── */

