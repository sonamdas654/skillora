// Render a local HTML file (or URL) to a full-page PNG.
// Usage: node tools/qa/shot.mjs <html-path-or-url> <out.png> [width]
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const [, , input, out, widthArg] = process.argv;
if (!input || !out) {
  console.error("usage: node tools/qa/shot.mjs <html-path-or-url> <out.png> [width]");
  process.exit(1);
}

const target = existsSync(input) ? pathToFileURL(input).href : input;
const width = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height: 1000 },
  deviceScaleFactor: 2,
});
await page.goto(target, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Scroll the whole page first. Scroll-triggered reveals start at opacity 0,
// so without this a full-page screenshot shows every below-the-fold section
// as blank and lies about what a real visitor sees.
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const step = Math.round(window.innerHeight * 0.5);
  let y = 0;
  // Re-read the height each pass: lazy content and reveals can grow the page.
  for (let guard = 0; guard < 200; guard++) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (y > max) break;
    window.scrollTo(0, y);
    await sleep(220);
    y += step;
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await sleep(500);
  window.scrollTo(0, 0);
  await sleep(400);
});

// Fail loudly rather than silently shipping a screenshot full of invisible
// sections: anything still at opacity 0 after a full scroll is a real bug.
const stillHidden = await page.evaluate(() => {
  // Decorative layers (aria-hidden, or pointer-events:none glows that fade in
  // on hover) are meant to be transparent — only readable content counts.
  const isDecorative = (el) =>
    el.getAttribute("aria-hidden") === "true" ||
    el.closest("[aria-hidden='true']") !== null ||
    getComputedStyle(el).pointerEvents === "none";
  return [...document.querySelectorAll("main *")].filter((el) => {
    if (getComputedStyle(el).opacity !== "0") return false;
    if (el.getBoundingClientRect().height <= 40) return false;
    if (isDecorative(el)) return false;
    return (el.textContent || "").trim().length > 0;
  }).length;
});
if (stillHidden > 0) {
  console.warn(`warning: ${stillHidden} element(s) still at opacity 0 after scrolling`);
}

await page.waitForTimeout(900);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("wrote " + out);
