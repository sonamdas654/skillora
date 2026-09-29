// Ad-hoc DOM probe against a running server.
// Usage: node tools/qa/probe.mjs <url> "<js expression evaluated in page>"
import { chromium } from "playwright";

const [, , url, expr, widthArg] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(widthArg) || 1440, height: 1000 } });
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(1200);
const result = await page.evaluate(expr);
console.log(JSON.stringify(result, null, 2));
await browser.close();
