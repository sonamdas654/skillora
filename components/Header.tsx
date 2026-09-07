"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Icon from "./Icons";
import { whatsappLink, site } from "@/lib/site";
import AuthNavLink from "./portal/AuthNavLink";
import WhatsAppIcon from "./icons/WhatsAppIcon";

/**
 * Site header.
 *
 * Three things changed from the previous version, all of them problems rather
 * than preferences:
 *
 * 1. Eight links sat in a flat row with no hierarchy, so the navigation read
 *    as a list rather than as the structure of a business. They are now
 *    grouped — what we build, then proof, then contact — with a hairline
 *    between groups.
 * 2. The full nav only appeared at xl (1280px), which meant every laptop
 *    between 1024 and 1280 got a hamburger for a menu that fits. It now
 *    appears at lg.
 * 3. "Home" is gone from the row. The logo is the home link on every site on
 *    the web, and it already carries an accessible name — the duplicate was
 *    spending the width that forced the hamburger down to xl in the first
 *    place.
 *
 * The active state is the scope-line tick, not a filled pill, so the header
 * carries the same motif as the hero.
 */

const NAV_GROUPS: { label: string; items: { href: string; label: string }[] }[] = [
  {
    label: "What we build",
    items: [
      { href: "/services", label: "Services" },
      { href: "/ai-solutions", label: "AI Systems" },
      { href: "/solutions", label: "Solutions" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    label: "Proof",
    items: [
      { href: "/portfolio", label: "Portfolio" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    label: "Talk to us",
    items: [{ href: "/contact", label: "Contact" }],
  },
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

  // Lock body scroll while the full-height drawer is open, otherwise the page
  // behind it scrolls under the panel on touch.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape, and trap Tab focus inside the drawer while open
  // (WCAG 2.1.2 no keyboard trap out / 2.4.3 focus order). Focus moves into
  // the drawer on open and returns to the toggle on close.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const menuButton = menuButtonRef.current;
    const focusables = drawer
      ? Array.from(drawer.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-surface/85 shadow-e2 backdrop-blur-xl"
          : "border-transparent bg-canvas/70 backdrop-blur-sm"
      }`}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto flex h-20 max-w-page items-center justify-between gap-6 px-4 sm:h-22 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center lg:flex" aria-label="Main">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className="flex items-center">
              {gi > 0 && <span aria-hidden className="mx-2 h-4 w-px bg-line-strong" />}
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3.5 py-2.5 text-body-sm font-medium transition-colors ${
                      active ? "nav-tick text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <AuthNavLink variant="desktop" />
          <a
            href={whatsappLink("Hi! I want to discuss a project.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-pill border border-line bg-surface px-4 py-2 text-body-sm font-semibold text-ink shadow-e1 transition-colors hover:border-success hover:text-success"
          >
            <WhatsAppIcon className="size-4 text-success" />
            WhatsApp
          </a>
          <Link
            href="/start-project"
            className="rounded-pill bg-brand px-5 py-2.5 text-body-sm font-semibold text-on-brand shadow-brand transition-colors hover:bg-brand-deep"
          >
            Get a written scope
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          className="grid size-11 place-items-center rounded-field border border-line bg-surface text-ink shadow-e1 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer — a designed panel, not a stacked list. Groups carry
          the same mono labels as the desktop structure, the contact details
          are visible without another tap, and the primary action is pinned
          within thumb reach at the bottom. */}
      {open && (
        <div
          ref={drawerRef}
          className="fixed inset-x-0 bottom-0 top-20 flex flex-col overflow-y-auto border-t border-line bg-canvas sm:top-22 lg:hidden"
        >
          <nav className="flex-1 px-4 py-6" aria-label="Mobile">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-7 last:mb-0">
                <p className="mb-2 text-micro font-mono uppercase text-ink-muted">{group.label}</p>
                <div className="flex flex-col">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between border-b border-line py-3.5 font-display text-title-2 transition-colors ${
                          active ? "text-brand" : "text-ink"
                        }`}
                      >
                        {item.label}
                        {active ? (
                          <span aria-hidden className="size-1.5 rounded-pill bg-signal" />
                        ) : (
                          <Icon name="arrow" className="size-4 text-ink-muted" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="mt-8 rounded-card border border-line bg-surface p-4 shadow-e1">
              <p className="text-micro font-mono uppercase text-ink-muted">Direct line</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block text-body-base font-semibold text-ink"
              >
                {site.email}
              </a>
              <p className="mt-1 text-body-sm text-ink-soft">{site.businessHours}</p>
            </div>

            <div className="mt-4">
              <AuthNavLink variant="mobile" />
            </div>
          </nav>

          <div className="sticky bottom-0 grid grid-cols-[1fr_auto] gap-2.5 border-t border-line bg-surface/95 p-4 backdrop-blur-xl">
            <Link
              href="/start-project"
              className="rounded-pill bg-brand px-5 py-3.5 text-center text-body-base font-semibold text-on-brand shadow-brand"
            >
              Get a written scope
            </Link>
            <a
              href={whatsappLink("Hi! I want to discuss a project.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message us on WhatsApp"
              className="grid size-[52px] place-items-center rounded-pill border border-line bg-surface text-success"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
