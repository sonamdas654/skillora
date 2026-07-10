// Monthly DB backup — exports every table to a timestamped JSON file
// OUTSIDE the repo (never committed). Run from the repo root:
//   node scripts/db-backup.mjs
// Reads DATABASE_URL from .env automatically (Prisma does that).
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();
const BACKUP_DIR = path.resolve(process.cwd(), "..", "skillora-backups");

const models = [
  "user",
  "service",
  "servicePackage",
  "lead",
  "formAnswer",
  "uploadedFile",
  "deliveryFile",
  "quotation",
  "invoice",
  "payment",
  "project",
  "note",
  "followup",
  "portfolio",
  "testimonial",
  "ticket",
  "ticketMessage",
  "blogPost",
  "contactMessage",
];

const dump = {};
let total = 0;
for (const m of models) {
  dump[m] = await prisma[m].findMany();
  total += dump[m].length;
  console.log(`${m}: ${dump[m].length} rows`);
}

mkdirSync(BACKUP_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const file = path.join(BACKUP_DIR, `skillora-db-${stamp}.json`);
writeFileSync(file, JSON.stringify(dump, null, 1));
console.log(`\nBackup written: ${file} (${total} rows total)`);
await prisma.$disconnect();
