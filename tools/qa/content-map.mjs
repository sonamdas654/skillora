// Extract the real search-facing signals from every public route, so the
// keyword and cannibalisation work is done against what the site actually
// says rather than against what someone remembers it saying.
//
// Usage: node tools/qa/content-map.mjs > docs/_content-map.json
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const sitemapXml = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ""))
  .map((p) => p || "/");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const out = [];

for (const route of urls) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" }).catch(() => null);
  if (!res || res.status() >= 400) {
    out.push({ route, status: res?.status() ?? 0 });
    continue;
  }
  const d = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content ?? "",
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
    h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim().slice(0, 90)),
    words: (document.querySelector("main")?.innerText ?? "").split(/\s+/).filter(Boolean).length,
    internalLinks: [...document.querySelectorAll('main a[href^="/"]')].map((a) =>
      a.getAttribute("href")
    ),
  }));
  out.push({ route, status: res.status(), ...d });
}

await browser.close();
process.stdout.write(JSON.stringify(out, null, 2));
