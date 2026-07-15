"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/client/dashboard", label: "Overview" },
  { href: "/client/dashboard/requests", label: "My Requests" },
  { href: "/client/dashboard/projects", label: "My Projects" },
  { href: "/client/dashboard/profile", label: "Profile" },
];

export default function ClientNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 pt-1">
      {TABS.map((t) => {
        const active = t.href === "/client/dashboard" ? pathname === t.href : pathname?.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active ? "bg-accent text-white" : "text-ink-soft hover:bg-background"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
