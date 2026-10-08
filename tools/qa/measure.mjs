// Measure real delivery metrics for a set of routes against a running server.
//
// This exists because the case studies quote numbers, and the previous attempt
// at this site shipped fabricated ones ("Lighthouse 100", "Performance 99 /
// Accessibility 100") straight into the marketing copy. Anything this project
// claims about its own performance has to come out of here, on a production
// build, or it does not get published.
//
// Two measurement bugs were found and fixed while building this, both of which
// would have produced confident, wrong, published numbers:
//
//  1. response.body().length returns the DECOMPRESSED payload. It reported
//     884 kB of JS for a page that actually pulls ~259 kB over the wire — a
//     3.2x overstatement. request.sizes().responseBodySize is the encoded size.
//
//  2. Chromium intermittently reports no paint timeline at all, so FCP and LCP
//     both come back 0 — and a 0 is indistinguishable from an instantaneous
//     page, so the affected route would have been published as the fastest one.
//     It is not deterministic: across runs it hit the first route, then the
//     first and fourth. Hence RUNS below — each route is measured repeatedly,
//     zero-paint runs are discarded as failed samples rather than averaged in,
//     and the reported figure is the median of what is left. A route that
//     cannot produce a valid sample is reported as null, never as 0.
//
// Usage:
//   node tools/qa/measure.mjs                       # the six concept builds
//   node tools/qa/measure.mjs /pricing /about       # (Git Bash: prefix MSYS_NO_PATHCONV=1)
//
// Emits a table to stdout and writes tools/qa/measurements.json.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const RUNS = Number(process.env.RUNS ?? 3);

const DEFAULT_ROUTES = [
  "/portfolio/restaurant-website-concept",
  "/portfolio/gym-website-concept",
  "/portfolio/salon-website-concept",
  "/portfolio/ecommerce-concept",
  "/portfolio/ai-chatbot-concept",
  "/portfolio/sales-dashboard-concept",
];

const routes = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_ROUTES;

// A mid-range Android on a real Indian network, not a developer's laptop.
// Numbers taken on an unthrottled desktop would be true and useless.
const THROTTLE = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps — Slow 4G
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};
const CPU_SLOWDOWN = 4;

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

const browser = await chromium.launch();

async function measureOnce(route) {
  // A fresh context per run: a warm HTTP cache would quietly turn the second
  // measurement into a lie.
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", THROTTLE);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU_SLOWDOWN });

  const bytes = { total: 0, js: 0, css: 0, image: 0, font: 0, other: 0 };
  const pending = [];
  page.on("requestfinished", (req) => {
    pending.push(
      req
        .sizes()
        .then(({ responseBodySize }) => {
          const size = responseBodySize ?? 0;
          const type = req.resourceType();
          bytes.total += size;
          if (type === "script") bytes.js += size;
          else if (type === "stylesheet") bytes.css += size;
          else if (type === "image") bytes.image += size;
          else if (type === "font") bytes.font += size;
          else bytes.other += size;
        })
        .catch(() => {})
    );
  });

  const consoleErrors = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  page.on("pageerror", (e) => consoleErrors.push(String(e)));

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__lcp = e.startTime;
        // Identify the element HERE, inside the callback. Reading
        // entry.element from getEntriesByType() afterwards yields null once
        // the reference is gone, which reports "no LCP element" on a page
        // that plainly has one — and then you cannot tell what to optimise.
        const el = e.element;
        window.__lcpEl = el
          ? el.tagName.toLowerCase() +
            (el.id ? "#" + el.id : "") +
            (el.className && typeof el.className === "string"
              ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
              : "") +
            (el.tagName === "IMG" ? ` src=${(el.currentSrc || el.src || "").split("/").pop()}` : "")
          : null;
        window.__lcpSize = e.size;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        // Shifts during an interaction are the user's doing, not the page's —
        // CLS only counts unexpected ones.
        if (!e.hadRecentInput) window.__cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  // Paint timing is only reported for a page the compositor considers visible.
  await page.bringToFront();

  const response = await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 90_000 });
  await page.waitForLoadState("networkidle", { timeout: 90_000 }).catch(() => {});
  // LCP is only final once the page stops changing; give it a beat past load.
  await page.waitForTimeout(1500);
  await Promise.all(pending);

  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] ?? {};
    // Read the buffer as well as the observer: the observer can miss entries
    // that landed before the init script ran.
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    return {
      ttfb: Math.round(nav.responseStart ?? 0),
      load: Math.round(nav.loadEventEnd ?? 0),
      fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0),
      lcp: Math.round(Math.max(window.__lcp ?? 0, lcpEntries.at(-1)?.startTime ?? 0)),
      lcpElement: window.__lcpEl ?? lcpEntries.at(-1)?.element?.tagName ?? null,
      lcpSize: window.__lcpSize ?? null,
      cls: Number((window.__cls ?? 0).toFixed(4)),
      domNodes: document.getElementsByTagName("*").length,
      interactive: document.querySelectorAll("a,button,input,select,textarea").length,
      images: document.images.length,
      imagesWithAlt: [...document.images].filter((i) => i.alt?.trim()).length,
      h1: document.querySelectorAll("h1").length,
    };
  });

  await context.close();

  return {
    status: response?.status() ?? 0,
    ...m,
    bytes: Object.fromEntries(Object.entries(bytes).map(([k, v]) => [k, Math.round(v / 1024)])),
    consoleErrors,
    // A run that produced no paint timeline measured nothing usable.
    valid: m.fcp > 0 && m.lcp > 0,
  };
}

