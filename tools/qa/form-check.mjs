// End-to-end checks for the requirement flow.
//
// This route holds the highest-value logic in the repo — the localStorage
// draft, the stable ref UUID that makes a re-submit an upsert rather than a
// duplicate lead, the partial-lead capture between step 1 and step 2, and the
// login round-trip resume. A restyle must not disturb any of it, and none of
// it fails loudly if it does.
//
// Usage: node tools/qa/form-check.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const DRAFT_KEY = "skilloura_getstarted_v3";

const browser = await chromium.launch();
let failures = 0;
const check = (label, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e.message).slice(0, 160)));

// ── Metadata: the whole point of splitting the route. ──────────────────────
await page.goto(`${BASE}/get-started`, { waitUntil: "networkidle" });
const title = await page.title();
const canonical = await page.getAttribute('link[rel="canonical"]', "href");
const description = await page.getAttribute('meta[name="description"]', "content");
check("route exports a title", title.length > 10 && !/^Skilloura —/.test(title), title);
check("route exports a canonical", Boolean(canonical), canonical ?? "none");
check("route exports a description", Boolean(description), (description ?? "").slice(0, 50) + "…");

// ── Step 1 fields exist under the exact names the flow reads. ──────────────
for (const name of ["name", "email", "phone"]) {
  const n = await page.locator(`#field-${name}`).count();
  check(`step 1 has a labelled "${name}" field`, n > 0);
  // A label that points at nothing is the same as no label at all.
  const labelled = await page.locator(`label[for="field-${name}"]`).count();
  check(`"${name}" label is associated with its input`, labelled > 0);
}

// ── Fill step 1 and advance. ───────────────────────────────────────────────
await page.fill("#field-name", "QA Draft Tester");
await page.fill("#field-email", "qa-draft@example.com");
await page.fill("#field-phone", "9999999999");
await page.getByRole("button", { name: /continue/i }).click();
await page.waitForTimeout(1500);

const draftRaw = await page.evaluate((k) => localStorage.getItem(k), DRAFT_KEY);
check("draft is written to localStorage on continue", Boolean(draftRaw));

let draft = null;
try {
  draft = JSON.parse(draftRaw ?? "null");
} catch {
  /* handled by the checks below */
}
check("draft keeps the entered name", draft?.name === "QA Draft Tester", draft?.name);
check("draft carries a stable ref", typeof draft?.ref === "string" && draft.ref.length > 10, draft?.ref);

// Assert on the rendered document rather than a text locator, which is
// sensitive to how the progress label is split across elements.
const step2 = await page.evaluate(() => ({
  label: /Step 2 of 2/i.test(document.body.innerText),
  serviceField: Boolean(document.querySelector("#field-service")),
}));
check("advances to step 2", step2.label, step2.label ? "" : "progress label not found");
check("step 2 renders the service field", step2.serviceField);

// ── Reload: the draft must restore, and the ref must not change. ───────────
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const restored = await page.evaluate((k) => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? "null");
  } catch {
    return null;
  }
}, DRAFT_KEY);
check("draft survives a reload", restored?.name === "QA Draft Tester");
check(
  "ref is stable across reload (upsert, not a duplicate lead)",
  restored?.ref === draft?.ref,
  `${draft?.ref} vs ${restored?.ref}`
);

check("no uncaught page errors", consoleErrors.length === 0, consoleErrors.join(" | "));

// ── Leave no test draft behind. ────────────────────────────────────────────
await page.evaluate((k) => localStorage.removeItem(k), DRAFT_KEY);
await ctx.close();
await browser.close();
process.exit(failures ? 1 : 0);
