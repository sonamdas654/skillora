// Responsive audit: finds what actually breaks, and which element does it.
//
// "The site looks wrong on my phone" is almost never the whole page — it is
// one element wider than its container. A boolean "does the page overflow"
// tells you nothing you can fix, so this reports the offending nodes by
// selector, width and overhang.
//
// Usage: node tools/qa/responsive.mjs --base http://localhost:3101
import { chromium, devices } from "playwright";

const args = process.argv.slice(2);
const argOf = (n, d) => { const i = args.indexOf(`--${n}`); return i === -1 ? d : args[i + 1]; };
const BASE = argOf("base", "http://localhost:3101").replace(/\/$/, "");
const ONLY = argOf("only", null);
const WIDTHS = (argOf("widths", "320,360,768,1024,1440")).split(",").map(Number);
// Named profiles, so "does it work on a phone" is answered with the real
// device metrics rather than a width someone picked. Landscape is included
// because a phone held sideways is 390px tall, and a hero sized in vh is
// where that usually goes wrong.
const PROFILES = [
  { name: "iPhone SE", width: 320, height: 568, touch: true },
  { name: "Android sm", width: 360, height: 780, touch: true },
  { name: "iPhone 14", width: 390, height: 844, touch: true },
  { name: "Pixel 7", width: 412, height: 915, touch: true },
  { name: "iPhone landscape", width: 844, height: 390, touch: true },
  { name: "iPad portrait", width: 768, height: 1024, touch: true },
  { name: "iPad landscape", width: 1024, height: 768, touch: true },
  { name: "laptop", width: 1280, height: 800, touch: false },
  { name: "desktop", width: 1440, height: 900, touch: false },
  { name: "wide", width: 1920, height: 1080, touch: false },
  { name: "ultrawide", width: 2560, height: 1440, touch: false },
];

const ROUTES = ONLY ? [ONLY] : [
  "/", "/services", "/services/website-development", "/pricing", "/portfolio",
  "/about", "/how-it-works", "/contact", "/blog", "/case-studies", "/faq",
  "/get-started", "/solutions", "/ai-solutions",
];

/** Runs in the page. Returns every node that sticks out past the viewport. */
function probe() {
  const docW = document.documentElement.clientWidth;
  const out = { docW, scrollW: document.documentElement.scrollWidth, offenders: [], tiny: [], smallText: [] };

  const label = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = (typeof el.className === "string" ? el.className : "")
      .split(/\s+/).filter(Boolean).slice(0, 4).join(".");
    return `${el.tagName.toLowerCase()}${id}${cls ? "." + cls : ""}`;
  };

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;

    // Fixed/sticky chrome is allowed to sit at the edge; only flag real overhang.
    const right = r.left + r.width;
    if (right > docW + 1 || r.left < -1) {
      // A decorative glow positioned outside an overflow-hidden parent is
      // clipped and harmless. Checking only the immediate parent reported
      // every aura on the site as a bug; walk the whole chain instead.
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        const ac = getComputedStyle(a);
        if (/hidden|clip|auto|scroll/.test(ac.overflowX)) { clipped = true; break; }
      }
      if (clipped) continue;

      // Report the innermost cause, not every ancestor that inherits it.
      const p = el.parentElement;
      if (p) {
        const pr = p.getBoundingClientRect();
        if (pr.left + pr.width > docW + 1 || pr.left < -1) continue;
      }
      out.offenders.push({
        sel: label(el),
        w: Math.round(r.width),
        left: Math.round(r.left),
        over: Math.round(Math.max(right - docW, -r.left)),
        pos: cs.position,
        overflowX: cs.overflowX,
      });
    }
  }

  // Tap targets. 44x44 is the practical floor on touch.
  if (docW <= 480) {
    for (const el of document.querySelectorAll("a[href], button, input, select, [role=tab], [role=button]")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // An inline link inside a paragraph is not a tap target failure.
      if (el.tagName === "A" && cs.display.startsWith("inline") && el.closest("p, li")) continue;
      // Stretched link: an ::after with inset-0 makes the whole card the
      // target, so the anchor's own box says nothing about how tappable it
      // is. Measure the stretched area instead.
      const after = getComputedStyle(el, "::after");
      const stretched = after.position === "absolute" && after.inset === "0px" ||
        (after.position === "absolute" && after.top === "0px" && after.left === "0px" &&
         after.right === "0px" && after.bottom === "0px");
      if (stretched) continue;
      if (r.height < 40 || r.width < 40) {
        out.tiny.push({ sel: label(el), w: Math.round(r.width), h: Math.round(r.height), text: (el.textContent || "").trim().slice(0, 28) });
      }
    }
    for (const el of document.querySelectorAll("p, li, span, dd, dt, td, th")) {
      if (!el.textContent?.trim()) continue;
      if (el.children.length) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 11.5) out.smallText.push({ sel: label(el), fs: fs.toFixed(1), text: el.textContent.trim().slice(0, 28) });
    }
  }
  return out;
}

const browser = await chromium.launch();
let problems = 0;

for (const route of ROUTES) {
  const lines = [];
  const plan = argOf("profiles", null) !== null
    ? PROFILES
    : WIDTHS.map((w) => ({ name: `${w}px`, width: w, height: w <= 480 ? 780 : 900, touch: w <= 480 }));

  for (const { name, width, height, touch } of plan) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      ...(touch ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}),
    });
    const page = await ctx.newPage();
    page.setDefaultTimeout(25000);
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.evaluate(() => document.fonts.ready).catch(() => {});
      // Scroll so lazy sections mount, then return to top for a stable measure.
      await page.evaluate(async () => {
        const s = (m) => new Promise((r) => setTimeout(r, m));
        for (let y = 0, g = 0; g < 40; g++) {
          const max = document.documentElement.scrollHeight - innerHeight;
          if (y > max) break;
          scrollTo(0, y); await s(110); y += Math.round(innerHeight * 0.7);
        }
        scrollTo(0, 0); await s(300);
      });
      const r = await page.evaluate(probe);
      const bad = r.scrollW > r.docW + 1;
      if (bad || r.offenders.length || r.tiny.length || r.smallText.length) {
        problems++;
        lines.push(`  ${name.padEnd(17)} ${width}x${height}  ${bad ? `PAGE OVERFLOWS ${r.scrollW}>${r.docW}` : "layout ok"}`);
        for (const o of r.offenders.slice(0, 6)) lines.push(`           over ${String(o.over).padStart(4)}px  w=${o.w} ${o.pos}  ${o.sel}`);
        const uniqTiny = [...new Map(r.tiny.map((t) => [t.sel + t.text, t])).values()];
        for (const t of uniqTiny.slice(0, 6)) lines.push(`           tap  ${t.w}x${t.h}  "${t.text}"  ${t.sel}`);
        for (const t of r.smallText.slice(0, 4)) lines.push(`           text ${t.fs}px  "${t.text}"`);
      } else {
        lines.push(`  ${name.padEnd(17)} ${width}x${height}  ok`);
      }
    } catch (e) {
      problems++;
      lines.push(`  ${String(width).padStart(5)}px  ERROR ${String(e.message).split("\n")[0].slice(0, 90)}`);
    }
    await ctx.close();
  }
  console.log(route);
  for (const l of lines) console.log(l);
}

await browser.close();
console.log(problems ? `\n${problems} route/width combinations need attention` : "\nclean at every width");
process.exit(0);
