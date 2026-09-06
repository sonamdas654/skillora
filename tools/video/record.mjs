// Films the hero scenes against a running build.
//
// Usage:
//   npx next build && npx next start -p 3100
//   node tools/video/record.mjs --base http://localhost:3100
//
// Output: tools/video/.raw/<id>.webm (gitignored) plus a poster PNG per scene.
// tools/video/encode.mjs turns those into the shipped assets.
import { chromium } from "playwright";
import { mkdirSync, rmSync, renameSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES, HIDE_CHROME_CSS, RECORD_SIZE } from "./scenes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const RAW = join(here, ".raw");

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const BASE = argOf("base", "http://localhost:3100").replace(/\/$/, "");
const only = argOf("only", null);

rmSync(RAW, { recursive: true, force: true });
mkdirSync(RAW, { recursive: true });

const scenes = only ? SCENES.filter((s) => s.id === only) : SCENES;
if (!scenes.length) {
  console.error(`no scene matches --only ${only}`);
  process.exit(1);
}

const browser = await chromium.launch();

for (const scene of scenes) {
  const started = Date.now();

  // One context per scene: Playwright records a whole context session, so
  // separate contexts are what give separate clips.
  const context = await browser.newContext({
    viewport: RECORD_SIZE,
    recordVideo: { dir: RAW, size: RECORD_SIZE },
    // Film with motion on regardless of the host machine's settings.
    reducedMotion: "no-preference",
    colorScheme: "light",
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const url = BASE + scene.route;
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  if (!res || res.status() !== 200) {
    console.error(`  ${scene.id}: ${url} returned ${res?.status()}`);
    await context.close();
    continue;
  }

  await page.addStyleTag({ content: HIDE_CHROME_CSS });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  // Poster comes from the live page, not from a decoded video frame — it is
  // the LCP element, so it needs to be as clean as possible.
  await page.waitForTimeout(Math.max(0, scene.posterAtMs - 500));
  await page.screenshot({
    path: join(RAW, `${scene.id}-poster.png`),
    clip: { x: 0, y: 0, ...RECORD_SIZE },
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  await scene.choreograph(page);

  const videoHandle = page.video();
  await context.close(); // flushes the video file
  const produced = await videoHandle?.path();
  if (produced && existsSync(produced)) {
    renameSync(produced, join(RAW, `${scene.id}.webm`));
  }

  console.log(`  filmed ${scene.id} (${((Date.now() - started) / 1000).toFixed(1)}s)`);
}

await browser.close();
console.log(`\nraw footage in ${RAW}`);
