import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Neon's free-tier compute suspends when idle and takes longer than Prisma's
// default 5s connect timeout to wake up, causing intermittent P1001 errors.
// Ensure sane timeouts on the connection string regardless of env config.
function withTimeouts(url: string | undefined) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("connect_timeout")) u.searchParams.set("connect_timeout", "15");
    if (!u.searchParams.has("pool_timeout")) u.searchParams.set("pool_timeout", "15");
    return u.toString();
  } catch {
    return url;
  }
}

const dbUrl = withTimeouts(process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ??
  (dbUrl
    ? new PrismaClient({
        datasources: { db: { url: dbUrl } },
      })
    : new PrismaClient());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
