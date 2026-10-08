import { site } from "./site";

/**
 * IndexNow — tells Bing, Yandex and other participating engines that a URL
 * changed, instead of waiting for the next crawl.
 *
 * public/988b6c02216d39d92b247c86239bf357.txt has been sitting in this repo
 * as a valid IndexNow key file with no code that ever submitted anything, so
 * it did precisely nothing. This is the missing half.
 *
 * Deliberately best-effort: it never throws and never blocks the caller. A
 * failed ping is not a reason for a publish to appear to fail — the URL is
 * still in the sitemap and will be found the ordinary way.
 *
 * Note this has no effect on Google, which does not participate in IndexNow.
 */
const INDEXNOW_KEY = "988b6c02216d39d92b247c86239bf357";

export async function pingIndexNow(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  const origin = site.url.replace(/\/$/, "");
  const host = new URL(origin).host;
  const urlList = paths.map((p) => `${origin}${p.startsWith("/") ? p : `/${p}`}`);

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${origin}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      // Never hold up a publish because a third party is slow.
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    /* best effort by design */
  }
}
