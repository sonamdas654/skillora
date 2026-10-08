"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";
import { getService } from "@/lib/services";
import WhatsAppIcon from "./icons/WhatsAppIcon";

/**
 * Floating conversion CTA for phones and tablets.
 *
 * This used to be two stacked floating buttons — a filled quote button and a
 * filled WhatsApp button — competing with each other on every page, which is
 * the button spam the brief rules out. It is now one object: a primary action
 * with the WhatsApp channel attached to it, so there is a single obvious next
 * step and a second way to reach a person, not two rival CTAs.
 *
 * Both remain real anchors/links. Site-wide click tracking finds WhatsApp by
 * its wa.me href, so this must never become a button with an onClick.
 *
 * Slides in after the hero. Never shown on the requirement form (it would sit
 * over the submit button) or on the private portal.
 */
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

  // On a service page, carry that service into both actions.
  const serviceSlug = pathname.startsWith("/services/") ? pathname.split("/")[2] : undefined;
  const service = serviceSlug ? getService(serviceSlug) : undefined;
  const waMessage = service
    ? `Hi! I'm interested in ${service.name}. Can we discuss?`
    : "Hi! I want to discuss a project with Skilloura.";
  const quoteHref = service ? `/start-project?service=${service.slug}` : "/start-project";

  return (
    <div
      className={`fixed bottom-5 right-4 z-40 transition-all duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch overflow-hidden rounded-pill bg-brand shadow-e3">
        <Link
          href={quoteHref}
          className="px-5 py-3.5 text-body-sm font-semibold text-on-brand"
        >
          Get a written scope
        </Link>
        <span aria-hidden className="my-2 w-px bg-on-brand/25" />
        <a
          href={whatsappLink(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
          className="grid w-12 place-items-center text-on-brand"
        >
          <WhatsAppIcon className="size-5" />
        </a>
      </div>
    </div>
  );
}
