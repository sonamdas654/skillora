// Screenshot a vertical slice of a page, for inspecting one section.
// Usage: node tools/qa/clip.mjs <url> <out.png> <y> <height> [width]
import { chromium } from "playwright";

const [, , url, out, y, height, widthArg] = process.argv;
const width = Number(widthArg) || 1440;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: out,
  fullPage: true,
  clip: { x: 0, y: Number(y), width, height: Number(height) },
});
await browser.close();
console.log("wrote " + out);
