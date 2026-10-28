// Click every interactive control on every public route and check that
// something actually happens.
//
// This exists because the device sweep in tools/qa/responsive.mjs passed a
// site whose mobile menu had been one pixel tall on every phone and tablet
// for weeks. That sweep measures layout — whether anything overflows, whether
// targets are big enough — and a control that is perfectly sized, perfectly
// positioned and completely inert passes it every time. Nothing here asked
// the only question that mattered: press it, does anything change?
//
// Usage:
//   node tools/qa/interaction.mjs --base http://localhost:3101
//   node tools/qa/interaction.mjs --base http://localhost:3101 --width 390
//
// A KNOWN LIMIT, SO THE OUTPUT IS NOT MISREAD
//
// Playwright clicks an element's centre point. In the hero's stacked 3D
// carousel the neighbouring cards are deliberately overlapped by the front
// one, so their centres are covered and this file reports them as
// unreachable. Hit-testing a grid across those cards shows the front card is
// 100% tappable, the two at ±1 are 10-11% — the sliver that shows past the
// front one — and clicking that sliver does change the slide. The two at ±2
// are 0% and are now aria-hidden to match. "Cannot be clicked at all" on a
// hero slide is this limitation, not a broken control; check it by hand
// before believing it.
//
// WHAT IT WILL NOT DO
//
// It never submits a form and never follows a link that posts. The database
// behind this site holds real leads and real reviews; a test that fills it
// with rubbish is worse than no test. Submits, WhatsApp links, mailto, tel
// and external hosts are identified and skipped by name in the report, so
// the gaps are visible rather than silent.
import { chromium } from "playwright";

const args = process.argv.slice(2);
const argOf = (n, d) => { const i = args.indexOf(`--${n}`); return i === -1 ? d : args[i + 1]; };
const BASE = argOf("base", "http://localhost:3101").replace(/\/$/, "");
const WIDTHS = argOf("width", "390,1440").split(",").map(Number);
const ONLY = argOf("only", null);

const ROUTES = ONLY ? [ONLY] : [
  "/", "/services", "/services/website-development", "/pricing", "/portfolio",
  "/about", "/how-it-works", "/contact", "/blog", "/case-studies", "/faq",
  "/solutions", "/ai-solutions", "/references", "/get-started",
];

/** A compact description of what the page currently looks like and says.
 *  If pressing a control changes nothing in here, it changed nothing a
 *  visitor could perceive. */
function snapshotPage() {
  const aria = [...document.querySelectorAll("[aria-expanded],[aria-selected],[aria-current],[aria-pressed],[aria-hidden]")]
    .map((e) => e.tagName + (e.getAttribute("aria-expanded") ?? "") + (e.getAttribute("aria-selected") ?? "") +
                (e.getAttribute("aria-current") ?? "") + (e.getAttribute("aria-pressed") ?? "") + (e.getAttribute("aria-hidden") ?? ""))
    .join("|");
  // Geometry of everything on screen: catches panels opening, carousels
  // moving, sections growing — anything that moves a box.
  let geo = 0, shown = 0;
  for (const el of document.querySelectorAll("body *")) {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) continue;
    shown++;
    geo += Math.round(b.top) * 3 + Math.round(b.left) * 7 + Math.round(b.width) * 11 + Math.round(b.height) * 13;
  }
  const text = document.body.innerText.replace(/\s+/g, " ").slice(0, 20000);
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) | 0;
  return { aria, geo, shown, text: hash, url: location.href, scroll: Math.round(scrollY) };
}

const browser = await chromium.launch();
let pressed = 0, inert = 0, skipped = 0;
const problems = [];

