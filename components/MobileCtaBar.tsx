"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";
import { getService } from "@/lib/services";
import WhatsAppIcon from "./icons/WhatsAppIcon";

// Floating conversion CTAs pinned to the right edge on phones/tablets
// (mirrors the desktop WhatsApp float). Slides in after the visitor scrolls
// past the hero; never shown on the form itself (it would cover the submit
// button) or on admin/review pages.
export default function MobileCtaBar() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (
    pathname.startsWith("/start-project") ||
    pathname.startsWith("/get-started") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/client") ||
    pathname.startsWith("/review")
  ) {
    return null;
  }

  // On a service page, carry that service into both CTAs.
  const serviceSlug = pathname.startsWith("/services/") ? pathname.split("/")[2] : undefined;
  const service = serviceSlug ? getService(serviceSlug) : undefined;
  const waMessage = service
    ? `Hi! I'm interested in ${service.name}. Can we discuss?`
    : "Hi! I want to discuss a project with Skilloura.";
  const quoteHref = service ? `/start-project?service=${service.slug}` : "/start-project";

  return (
    <div
      className={`fixed right-3 bottom-6 z-40 flex flex-col items-end gap-2.5 lg:hidden transition-all duration-300 ${
        show ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        href={quoteHref}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(40,87,255,0.8)]"
      >
        Get Free Quote
      </Link>
      <a
        href={whatsappLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-mint/40 bg-white px-4 py-3 text-sm font-bold text-mint shadow-[0_10px_24px_-10px_rgba(16,185,129,0.8)]"
      >
        <WhatsAppIcon className="size-4" />
        WhatsApp
      </a>
    </div>
  );
}
