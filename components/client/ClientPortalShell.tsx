import { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "./LogoutButton";

export default function ClientPortalShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/client" aria-label="Client dashboard">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block max-w-[220px] truncate text-xs font-semibold text-ink-soft">
              {email}
            </span>
            <LogoutButton />
          </div>
        </div>
        <nav
          className="mx-auto flex max-w-5xl gap-1 px-4 pb-2 sm:px-6"
          aria-label="Portal navigation"
        >
          {[
            { href: "/client", label: "Dashboard" },
            { href: "/client/support", label: "Support" },
            { href: "/client/maintenance", label: "Maintenance" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-accent-soft hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-10">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
        <p className="border-t border-line pt-4 text-xs text-ink-soft">
          Questions about your project? Message on WhatsApp or email — replies within 24 hours.
        </p>
      </footer>
    </div>
  );
}
