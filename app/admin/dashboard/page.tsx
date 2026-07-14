import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/portal/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/dashboard");

  const role = (user.user_metadata?.role as string) || "client";
  // Only admins may view the admin area — clients are sent to their dashboard.
  if (role !== "admin") redirect("/client/dashboard");

  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "admin";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Skilloura" width={32} height={32} className="size-8 object-contain" />
            <span className="font-black tracking-tight text-ink">Skilloura</span>
            <span className="ml-2 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-white">
              Admin
            </span>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-ink">Business OS — Admin</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Signed in as {name} ({user.email}).
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Leads & requests", "New project requests"],
            ["Projects", "Live delivery pipeline"],
            ["Quotes & payments", "Send quotes, track payments"],
            ["Clients", "Manage client accounts"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{desc}</p>
              <p className="mt-3 text-xs font-semibold text-accent">Coming in the next phase</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
