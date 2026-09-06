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
await page.waitForTimeout(1200);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("wrote " + out);
