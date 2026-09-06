"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { whatsappLink } from "@/lib/site";
import AuthNavLink from "./portal/AuthNavLink";
import WhatsAppIcon from "./icons/WhatsAppIcon";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/ai-solutions", label: "AI Systems" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile drawer on navigation — React's sanctioned
  // "reset state during render when a prop changes" pattern.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Close the mobile drawer on Escape, and trap Tab focus inside it while
  // open (WCAG 2.1.2 no keyboard trap out / 2.4.3 focus order) — Tab/
  // Shift+Tab cycle within the drawer's links instead of escaping into the
  // page content stacked underneath. Focus moves into the drawer on open
  // and returns to the toggle button on close.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const menuButton = menuButtonRef.current;
    const focusables = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];
    focusables[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-wash-mint transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(11,19,48,0.12)]" : ""
      }`}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex h-20 sm:h-[88px] max-w-[1520px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden xl:flex items-center gap-1" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-accent bg-accent-soft"
                  : "text-ink-soft hover:text-ink hover:bg-black/[0.04]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2.5">
          <AuthNavLink variant="desktop" />
          <a
            href={whatsappLink("Hi! I want to discuss a project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-mint hover:text-mint transition-colors"
          >
            <WhatsAppIcon className="size-4 text-mint" />
            WhatsApp
          </a>
          <Link
            href="/start-project"
            className="rounded-full bg-accent px-4.5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(40,87,255,0.7)] hover:bg-accent-deep transition-colors"
          >
            Get Free Quote
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          className="xl:hidden grid size-10 place-items-center rounded-lg border border-line bg-white"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div ref={drawerRef} className="xl:hidden border-t border-line bg-white/95 backdrop-blur-md">
          <nav className="mx-auto max-w-[1520px] px-4 py-4 flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  pathname === item.href ? "text-accent bg-accent-soft" : "text-ink hover:bg-black/[0.04]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <AuthNavLink variant="mobile" />
            <Link
              href="/start-project"
              className="mt-1 rounded-xl bg-accent px-4 py-3.5 text-center text-base font-semibold text-white"
            >
              Submit Project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
