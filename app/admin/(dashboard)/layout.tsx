import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import Logo from "@/components/Logo";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/quotations", label: "Quotations" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/followups", label: "Follow-ups" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-white p-5">
        <Logo />
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-accent-soft hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <p className="text-xs text-ink-soft">
            Signed in as <span className="font-semibold text-ink">{session.name}</span>
          </p>
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between border-b border-line bg-white px-4 py-3">
          <Logo />
          <nav className="flex gap-3 text-sm font-medium">
            {nav.map((i) => (
              <Link key={i.href} href={i.href} className="text-ink-soft hover:text-accent">
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
