import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, phone, status, created_at, client_profiles(business_name, city_country, whatsapp)")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Clients</h1>
      <p className="mt-1 text-sm text-ink-soft">Everyone with a Skilloura client account.</p>

      {clients && clients.length > 0 ? (
        <div className="mt-6 space-y-3">
          {clients.map((c: Record<string, any>) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
            const cp = Array.isArray(c.client_profiles) ? c.client_profiles[0] : c.client_profiles;
            return (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5">
                <div>
                  <p className="font-bold text-ink">{c.full_name || c.email}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">{c.email}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {cp?.business_name && `${cp.business_name} · `}
                    {cp?.whatsapp || c.phone || "No phone"}
                    {cp?.city_country && ` · ${cp.city_country}`}
                  </p>
                </div>
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">{c.status}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-ink-soft">
          No client accounts yet — they appear here once someone signs up.
        </div>
      )}
    </div>
  );
}
