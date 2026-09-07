// Validate the cross-references that live in content rather than in code.
//
// app/blog/[slug]/page.tsx builds its service CTA as `/services/${slug}` from
// a value stored in the database, with no validation. A typo there does not
// throw, does not warn, and does not show up in a build — it just renders a
// button on a published article that leads to a 404. The same is true of
// demo_slug, related_slugs, and the slugs the case studies reference.
//
// This checks all of them against what actually exists.
//
// Usage: node tools/qa/content-links.mjs        (needs the .env Supabase vars)
import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^\w+=/.test(l))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, "")];
    })
);

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

// Read the slug lists straight out of the source, so this cannot drift from
// what the app actually serves.
const slugsIn = (file, listName) => {
  const src = fs.readFileSync(file, "utf8");
  const start = src.indexOf(listName);
  if (start === -1) return [];
  return [...src.slice(start).matchAll(/^\s{2,4}slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
};

const serviceSlugs = new Set([
  ...slugsIn("lib/services.ts", "serviceCategories"),
  ...slugsIn("lib/focusServices.ts", "focusServices"),
]);
const conceptSlugs = new Set(slugsIn("lib/portfolio.ts", "portfolioItems"));
const caseStudySlugs = new Set(slugsIn("lib/caseStudies.ts", "caseStudies"));

// Demo ids live in demoConcepts; /demo/<id> renders each one.
const demoIds = new Set(
  [...fs.readFileSync("lib/demoConcepts.ts", "utf8").matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1])
);

const res = await fetch(
  `${URL_}/rest/v1/blog_posts?select=slug,status,service_cta_slug,demo_slug,related_slugs&limit=500`,
  { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
);
const posts = await res.json();
if (!Array.isArray(posts)) {
  console.error("Could not read blog_posts:", JSON.stringify(posts));
  process.exit(1);
}
const postSlugs = new Set(posts.map((p) => p.slug));

const problems = [];
const note = (where, what) => problems.push(`${where}\n      ${what}`);

for (const p of posts) {
  if (p.status !== "published") continue;
  if (p.service_cta_slug && !serviceSlugs.has(p.service_cta_slug)) {
    note(`blog/${p.slug}`, `service_cta_slug "${p.service_cta_slug}" -> /services/${p.service_cta_slug} does not exist`);
  }
  // demo_slug holds a full path — app/blog/[slug] renders it straight into
  // href, so it has to resolve as a path, not as a bare slug.
  if (p.demo_slug) {
    const concept = /^\/portfolio\/(.+)$/.exec(p.demo_slug);
    const demo = /^\/demo\/(.+)$/.exec(p.demo_slug);
    const ok = concept ? conceptSlugs.has(concept[1]) : demo ? demoIds.has(demo[1]) : false;
    if (!ok) note(`blog/${p.slug}`, `demo_slug "${p.demo_slug}" does not resolve to a real page`);
  }
  for (const r of p.related_slugs ?? []) {
    if (!postSlugs.has(r)) note(`blog/${p.slug}`, `related_slugs -> "${r}" is not a post`);
  }
}

// Case studies reference services, concepts and posts from code.
const cs = fs.readFileSync("lib/caseStudies.ts", "utf8");
for (const m of cs.matchAll(/slug:\s*"([^"]+)"[\s\S]*?conceptSlug:\s*"([^"]+)"/g)) {
  if (!conceptSlugs.has(m[2])) note(`case-studies/${m[1]}`, `conceptSlug "${m[2]}" is not a portfolio concept`);
}
for (const m of cs.matchAll(/slug:\s*"([^"]+)"[\s\S]*?serviceSlug:\s*"([^"]+)"/g)) {
  if (!serviceSlugs.has(m[2])) note(`case-studies/${m[1]}`, `serviceSlug "${m[2]}" -> /services/${m[2]} does not exist`);
}
for (const m of cs.matchAll(/relatedPosts:\s*\[([^\]]*)\]/g)) {
  for (const s of [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])) {
    if (!postSlugs.has(s)) note("case-studies", `relatedPosts -> "${s}" is not a post`);
  }
}
for (const m of cs.matchAll(/relatedStudies:\s*\[([^\]]*)\]/g)) {
  for (const s of [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])) {
    if (!caseStudySlugs.has(s)) note("case-studies", `relatedStudies -> "${s}" is not a case study`);
  }
}

console.log(
  `checked ${posts.length} posts, ${caseStudySlugs.size} case studies against ` +
    `${serviceSlugs.size} services, ${conceptSlugs.size} concepts, ${demoIds.size} demos\n`
);
if (problems.length === 0) {
  console.log("All content cross-references resolve.");
} else {
  console.log(`${problems.length} broken reference(s):\n`);
  for (const p of problems) console.log("  " + p + "\n");
  process.exitCode = 1;
}