const results = [];
for (const route of routes) {
  const samples = [];
  // Allow a couple of extra attempts so a route is not reported as unmeasurable
  // just because the paint timeline dropped out twice.
  for (let attempt = 0; attempt < RUNS + 2 && samples.length < RUNS; attempt++) {
    const s = await measureOnce(route);
    if (s.valid) samples.push(s);
  }

  const last = samples.at(-1);
  results.push({
    route,
    validSamples: samples.length,
    attemptedRuns: RUNS,
    status: last?.status ?? 0,
    fcp: median(samples.map((s) => s.fcp)),
    lcp: median(samples.map((s) => s.lcp)),
    ttfb: median(samples.map((s) => s.ttfb)),
    load: median(samples.map((s) => s.load)),
    cls: samples.length ? Math.max(...samples.map((s) => s.cls)) : null,
    lcpElement: last?.lcpElement ?? null,
    bytes: last?.bytes ?? null,
    domNodes: last?.domNodes ?? null,
    interactive: last?.interactive ?? null,
    images: last?.images ?? null,
    imagesWithAlt: last?.imagesWithAlt ?? null,
    h1: last?.h1 ?? null,
    consoleErrors: last?.consoleErrors ?? [],
  });
}

await browser.close();

const out = {
  measuredAt: new Date().toISOString(),
  conditions: `Chromium, 412x915 @2x mobile, ${CPU_SLOWDOWN}x CPU throttle, 1.6 Mbps / 150 ms RTT, cold cache; median of ${RUNS} valid runs`,
  base: BASE,
  results,
};
fs.writeFileSync("tools/qa/measurements.json", JSON.stringify(out, null, 2));

const cell = (v) => (v === null ? "—" : String(v));
console.log(out.conditions + "\n");
console.log(
  ["route", "ok", "TTFB", "FCP", "LCP", "CLS", "JS kB", "CSS kB", "all kB", "nodes", "errs"]
    .map((h, i) => (i === 0 ? h.padEnd(44) : h.padStart(8)))
    .join("")
);
for (const r of results) {
  console.log(
    [
      r.route.padEnd(44),
      `${r.validSamples}/${r.attemptedRuns}`.padStart(8),
      cell(r.ttfb).padStart(8),
      cell(r.fcp).padStart(8),
      cell(r.lcp).padStart(8),
      cell(r.cls).padStart(8),
      cell(r.bytes?.js).padStart(8),
      cell(r.bytes?.css).padStart(8),
      cell(r.bytes?.total).padStart(8),
      cell(r.domNodes).padStart(8),
      cell(r.consoleErrors.length).padStart(8),
    ].join("")
  );
}
console.log("\nwrote tools/qa/measurements.json");
