// Encodes the raw footage into the assets the hero actually ships, and writes
// public/hero/manifest.json so no filename is ever hardcoded in React.
//
// Usage: node tools/video/encode.mjs
//
// Codec choice: H.264 mp4 as the universal baseline (Safari and iOS need it —
// the Playwright-bundled ffmpeg only has VP8, which is exactly why this uses
// ffmpeg-static instead), plus VP9 webm which is meaningfully smaller where
// it is supported. AV1 is available but deliberately skipped: at 8 seconds and
// 1440px the saving does not pay for the encode time, and every byte here is
// already behind a desktop-only gate.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync, renameSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import ffmpegPath from "ffmpeg-static";
import { SCENES } from "./scenes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const RAW = join(here, ".raw");
const OUT = join(here, "..", "..", "public", "hero");

const FFMPEG = process.env.SKILLOURA_FFMPEG || ffmpegPath;

const LADDER = [
  { key: "hd", width: 1440, height: 810, crfH264: 24, crfVp9: 34 },
  { key: "md", width: 1280, height: 720, crfH264: 27, crfVp9: 37 },
];

// Budgets measured the way a visitor actually experiences them, not as a sum
// of everything on disk. Nobody downloads all four renditions of a scene: a
// browser picks one format at one rung, and only for the scenes it plays.
const MAX_FILE_BYTES = 1.2 * 1024 * 1024;
/** All posters — this is the entire hero on a phone, and the LCP path. */
const MAX_POSTERS_BYTES = 260 * 1024;
/** The first clip. Arrives after LCP, but still the first video byte spent. */
const MAX_FIRST_SCENE_BYTES = 850 * 1024;
/** Every clip a desktop visitor would see sitting through the whole carousel. */
const MAX_CAROUSEL_BYTES = 3.5 * 1024 * 1024;

const run = (args) => execFileSync(FFMPEG, ["-y", "-hide_banner", "-loglevel", "error", ...args]);
const shortHash = (file) =>
  createHash("sha1").update(readFileSync(file)).digest("hex").slice(0, 8);
const kb = (n) => `${Math.round(n / 1024)}KB`;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Written by record.mjs: where the real choreography starts and ends inside
// each raw recording. Everything before it is context startup, page load and
// the poster screenshot — dead footage that must not reach the hero.
const takesPath = join(RAW, "takes.json");
const takes = existsSync(takesPath) ? JSON.parse(readFileSync(takesPath, "utf8")) : {};

const manifest = { scenes: [] };
let total = 0;
const oversized = [];

