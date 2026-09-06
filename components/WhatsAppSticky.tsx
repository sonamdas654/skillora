"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";
import WhatsAppIcon from "./icons/WhatsAppIcon";

/**
 * Desktop floating actions.
 *
 * The WhatsApp entry point used to be a saturated #25D366 circle — a colour
 * from outside the palette, sitting on every page, shouting louder than the
 * primary CTA in the header. It is now a surface pill that belongs to the
 * system, keeping the recognisable green on the glyph only. Same link, same
 * prominence in the flow, far less noise.
 *
 * It must stay an anchor with a wa.me href: site-wide click tracking
 * identifies WhatsApp clicks by the href, not by any attribute.
 */
export default function WhatsAppSticky() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-2.5 lg:flex">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`grid size-10 place-items-center rounded-pill border border-line bg-surface text-ink-muted shadow-e2 transition-all duration-300 hover:border-brand hover:text-brand ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>

      <a
        href={whatsappLink("Hi! I want to discuss a project with Skilloura.")}
        target="_blank"
        rel="noopener noreferrer"
        className="card-lift inline-flex items-center gap-2.5 rounded-pill border border-line bg-surface py-3 pl-4 pr-5 text-body-sm font-semibold text-ink shadow-e3"
      >
        <WhatsAppIcon className="size-5 text-success" />
        Chat on WhatsApp
      </a>
    </div>
  );
}
