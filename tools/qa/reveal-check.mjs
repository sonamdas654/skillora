// Proves the reveal system degrades safely.
//
// The failure this guards against is real: the previous framer-motion Reveal
// started at opacity 0 and only became visible if an IntersectionObserver
// fired, so print, reader mode, a headless capture or a failed hydration left
// whole sections permanently blank.
//
// Usage: node tools/qa/reveal-check.mjs <url>
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3100/how-it-works";
// Opacity is not the only way a reveal can leave content invisible. The
// "unfurl" variant hides with clip-path: inset(0 100% 0 0), which clips the
// element to nothing while opacity stays 1 — an opacity-only check would call
// that page perfectly fine.
const countHidden = () =>
  [...document.querySelectorAll("[data-reveal]")].filter((el) => {
    const s = getComputedStyle(el);
    if (s.opacity === "0") return true;
    const clip = s.clipPath;
    return !!clip && clip !== "none" && /inset\(\s*0(px)?\s+100%/.test(clip);
  }).length;

const browser = await chromium.launch();
let failures = 0;
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

// 1. JavaScript disabled entirely.
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const total = await page.evaluate(() => document.querySelectorAll("[data-reveal]").length);
  const hidden = await page.evaluate(countHidden);
  check("no JS: every reveal visible", hidden === 0, `${total} reveals, ${hidden} hidden`);
  await ctx.close();
}

// 2. prefers-reduced-motion: content visible, no animation.
{
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const hidden = await page.evaluate(countHidden);
  const motionAttr = await page.evaluate(() =>
    document.documentElement.getAttribute("data-motion")
  );
  check("reduced motion: nothing hidden", hidden === 0, `${hidden} hidden`);
  check("reduced motion: data-motion not set", motionAttr === null, `got ${motionAttr}`);
  await ctx.close();
}

// 3. Normal visitor: hidden before scroll, all revealed after.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const before = await page.evaluate(countHidden);
  check("normal: below-fold reveals start hidden", before > 0, `${before} hidden`);

  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0, g = 0; g < 200; g++, y += step) {
      if (y > document.documentElement.scrollHeight - window.innerHeight) break;
      window.scrollTo(0, y);
      await sleep(150);
    }
    await sleep(500);
  });
  const after = await page.evaluate(countHidden);
  check("normal: all revealed after scrolling", after === 0, `${after} still hidden`);
  await ctx.close();
}

// 4. Failsafe: hydration never happens, page must self-heal.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  // Block the app chunks so the boot script runs but React never hydrates.
  await page.route("**/_next/static/chunks/**", (r) => r.abort());
  await page.goto(url, { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.waitForTimeout(4500);
  const hidden = await page.evaluate(countHidden);
  check("hydration blocked: failsafe reveals everything", hidden === 0, `${hidden} still hidden`);
  await ctx.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
