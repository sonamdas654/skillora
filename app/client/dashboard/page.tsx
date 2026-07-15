import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VerifyEmailBanner from "@/components/portal/VerifyEmailBanner";
import { PROJECT_STATUS_LABEL, statusPillClass } from "@/lib/portalLabels";

export const dynamic = "force-dynamic";

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "there";
  const isVerified = Boolean(user.email_confirmed_at);

  if (isVerified) {
    try {
      await supabase.rpc("claim_my_requests");
    } catch {}
  }

  const [{ data: requests }, { data: projects }, { data: quotes }, { data: payments }] = await Promise.all([
    supabase.from("project_requests").select("id, status").order("created_at", { ascending: false }),
    supabase.from("projects").select("id, title, status, progress, updated_at").order("updated_at", { ascending: false }),
    supabase.from("quotes").select("id, status").eq("status", "sent"),
    supabase.from("payments").select("id, status").eq("status", "pending"),
  ]);

  const openRequests = (requests ?? []).filter((r) => !["converted", "closed"].includes(r.status)).length;
  const activeProjects = (projects ?? []).filter((p) => p.status !== "closed").length;

  return (
    <div>
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

      {/* Metric tiles */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Open requests</p>
          <p className="mt-2 text-3xl font-black text-ink">{openRequests}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Active projects</p>
          <p className="mt-2 text-3xl font-black text-ink">{activeProjects}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Needs your attention</p>
          <p className="mt-2 text-3xl font-black text-ink">{(quotes?.length ?? 0) + (payments?.length ?? 0)}</p>
          <p className="mt-0.5 text-xs text-ink-soft">Quotes to review + payments due</p>
        </div>
      </div>

      {/* Recent projects */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Your projects</h2>
          <Link href="/client/dashboard/projects" className="text-sm font-semibold text-accent hover:underline">
            View all
          </Link>
        </div>
        {projects && projects.length > 0 ? (
          <div className="mt-4 space-y-3">
            {projects.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/client/dashboard/projects/${p.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 hover:border-accent"
              >
                <div>
                  <p className="font-bold text-ink">{p.title}</p>
                  <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPillClass(p.status)}`}>
                  {PROJECT_STATUS_LABEL[p.status] ?? p.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <p className="text-sm text-ink-soft">No projects yet — once we start work on your request, it will show up here.</p>
            <Link href="/get-started" className="mt-3 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep">
              Start your first project
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
