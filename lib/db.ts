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

/**
 * The client is constructed on FIRST USE, not on import.
 *
 * It used to be built at module evaluation. `new PrismaClient()` throws when
 * DATABASE_URL is absent — the previous code guarded the *value* but still
 * called the constructor — and on Vercel every environment variable in this
 * project is scoped to Production only. So every Preview deployment failed at
 * build with:
 *
 *     at module evaluation (lib/db.ts:22:3)
 *     > 22 |   new PrismaClient({
 *
 * Sixteen seconds in, before Next had compiled anything. That is why every
 * Dependabot pull request showed a red cross, and — more expensively — why no
 * branch of this repo could ever produce a working preview URL to look at
 * before merging.
 *
 * Only app/api/contact/route.ts imports this, and that is a request handler,
 * so nothing needs a client during a build. Deferring construction lets the
 * build succeed without a database while behaving identically at runtime: the
 * first property access creates the client, and a missing DATABASE_URL then
 * fails at the request that needed it rather than taking the whole build down.
 *
 * The export stays a `prisma` object with the same shape, so no caller changes.
 */
function createPrismaClient(): PrismaClient {
  const dbUrl = withTimeouts(process.env.DATABASE_URL);
  return dbUrl
    ? new PrismaClient({ datasources: { db: { url: dbUrl } } })
    : new PrismaClient();
}

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = createPrismaClient();
    // Reused across hot reloads in development; in production each serverless
    // instance builds its own once.
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
    else return client;
  }
  return globalForPrisma.prisma;
}

let productionClient: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client =
      process.env.NODE_ENV === "production"
        ? (productionClient ??= createPrismaClient())
        : getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