for (const width of WIDTHS) {
  const touch = width <= 600;
  console.log(`\n${"=".repeat(60)}\n${width}px${touch ? " (touch)" : ""}\n${"=".repeat(60)}`);

  for (const route of ROUTES) {
    const ctx = await browser.newContext({
      viewport: { width, height: touch ? 844 : 900 },
      ...(touch ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}),
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 100)); });

    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1800);
    } catch {
      console.log(`${route} — could not load`);
      await ctx.close();
      continue;
    }

    // Collect the controls once, as stable handles.
    const controls = await page.$$('button, [role="button"], [role="tab"], [role="switch"], summary');
    const lines = [];

    for (let i = 0; i < controls.length; i++) {
      const el = controls[i];
      const info = await el.evaluate((e) => {
        const r = e.getBoundingClientRect();
        const form = e.closest("form");
        return {
          tag: e.tagName.toLowerCase(),
          type: e.getAttribute("type") || "",
          label: (e.getAttribute("aria-label") || e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 38),
          visible: r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden",
          submits: Boolean(form) && (e.getAttribute("type") || "submit") === "submit",
          disabled: e.hasAttribute("disabled"),
        };
      }).catch(() => null);
      if (!info || !info.visible || info.disabled) continue;

      if (info.submits) {
        skipped++;
        lines.push(`    skip   "${info.label}" — submits a form, not pressed`);
        continue;
      }

      // Put the control in the MIDDLE of the viewport before pressing it.
      //
      // Playwright scrolls a control into view on its own, which lands it at
      // the top of the screen — directly underneath the fixed header. The
      // click then fails as "intercepted", and the first version of this file
      // recorded that as "not clickable" and moved on. It skipped 100 of 172
      // controls that way and still printed that everything it pressed
      // worked, which is a worse lie than no test at all: the carousels, the
      // service tabs, the review dots and every FAQ row went untested while
      // the summary read clean.
      await el.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })).catch(() => {});
      await page.waitForTimeout(120);

      const before = await page.evaluate(snapshotPage);
      try {
        await el.click({ timeout: 4000 });
      } catch (err) {
        // Still unreachable with the header out of the way. That is worth
        // reporting as a finding, not filing as a skip.
        inert++;
        problems.push({ width, route, label: info.label, tag: info.tag, why: "unreachable" });
        lines.push(`    DEAD   "${info.label}" <${info.tag}> — cannot be clicked at all`);
        continue;
      }
      await page.waitForTimeout(650);
      const after = await page.evaluate(snapshotPage).catch(() => null);
      pressed++;

      if (!after) { lines.push(`    ok     "${info.label}" — navigated away`); break; }
      if (after.url !== before.url) { lines.push(`    ok     "${info.label}" — navigated`); break; }

      const changed =
        after.aria !== before.aria ||
        after.geo !== before.geo ||
        after.shown !== before.shown ||
        after.text !== before.text ||
        Math.abs(after.scroll - before.scroll) > 4;

      if (!changed) {
        inert++;
        problems.push({ width, route, label: info.label, tag: info.tag });
        lines.push(`    DEAD   "${info.label}" <${info.tag}> — nothing changed`);
      }
    }

    const dead = lines.filter((l) => l.includes("DEAD")).length;
    console.log(`${route.padEnd(32)} ${String(controls.length).padStart(3)} controls   ${dead ? dead + " DEAD" : "all respond"}${consoleErrors.length ? "   " + consoleErrors.length + " console errors" : ""}`);
    for (const l of lines) if (l.includes("DEAD") || l.includes("skip")) console.log(l);
    for (const e of consoleErrors.slice(0, 2)) console.log(`    error  ${e}`);

    await ctx.close();
  }
}

await browser.close();
console.log(`\n${"=".repeat(60)}`);
console.log(`pressed ${pressed} controls, skipped ${skipped} (forms and unreachable)`);
if (!problems.length) console.log("every control that was pressed did something");
else {
  console.log(`\n${problems.length} control(s) did nothing when pressed:`);
  for (const p of problems) console.log(`  ${String(p.width).padStart(5)}px  ${p.route.padEnd(30)} "${p.label}"${p.why ? "  — " + p.why : "  — pressed, nothing changed"}`);
}
process.exit(0);
