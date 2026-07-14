import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean>;

// Fires a named event to Vercel Analytics and (if present) Google Analytics.
// Safe to call anywhere on the client — failures never throw.
export function trackEvent(name: string, props?: Props) {
  try {
    vercelTrack(name, props);
  } catch {}
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, props ?? {});
  } catch {}
}
