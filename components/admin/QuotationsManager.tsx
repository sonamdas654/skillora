"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";
const QUOTE_STATUSES = ["Draft", "Sent", "Accepted", "Rejected", "Expired"];

interface QuoteView {
  id: string;
  quoteNumber: string;
  clientName: string;
  service: string;
  amount: number;
  scope: string;
  timeline: string | null;
  validUntil: string | null;
  status: string;
  createdAt: string;
}

export default function QuotationsManager({
  quotations,
  leads,
}: {
  quotations: QuoteView[];
  leads: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: fd.get("leadId"),
        quoteAmount: Number(fd.get("quoteAmount")),
        scope: fd.get("scope"),
        timeline: fd.get("timeline"),
        validDays: Number(fd.get("validDays") || 15),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to create quotation");
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/quotations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Quotations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm ? "Cancel" : "+ New quotation"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="mb-1.5 block text-sm font-semibold text-ink">Amount (₹) *</label>
              <input name="quoteAmount" type="number" min="1" step="0.01" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Timeline</label>
              <input name="timeline" placeholder="e.g. 10-14 days" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Valid for (days)</label>
              <input name="validDays" type="number" defaultValue={15} min="1" max="90" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Scope (what&apos;s included) *</label>
            <textarea
              name="scope"
              required
              rows={5}
              className={inputCls}
              placeholder={"- 5 page business website\n- Mobile responsive\n- Contact form + WhatsApp\n- 2 revisions\nNot included: content writing"}
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create quotation"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {quotations.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No quotations yet. Create one from a qualified lead.
          </p>
        )}
        {quotations.map((q) => (
          <div key={q.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {q.quoteNumber}{" "}
                  <span className="font-normal text-ink-soft">· {q.clientName} · {q.service}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  ₹{q.amount.toLocaleString("en-IN")}
                  {q.timeline && ` · ${q.timeline}`}
                  {q.validUntil &&
                    ` · valid till ${new Date(q.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={q.status}
                  onChange={(e) => setStatus(q.id, e.target.value)}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
                >
                  {QUOTE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  {expanded === q.id ? "Hide scope" : "View scope"}
                </button>
              </div>
            </div>
            {expanded === q.id && (
              <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-background p-4 text-sm text-ink-soft font-sans">
                {q.scope}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
