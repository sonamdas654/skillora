// Regression snapshot for the redesign.
//
// Visits every public route and records the things that break SILENTLY when
// JSX is rewritten — analytics attributes, WhatsApp links, form field names,
// console errors. Diffing this against a committed baseline is what turns
// "remember not to break it" into an assertion.
//
// Usage:
//   node tools/qa/snapshot.mjs --base http://localhost:3100 --out tools/qa/baseline.json
//   node tools/qa/snapshot.mjs --base http://localhost:3100 --compare tools/qa/baseline.json
import { chromium } from "playwright";
import { writeFileSync, readFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const BASE = arg("base", "http://localhost:3100").replace(/\/$/, "");
const OUT = arg("out", null);
const COMPARE = arg("compare", null);

const ROUTES = [
  "/",
  "/about",
  "/ai-solutions",
  "/blog",
  "/contact",
  "/faq",
  "/get-started",
  "/how-it-works",
  "/portfolio",
  "/pricing",
  "/references",
  "/services",
  "/solutions",
  "/thank-you",
  "/services/website-development",
  "/services/ai-automation",
  "/solutions/restaurant-website",
  "/portfolio/restaurant-website-concept",
  "/demo/web-saas",
  // Phase 9 focus service pages — same template, but they resolve through a
  // separate list, so a change to that lookup would break them silently.
  "/services/website-speed-optimization",
  "/services/api-integration",
  "/services/local-seo",
  // Phase 11.
  "/case-studies",
  "/case-studies/the-half-that-costs-the-money",
  "/case-studies/decide-first-then-chart",
  // A real article, so the blog renderer and its CTA are covered too.
  "/blog/website-vs-web-app",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/revision-policy",
  "/payment-policy",
  "/data-security",
];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const report = {};

for (const route of ROUTES) {
  const page = await context.newPage();
  const consoleErrors = [];
  // /_vercel/insights only exists once deployed on Vercel; locally it 404s on
  // every page. Left unfiltered it drowns out real errors.
  const IGNORED_URL = [/_vercel\/insights/];
  page.on("response", (r) => {
    if (r.status() < 400) return;
    if (IGNORED_URL.some((re) => re.test(r.url()))) return;
    consoleErrors.push(`${r.status()} ${r.url().slice(0, 160)}`);
  });
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    // The generic "Failed to load resource" line carries no URL, so it is
    // redundant with the response listener above.
    if (/Failed to load resource/i.test(text)) return;
    if (IGNORED_URL.some((re) => re.test(text))) return;
    consoleErrors.push(text.slice(0, 200));
  });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + String(e.message).slice(0, 200)));

  let status = 0;
  try {
    const res = await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
    status = res?.status() ?? 0;
    await page.waitForTimeout(600);
  } catch (e) {
    report[route] = { status: 0, error: String(e).slice(0, 200) };
    await page.close();
    continue;
  }

  const data = await page.evaluate(() => {
    const q = (sel) => [...document.querySelectorAll(sel)];

    // The six analytics events ride on these. SiteAnalytics uses
    // closest("a,button"), so the host element tag matters as much as the
    // attribute existing.
    const track = q("[data-track]")
      .map((el) => `${el.getAttribute("data-track")}@${el.tagName}`)
      .sort();

    // WhatsApp clicks are auto-detected from the href, so a CTA that stops
    // being an <a> stops being tracked with no error anywhere.
    const whatsapp = q('a[href*="wa.me"], a[href*="api.whatsapp"], a[href*="whatsapp.com"]')
      .map((el) => el.tagName)
      .sort();

    // Input names are the Zod contract on /api/contact and the answer keys
    // on /get-started.
    const inputs = q("main input[name], main textarea[name], main select[name]")
      .map((el) => el.getAttribute("name"))
      .sort();

    // Content a visitor cannot read. Decorative layers (aria-hidden, or
    // pointer-events:none glows that fade in on hover) are intentionally
    // transparent and are not a defect.
    const isDecorative = (el) =>
      el.getAttribute("aria-hidden") === "true" ||
      el.closest("[aria-hidden='true']") !== null ||
      getComputedStyle(el).pointerEvents === "none";
    const hidden = q("main *").filter((el) => {
      if (getComputedStyle(el).opacity !== "0") return false;
      if (el.getBoundingClientRect().height <= 40) return false;
      if (isDecorative(el)) return false;
      return (el.textContent || "").trim().length > 0;
    }).length;

    return {
      title: document.title,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      h1: q("h1").length,
      jsonLd: q('script[type="application/ld+json"]').length,
      track,
      whatsapp,
      inputs,
      hiddenBeforeScroll: hidden,
    };
  });

  // Scroll, then re-check: a reveal that never becomes visible is a real bug.
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0, g = 0; g < 200; g++, y += step) {
      if (y > document.documentElement.scrollHeight - window.innerHeight) break;
      window.scrollTo(0, y);
      await sleep(140);
    }
    // Longer than the reveal duration plus the largest stagger, so nothing is
    // sampled mid-animation. `animation-fill-mode: both` holds opacity 0
    // during the delay window, which reads as "stuck" if measured too early.
    await sleep(1500);
  });
  const hiddenAfterScroll = await page.evaluate(() => (() => {
      const isDecorative = (el) =>
        el.getAttribute("aria-hidden") === "true" ||
        el.closest("[aria-hidden='true']") !== null ||
        getComputedStyle(el).pointerEvents === "none";
      return [...document.querySelectorAll("main *")].filter((el) => {
        if (getComputedStyle(el).opacity !== "0") return false;
        if (el.getBoundingClientRect().height <= 40) return false;
        if (isDecorative(el)) return false;
        // An element part-way through its entrance is not stuck.
        if (el.getAnimations().some((a) => a.playState === "running")) return false;
        return (el.textContent || "").trim().length > 0;
      }).length;
    })());

  report[route] = { status, ...data, hiddenAfterScroll, consoleErrors };
  await page.close();
}

await browser.close();

if (OUT) {
  writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`wrote ${OUT} (${Object.keys(report).length} routes)`);
}

if (COMPARE) {
  const base = JSON.parse(readFileSync(COMPARE, "utf8"));
  const problems = [];
  for (const route of ROUTES) {
    const a = base[route];
    const b = report[route];
    if (!a || !b) continue;
    if (a.status !== b.status) problems.push(`${route}: status ${a.status} -> ${b.status}`);
    const cmp = (key) => {
      const x = JSON.stringify(a[key]);
      const y = JSON.stringify(b[key]);
      if (x !== y) problems.push(`${route}: ${key}\n    was ${x}\n    now ${y}`);
    };
    cmp("track");
    cmp("whatsapp");
    cmp("inputs");
    if (b.hiddenAfterScroll > 0) {
      problems.push(`${route}: ${b.hiddenAfterScroll} element(s) invisible even after scrolling`);
    }
    if (b.consoleErrors?.length) {
      problems.push(`${route}: console errors -> ${b.consoleErrors.join(" | ")}`);
    }
  }
  if (problems.length) {
    console.error("REGRESSIONS:\n" + problems.map((p) => "  - " + p).join("\n"));
    process.exit(1);
  }
  console.log("no regressions against " + COMPARE);
}

if (!OUT && !COMPARE) console.log(JSON.stringify(report, null, 2));
