import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/portal/SignOutButton";
import VerifyEmailBanner from "@/components/portal/VerifyEmailBanner";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  quote_prepared: "Quote prepared",
  converted: "Converted to project",
  closed: "Closed",
};

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/client/dashboard");

  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "there";
  const isVerified = Boolean(user.email_confirmed_at);

  // Attach any guest requests submitted with this (now verified) email.
  if (isVerified) {
    try {
      await supabase.rpc("claim_my_requests");
    } catch {}
  }

  // The user's own requests (RLS limits this to rows where client_id = them).
  const { data: requests } = await supabase
    .from("project_requests")
    .select("id, service_category, service_type, description, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-mark.png" alt="Skilloura" width={32} height={32} className="size-8 object-contain" />
            <span className="font-black tracking-tight text-ink">Skilloura</span>
            <span className="ml-2 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-bold text-accent">Client</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-ink">Welcome, {name} 👋</h1>
            <p className="mt-1 text-sm text-ink-soft">Signed in as {user.email}.</p>
          </div>
          <Link
            href="/get-started"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            + New request
          </Link>
        </div>

        {!isVerified && <VerifyEmailBanner email={user.email ?? ""} />}

        {/* Requests */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-ink">Your project requests</h2>
          {requests && requests.length > 0 ? (
            <div className="mt-4 space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5">
                  <div>
                    <p className="font-bold text-ink">{r.service_category || "Project request"}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-ink-soft">{r.service_type || r.description || "—"}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-center">
              <p className="text-sm text-ink-soft">No requests yet.</p>
              <Link href="/get-started" className="mt-3 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep">
                Start your first project
              </Link>
            </div>
          )}
        </section>

        {/* Coming soon */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">Coming next</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Quotes & invoices", "Review, approve and pay"],
              ["Files & delivery", "Download delivered work"],
              ["Messages", "Talk to the Skilloura team"],
            ].map(([title, desc]) => (
              <div key={title} className={`rounded-2xl border border-line bg-white p-6 ${!isVerified ? "opacity-60" : ""}`}>
                <h3 className="font-bold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{desc}</p>
                <p className="mt-3 text-xs font-semibold text-accent">
                  {isVerified ? "Coming in the next phase" : "Verify your email to unlock"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
