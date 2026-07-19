"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";
import { getService } from "@/lib/services";
import { WhatsAppIcon } from "./Header";

// Slim conversion bar pinned to the bottom on phones/tablets. Slides in
// after the visitor scrolls past the hero; never shown on the form itself
// (it would cover the submit button) or on admin/review pages.
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
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-line bg-white/95 px-3 pt-2.5 backdrop-blur-md pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgba(11,19,48,0.18)]">
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-4 py-3 text-sm font-bold text-mint"
          >
            <WhatsAppIcon className="size-4" />
            WhatsApp
          </a>
          <Link
            href={quoteHref}
            className="inline-flex flex-[1.4] items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(40,87,255,0.8)]"
          >
            Get Free Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
