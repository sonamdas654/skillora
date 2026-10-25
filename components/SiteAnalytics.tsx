"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/track";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

// Loads Google Analytics + Microsoft Clarity only when their IDs are set,
// and delegates click tracking for WhatsApp links and any element carrying a
// `data-track="event_name"` attribute.
export default function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a,button");
      if (!el) return;

      // Explicit data-track events (e.g. pricing_package_click)
      const named = el.getAttribute("data-track");
      if (named) {
        trackEvent(named, { path: pathname });
        return;
      }

      // WhatsApp links anywhere on the site
      const href = (el.getAttribute("href") || "").toLowerCase();
      if (href.includes("wa.me") || href.includes("api.whatsapp") || href.includes("whatsapp.com")) {
        trackEvent("whatsapp_click", { path: pathname });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  /**
   * Load the third-party tags off the critical path, but guarantee they load.
   *
   * They were afterInteractive, which ran them the moment hydration finished.
   * Measured on the homepage that was the page's worst main-thread block: a
   * 2,741ms task starting at 876ms, with the load event at 310ms. gtag.js
   * alone is 175 kB and took 1,115ms. Moving them to next/script's
   * lazyOnload fixed that — and silently broke analytics on the one page
   * that matters most.
   *
   * lazyOnload waits for requestIdleCallback with no timeout. The homepage
   * never reaches a genuine idle: measured in a real browser, idle only ever
   * arrived via an 8s forced timeout, with reduced motion as well, so
   * gtag.js was never injected there at all. /services and /contact are
   * quieter, reach idle, and loaded it normally — which is why this looked
   * fine from anywhere except the homepage. gtag() still existed and
   * dataLayer still filled up, so nothing errored and nothing was logged;
   * the events simply queued forever. Ten days of homepage data were lost
   * before anyone could have noticed.
   *
   * So the idle wait is kept, with two guarantees next/script does not give:
   * a real timeout on the idle callback, and the first genuine interaction
   * as a second trigger. Same data, still out of the critical path, and it
   * can no longer depend on an idle period that may never come.
   */
  useEffect(() => {
    if (!GA_ID && !CLARITY_ID) return;

    let loaded = false;
    const inject = () => {
      if (loaded) return;
      loaded = true;

      if (GA_ID) {
        const tag = document.createElement("script");
        tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        tag.async = true;
        document.head.appendChild(tag);
      }
      if (CLARITY_ID) {
        const tag = document.createElement("script");
        tag.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
        tag.async = true;
        document.head.appendChild(tag);
      }
    };

    // Idle WITH a timeout. The timeout is the whole fix: it is the thing
    // next/script's lazyOnload does not pass.
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(inject, { timeout: 3500 })
        : window.setTimeout(inject, 3500);

    // A visitor who has already started using the page is a visitor worth
    // measuring, idle or not.
    const opts: AddEventListenerOptions = { once: true, passive: true };
    const triggers = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    for (const t of triggers) window.addEventListener(t, inject, opts);

    return () => {
      if (typeof window.cancelIdleCallback === "function" && typeof idle === "number") {
        window.cancelIdleCallback(idle);
      }
      clearTimeout(idle as number);
      for (const t of triggers) window.removeEventListener(t, inject);
    };
  }, []);

  return (
    <>
      {/* The dataLayer shim stays afterInteractive and stays inline: every
          gtag() call made before the tag arrives is queued here and replayed
          when it does. Clarity's own snippet queues the same way through
          c[a].q, so the queue survives the delay above. */}
      {GA_ID && (
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      )}
      {CLARITY_ID && (
        <Script id="ms-clarity-init" strategy="afterInteractive">
          {`(function(c,a){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}})(window,"clarity");`}
        </Script>
      )}
    </>
  );
}
