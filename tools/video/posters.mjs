// Stills for the "what we build" band on the homepage.
//
// Four of the seven core services already have footage in public/hero — the
// same posters the hero carousel loads, so reusing them here costs nothing on
// the wire. Three do not: branding, marketing and custom software were never
// filmed, because a static admin table makes poor hero footage.
//
// They photograph fine. This captures one still from each of those five
// demos, at the same 1440x810 the hero was filmed at, with Skilloura's own
// banner hidden (that is site chrome, not product) so the card shows the
// build and nothing else.
//
// Usage:
//   npx next dev -p 3123        (or a production `next start`)
//   node tools/video/posters.mjs --base http://localhost:3123
//
// Re-run whenever those demos change; the manifest is the only thing React
// reads, so no filename is ever hardcoded in a component.
import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { HIDE_CHROME_CSS } from "./scenes.mjs";

// Narrower than the hero's 1440x810, deliberately. These demos are short
// pages with max-width containers: filmed at 1440 the content ends around
// y=480 and the card is a third empty grey. At 1120 the same layout fills
// the 16:9 frame, and the card is never wider than ~640 CSS px anyway.
const STILL_SIZE = { width: 1120, height: 630 };

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "..", "public", "build");
const TMP = join(here, ".stills");
const FFMPEG = process.env.SKILLOURA_FFMPEG || ffmpegPath;

const args = process.argv.slice(2);
const argOf = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};
const BASE = argOf("base", "http://localhost:3123").replace(/\/$/, "");

/** Where each still comes from, and how far down the page to look. */
const STILLS = [
  {
    id: "brand",
    route: "/demo/brand-refresh",
    serviceSlug: "logo-branding",
    scrollY: 0,
  },
  {
    id: "marketing",
    route: "/demo/mkt-seo",
    serviceSlug: "digital-marketing",
    scrollY: 0,
  },
  {
    id: "video",
    route: "/demo/vid-ad",
    serviceSlug: "video-editing",
    scrollY: 0,
  },
  {
    id: "resume",
    route: "/demo/cv-ats",
    serviceSlug: "resume-career",
    scrollY: 0,
  },
  {
    id: "software",
    route: "/demo/soft-crm",
    serviceSlug: "custom-software",
    scrollY: 0,
    // The CRM concept is a genuinely short page — its content ends at 480px
    // and a full 630 frame is a third empty. Crop to the content; the card
    // uses object-cover, so a shorter source simply fills the same tile.
    clipHeight: 480,
  },
];

const run = (a) => execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...a]);
const kb = (b) => `${(b / 1024).toFixed(0)} kB`;

/** Content hash in the filename, so these can be served immutable forever. */
function publish(srcPath, id, ext) {
  const buf = readFileSync(srcPath);
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 8);
  // Drop any previous build of this id — otherwise stale hashes accumulate.
  for (const f of readdirSync(OUT)) {
    if (f.startsWith(`${id}.`) && f.endsWith(`.${ext}`)) unlinkSync(join(OUT, f));
  }
  const name = `${id}.${hash}.${ext}`;
  writeFileSync(join(OUT, name), buf);
  return { src: `/build/${name}`, bytes: buf.length };
}

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const entries = [];

for (const still of STILLS) {
  const context = await browser.newContext({
    viewport: STILL_SIZE,
    reducedMotion: "no-preference",
    colorScheme: "light",
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const url = BASE + still.route;
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  if (!res || res.status() !== 200) {
    console.error(`  ${still.id}: ${url} returned ${res?.status()}`);
    await context.close();
    process.exitCode = 1;
    continue;
  }

  await page.addStyleTag({ content: HIDE_CHROME_CSS });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((y) => window.scrollTo(0, y), still.scrollY);
  // Reveals are IntersectionObserver-gated; give them room to finish or the
  // still is a photograph of a half-faded section.
  await page.waitForTimeout(1800);
  await page.waitForFunction(
    () => document.getAnimations().every((a) => a.playState !== "running"),
    null,
    { timeout: 6000 }
  ).catch(() => {});

  const png = join(TMP, `${still.id}.png`);
  const clip = { x: 0, y: 0, width: STILL_SIZE.width, height: still.clipHeight ?? STILL_SIZE.height };
  await page.screenshot({ path: png, clip });
  await context.close();

  // Downscale to 1x on the way out: these render at most ~640 CSS px wide in
  // the card, so shipping the 2x capture would be three times the bytes for
  // pixels nobody sees.
  const webp = join(TMP, `${still.id}.webp`);
  const jpg = join(TMP, `${still.id}.jpg`);
  run(["-i", png, "-vf", `scale=${STILL_SIZE.width}:-1`, "-c:v", "libwebp", "-quality", "76", "-compression_level", "6", webp]);
  run(["-i", png, "-vf", `scale=${STILL_SIZE.width}:-1`, "-q:v", "6", jpg]);

  const entry = {
    id: still.id,
    route: still.route,
    serviceSlug: still.serviceSlug,
    width: clip.width,
    height: clip.height,
    webp: publish(webp, still.id, "webp"),
    jpg: publish(jpg, still.id, "jpg"),
  };
  entries.push(entry);
  console.log(`  ${still.id.padEnd(10)} webp ${kb(entry.webp.bytes).padStart(7)}  jpg ${kb(entry.jpg.bytes).padStart(7)}`);
}

await browser.close();

writeFileSync(
  join(OUT, "manifest.json"),
  JSON.stringify({ stills: entries, generatedAt: new Date().toISOString() }, null, 2) + "\n",
  "utf8"
);

const total = entries.reduce((a, e) => a + e.webp.bytes, 0);
console.log(`\n${entries.length} stills, ${kb(total)} of webp in public/build`);
if (entries.length !== STILLS.length) {
  console.error("not every still was captured — the manifest is incomplete");
  process.exitCode = 1;
}
