import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Read-only Supabase client for PUBLIC content — published posts, active
 * portfolio items, active testimonials. Anything a signed-out visitor sees.
 *
 * Why this exists, and why it matters more than it looks:
 *
 * `lib/supabase/server.ts` calls `cookies()` so it can read the auth session.
 * In the App Router, touching `cookies()` opts the whole route into dynamic
 * rendering — permanently, and regardless of any `revalidate` you set. The
 * homepage, /blog and /portfolio all read public data through it, so all three
 * were server-rendering on every single request just to fetch rows that change
 * a few times a month.
 *
 * Measured on this machine against the production build:
 *
 *     /about      0.67s     (static)
 *     /services   0.27s     (static)
 *     /           7.15s     (force-dynamic + Supabase)
 *     /blog       7.39s     (force-dynamic + Supabase)
 *     /portfolio  7.17s     (force-dynamic + Supabase)
 *
 * A seven-second penalty on the three most important pages, on every visit.
 * Deleting `force-dynamic` alone would not have fixed it — the `cookies()`
 * call underneath would have kept the routes dynamic anyway. Hence a separate
 * client with no cookie access at all, so those pages can be statically
 * generated and revalidated on a timer.
 *
 * Never use this for anything user-specific. It carries no session, so RLS
 * sees an anonymous request — which is exactly the guarantee we want for
 * cached, shared HTML.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
