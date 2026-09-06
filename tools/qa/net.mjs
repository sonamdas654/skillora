// List failing network requests for a page.
// Usage: node tools/qa/net.mjs <url>
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const bad = [];
page.on("response", (r) => {
  if (r.status() >= 400) bad.push(`${r.status()} ${r.request().resourceType()} ${r.url()}`);
});
page.on("requestfailed", (r) => bad.push(`FAILED ${r.resourceType()} ${r.url()}`));

await page.goto(process.argv[2], { waitUntil: "networkidle" });
console.log(bad.length ? bad.join("\n") : "no failing requests");
await browser.close();
