"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

interface FollowupView {
  id: string;
  clientName: string;
  phone: string;
  service: string;
  date: string;
  type: string;
  message: string | null;
  status: string;
}

export default function FollowupsManager({
  followups,
  leads,
}: {
  followups: FollowupView[];
  leads: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: fd.get("leadId"),
        followupDate: fd.get("followupDate"),
        followupType: fd.get("followupType"),
        message: fd.get("message"),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to add follow-up");
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/followups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  const now = Date.now();
  const pending = followups.filter((f) => f.status === "Pending");
  const overdue = pending.filter((f) => new Date(f.date).getTime() < now);
  const done = followups.filter((f) => f.status !== "Pending");

  function Card({ f, isOverdue }: { f: FollowupView; isOverdue?: boolean }) {
    return (
      <div
        className={`rounded-2xl border bg-white p-5 ${isOverdue ? "border-red-300 bg-red-50/50" : "border-line"}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-ink">
              {f.clientName}{" "}
              <span className="font-normal text-ink-soft">· {f.service}</span>
              {isOverdue && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                  OVERDUE
                </span>
              )}
            </p>
            <p className="mt-0.5 text-sm text-ink-soft">
              {new Date(f.date).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · via {f.type}
              {f.message && ` · "${f.message}"`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {f.type === "whatsapp" && f.status === "Pending" && (
              <a
                href={`https://wa.me/${f.phone.replace(/\D/g, "")}?text=${encodeURIComponent(f.message ?? `Hi ${f.clientName}, following up on your ${f.service} project request from Skilloura.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90"
              >
                WhatsApp now
              </a>
            )}
            {f.status === "Pending" ? (
              <>
                <button
                  onClick={() => setStatus(f.id, "Done")}
                  className="rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90"
                >
                  Mark done
                </button>
                <button
                  onClick={() => setStatus(f.id, "Cancelled")}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink-soft hover:border-red-300 hover:text-red-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <span className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-semibold text-ink-soft">
                {f.status}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Follow-ups</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm ? "Cancel" : "+ Schedule follow-up"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Lead *</label>
              <select name="leadId" required className={inputCls}>
                <option value="">Select lead...</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Date & time *</label>
              <input name="followupDate" type="datetime-local" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Via</label>
              <select name="followupType" className={inputCls} defaultValue="whatsapp">
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="call">Call</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Message / reminder note</label>
            <input name="message" placeholder="e.g. Ask about quotation decision" className={inputCls} />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Schedule"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {followups.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No follow-ups scheduled. Leads that aren&apos;t followed up go cold — schedule one!
          </p>
        )}
        {overdue.map((f) => (
          <Card key={f.id} f={f} isOverdue />
        ))}
        {pending
          .filter((f) => new Date(f.date).getTime() >= now)
          .map((f) => (
            <Card key={f.id} f={f} />
          ))}
        {done.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-ink-soft">
              Completed / cancelled ({done.length})
            </summary>
            <div className="mt-3 space-y-3">
              {done.map((f) => (
                <Card key={f.id} f={f} />
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
