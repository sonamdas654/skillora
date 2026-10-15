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

  return (
    <>
      {/* Both tags were afterInteractive, which runs them the moment hydration
          finishes. Measured on the homepage, that is exactly where the page's
          worst main-thread block sat: a 2,741ms task starting at 876ms, with
          the load event at 310ms. gtag.js alone is 175 kB and took 1,115ms.
          None of that is this site's own code — it is two third-party tags
          competing with the page for the first seconds.

          lazyOnload runs them in idle time instead. Nothing is removed and
          nothing stops being measured: the dataLayer shim below is still
          afterInteractive, so every gtag() call made before the tag arrives is
          queued and replayed when it does, and Clarity's own snippet queues the
          same way through c[a].q. Same data, out of the critical path. */}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      )}
    </>
  );
}
