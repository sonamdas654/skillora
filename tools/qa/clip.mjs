// Screenshot a vertical slice of a page, for inspecting one section.
// Usage: node tools/qa/clip.mjs <url> <out.png> <y> <height> [width]
import { chromium } from "playwright";

const [, , url, out, y, height, widthArg] = process.argv;
const width = Number(widthArg) || 1440;

const browser = await chromium.launch();
// Size the viewport to the slice being captured. A fullPage screenshot resizes
// the viewport, which makes responsive images re-evaluate their srcset — and a
// freshly selected source can still be decoding when the frame is grabbed,
// producing a blank where the image actually is. Capturing within the viewport
// avoids that entirely.
const page = await browser.newPage({
  viewport: { width, height: Number(height) },
  deviceScaleFactor: 2,
});
// "load", not "networkidle": once the hero video starts streaming the network
// never goes idle, and networkidle would hang forever.
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
await page.evaluate(() => document.fonts.ready);
if (Number(y) > 0) {
  await page.evaluate((top) => window.scrollTo(0, top), Number(y));
}
// Wait for every image in view to finish decoding before the shutter.
// Wait for visible images to finish decoding, but never hang on one that
// stalls — a screenshot tool must not be able to block the run.
await page.evaluate(async () => {
  const withTimeout = (p, ms) =>
    Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
  await withTimeout(
    Promise.all(
      [...document.images]
        .filter((i) => i.getBoundingClientRect().height > 0)
        .map((i) =>
          i.complete
            ? i.decode().catch(() => {})
            : new Promise((r) => {
                i.onload = i.onerror = r;
              })
        )
    ),
    4000
  );
});
await page.waitForTimeout(500);
await page.screenshot({ path: out });
await browser.close();
console.log("wrote " + out);
