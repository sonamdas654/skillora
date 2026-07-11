// Semi-automatic PROJECT_BRAIN.md updater.
// Appends a new SESSION LOG entry (git commits + your note), refreshes the
// "Current State" date, and copies the brain to Downloads — one command.
//
// Usage (from the skillora project root):
//   node scripts/save-brain.mjs "Cursor" "Fixed navbar, stopped at payment test"
//   node scripts/save-brain.mjs "ChatGPT"        (note optional)
//   node scripts/save-brain.mjs                  (defaults: tool=AI, note=auto)
//
// The brain is gitignored on purpose (has an access map), so this file is
// never committed — it's the portable doc you hand to the next AI.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const BRAIN = path.resolve(process.cwd(), "PROJECT_BRAIN.md");
if (!existsSync(BRAIN)) {
  console.error("❌ PROJECT_BRAIN.md not found. Run this from the skillora project root.");
  process.exit(1);
}

const tool = process.argv[2] || "AI";
const note = process.argv[3] || "Session work — see commits below.";

function git(cmd, fallback = "") {
  try {
    return execSync(`git ${cmd}`, { encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
}

const today = new Date().toISOString().slice(0, 10);
const branch = git("rev-parse --abbrev-ref HEAD", "main");
const lastHash = git("log -1 --format=%h", "?");
// Commits from the last 3 days (file-level truth of what changed)
const commits =
  git('log --since="3 days ago" --pretty=format:"- %h %s"', "").trim() ||
  git('log -8 --pretty=format:"- %h %s"', "- (no git history found)");
const dirty = git("status --short", "");
const dirtyLine = dirty ? `⚠️ Uncommitted changes present (\`git status\`).` : "Working tree clean.";

const entry = `### ${today} · ${tool} · branch ${branch} (last commit ${lastHash})
- **Kya kiya (note)**: ${note}
- **Recent commits (git, file-level truth)**:
${commits}
- **State**: ${dirtyLine}
- **Kahan ruke / next**: <!-- agla AI: user se pucho ya yahan bharo -->

`;

let text = readFileSync(BRAIN, "utf8");

// Insert the new entry just above the "Agla AI" marker so it stays at the bottom.
const marker = "<!-- Agla AI:";
if (text.includes(marker)) {
  text = text.replace(marker, `${entry}${marker}`);
} else {
  text += `\n${entry}`;
}

// Refresh the "Current State" last-updated date.
text = text.replace(/last updated: \d{4}-\d{2}-\d{2}/g, `last updated: ${today}`);

writeFileSync(BRAIN, text, "utf8");

// Copy to Downloads for easy hand-off.
const downloads = path.join(os.homedir(), "Downloads", "SKILLOURA-PROJECT-BRAIN.md");
try {
  copyFileSync(BRAIN, downloads);
} catch (e) {
  console.warn("⚠️ Could not copy to Downloads:", e.message);
}

console.log(`✅ Brain updated with a new SESSION LOG entry (${today}, ${tool}).`);
console.log(`   • ${BRAIN}`);
console.log(`   • ${downloads}`);
console.log(`\nAgli baar kisi bhi AI ko Downloads wali file do aur bolo:`);
console.log(`   "Ye mera project brain hai. Padho aur wahin se kaam continue karo."`);
