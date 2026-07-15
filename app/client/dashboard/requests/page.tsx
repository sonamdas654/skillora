import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { REQUEST_STATUS_LABEL, statusPillClass } from "@/lib/portalLabels";

export const dynamic = "force-dynamic";

export default async function ClientRequestsPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("project_requests")
    .select("id, service_category, service_type, description, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">My requests</h1>
        <Link href="/get-started" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep">
          + New request
        </Link>
      </div>

      {requests && requests.length > 0 ? (
        <div className="mt-6 space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5">
              <div>
                <p className="font-bold text-ink">{r.service_category || "Project request"}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink-soft">{r.service_type || r.description || "—"}</p>
                <p className="mt-1 text-xs text-ink-soft">
                  {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPillClass(r.status)}`}>
                {REQUEST_STATUS_LABEL[r.status] ?? r.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="text-sm text-ink-soft">You haven&apos;t submitted a project request yet.</p>
          <Link href="/get-started" className="mt-3 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep">
            Start your first project
          </Link>
        </div>
      )}
    </div>
  );
}