for (const scene of SCENES) {
  const source = join(RAW, `${scene.id}.webm`);
  const posterSource = join(RAW, `${scene.id}-poster.png`);
  if (!existsSync(source)) {
    console.error(`  skip ${scene.id}: no raw footage — run record.mjs first`);
    continue;
  }

  const entry = {
    id: scene.id,
    label: scene.label,
    caption: scene.caption,
    route: scene.route,
    serviceSlug: scene.serviceSlug,
    sources: {},
    poster: {},
  };

  const take = takes[scene.id];
  if (!take) console.error(`  ${scene.id}: no take window — encoding the whole recording`);
  // -ss before -i seeks quickly and is accurate enough for an 8s clip.
  const trim = take
    ? ["-ss", (take.startMs / 1000).toFixed(2), "-t", (take.durationMs / 1000).toFixed(2)]
    : [];

  for (const rung of LADDER) {
    const scale = `scale=${rung.width}:${rung.height}:flags=lanczos`;

    // -an on every output: no audio track at all. That is what makes autoplay
    // work without a user gesture in every browser, and it halves the size.
    const mp4Tmp = join(OUT, `${scene.id}-${rung.key}.tmp.mp4`);
    run([
      ...trim,
      "-i", source,
      "-vf", scale,
      "-an",
      "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-crf", String(rung.crfH264), "-preset", "slow",
      "-g", "48", "-movflags", "+faststart",
      mp4Tmp,
    ]);

    const webmTmp = join(OUT, `${scene.id}-${rung.key}.tmp.webm`);
    run([
      ...trim,
      "-i", source,
      "-vf", scale,
      "-an",
      "-c:v", "libvpx-vp9", "-crf", String(rung.crfVp9), "-b:v", "0",
      "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
      webmTmp,
    ]);

    for (const [fmt, tmp] of [["mp4", mp4Tmp], ["webm", webmTmp]]) {
      const name = `${scene.id}-${rung.key}.${shortHash(tmp)}.${fmt}`;
      const file = join(OUT, name);
      renameSync(tmp, file);
      const size = statSync(file).size;
      total += size;
      if (size > MAX_FILE_BYTES) oversized.push(`${name} ${kb(size)}`);
      entry.sources[rung.key] ??= {};
      entry.sources[rung.key][fmt] = { src: `/hero/${name}`, bytes: size };
    }
  }

  // Poster. This is the LCP element, so it is generated from a clean live
  // screenshot rather than a decoded video frame.
  for (const [fmt, args] of [
    ["webp", ["-c:v", "libwebp", "-quality", "78", "-compression_level", "6"]],
    ["jpg", ["-c:v", "mjpeg", "-q:v", "5"]],
  ]) {
    const tmp = join(OUT, `${scene.id}-poster.tmp.${fmt}`);
    run(["-i", posterSource, "-vf", "scale=1440:810:flags=lanczos", ...args, tmp]);
    const name = `${scene.id}-poster.${shortHash(tmp)}.${fmt}`;
    const file = join(OUT, name);
    renameSync(tmp, file);
    const size = statSync(file).size;
    total += size;
    entry.poster[fmt] = { src: `/hero/${name}`, bytes: size };
  }

  // Tiny blurred placeholder, inlined as a data URI so it costs no request.
  const blurFile = join(RAW, `${scene.id}-blur.jpg`);
  run(["-i", posterSource, "-vf", "scale=24:14:flags=lanczos", "-c:v", "mjpeg", "-q:v", "12", blurFile]);
  entry.blurDataURL = `data:image/jpeg;base64,${readFileSync(blurFile).toString("base64")}`;

  entry.width = 1440;
  entry.height = 810;
  manifest.scenes.push(entry);

  const sceneBytes = Object.values(entry.sources).flatMap((r) => Object.values(r)).reduce((a, s) => a + s.bytes, 0);
  console.log(`  ${scene.id.padEnd(10)} video ${kb(sceneBytes).padStart(7)}  poster ${kb(entry.poster.webp.bytes)}`);
}

// What a browser would really pick: the smaller of webm/mp4 at the hd rung.
const bestHd = (s) => Math.min(s.sources.hd.webm.bytes, s.sources.hd.mp4.bytes);
const postersBytes = manifest.scenes.reduce((a, s) => a + s.poster.webp.bytes, 0);
const firstSceneBytes = manifest.scenes.length ? bestHd(manifest.scenes[0]) : 0;
const carouselBytes = manifest.scenes.reduce((a, s) => a + bestHd(s), 0);

manifest.generatedAt = new Date().toISOString();
manifest.bytesOnDisk = total;
manifest.budget = { postersBytes, firstSceneBytes, carouselBytes };
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(`
  ${manifest.scenes.length} scenes, ${kb(total)} on disk (all renditions)

  What a visitor actually pays:
    mobile, whole hero (posters only)  ${kb(postersBytes).padStart(8)}  / ${kb(MAX_POSTERS_BYTES)}
    desktop, first clip                ${kb(firstSceneBytes).padStart(8)}  / ${kb(MAX_FIRST_SCENE_BYTES)}
    desktop, all ${manifest.scenes.length} clips               ${kb(carouselBytes).padStart(8)}  / ${kb(MAX_CAROUSEL_BYTES)}`);

const overBudget = [];
if (oversized.length) overBudget.push(`single files over ${kb(MAX_FILE_BYTES)}: ${oversized.join(", ")}`);
if (postersBytes > MAX_POSTERS_BYTES) overBudget.push(`posters ${kb(postersBytes)} > ${kb(MAX_POSTERS_BYTES)}`);
if (firstSceneBytes > MAX_FIRST_SCENE_BYTES) overBudget.push(`first scene ${kb(firstSceneBytes)} > ${kb(MAX_FIRST_SCENE_BYTES)}`);
if (carouselBytes > MAX_CAROUSEL_BYTES) overBudget.push(`carousel ${kb(carouselBytes)} > ${kb(MAX_CAROUSEL_BYTES)}`);

if (overBudget.length) {
  console.error(`\nOVER BUDGET:\n  ${overBudget.join("\n  ")}`);
  process.exit(1);
}
