import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/portal/SignOutButton";
import NotificationBell from "@/components/portal/NotificationBell";
import ClientNav from "./ClientNav";

export const dynamic = "force-dynamic";

export default async function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/client/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/client/dashboard" className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Skilloura" width={32} height={32} className="size-8 object-contain" />
            <span className="font-black tracking-tight text-ink">Skilloura</span>
            <span className="ml-2 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold text-accent">Client</span>
          </Link>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <SignOutButton />
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4">
          <ClientNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
    </div>
  );
}
