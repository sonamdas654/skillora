"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";
const INVOICE_STATUSES = ["Draft", "Sent", "Partially Paid", "Paid", "Overdue", "Cancelled"];

interface PaymentView {
  id: string;
  amount: number;
  type: string;
  date: string;
}

interface InvoiceView {
  id: string;
  invoiceNumber: string;
  clientName: string;
  service: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  dueDate: string | null;
  payments: PaymentView[];
}

export default function InvoicesManager({
  invoices,
  leads,
}: {
  invoices: InvoiceView[];
  leads: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [payFor, setPayFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: fd.get("leadId"),
        totalAmount: Number(fd.get("totalAmount")),
        dueDays: Number(fd.get("dueDays") || 7),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to create invoice");
    }
  }

  async function recordPayment(e: React.FormEvent<HTMLFormElement>, invoiceId: string) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: {
          amount: Number(fd.get("amount")),
          paymentType: fd.get("paymentType"),
          transactionId: fd.get("transactionId"),
        },
      }),
    });
    setSaving(false);
    if (res.ok) {
      setPayFor(null);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to record payment");
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Invoices</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm ? "Cancel" : "+ New invoice"}
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
              <label className="mb-1.5 block text-sm font-semibold text-ink">Total amount (₹) *</label>
              <input name="totalAmount" type="number" min="1" step="0.01" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Due in (days)</label>
              <input name="dueDays" type="number" defaultValue={7} min="1" max="90" className={inputCls} />
            </div>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create invoice"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {invoices.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No invoices yet.
          </p>
        )}
        {invoices.map((inv) => (
          <div key={inv.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {inv.invoiceNumber}{" "}
                  <span className="font-normal text-ink-soft">· {inv.clientName} · {inv.service}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  Total ₹{inv.totalAmount.toLocaleString("en-IN")} · Paid{" "}
                  <span className="font-semibold text-mint">₹{inv.paidAmount.toLocaleString("en-IN")}</span>{" "}
                  · Balance{" "}
                  <span className={`font-semibold ${inv.balanceAmount > 0 ? "text-amber-600" : "text-mint"}`}>
                    ₹{inv.balanceAmount.toLocaleString("en-IN")}
                  </span>
                  {inv.dueDate &&
                    ` · due ${new Date(inv.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={inv.status}
                  onChange={(e) => setStatus(inv.id, e.target.value)}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
                >
                  {INVOICE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <a
                  href={`/admin/invoices/${inv.id}/print`}
                  target="_blank"
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  Print / PDF
                </a>
                {inv.balanceAmount > 0 && (
                  <button
                    onClick={() => setPayFor(payFor === inv.id ? null : inv.id)}
                    className="rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-white hover:opacity-90"
                  >
                    + Payment
                  </button>
                )}
              </div>
            </div>

            {payFor === inv.id && (
              <form
                onSubmit={(e) => recordPayment(e, inv.id)}
                className="mt-4 grid gap-3 sm:grid-cols-4 rounded-xl bg-background p-4"
              >
                <input
                  name="amount"
                  type="number"
                  min="1"
                  max={inv.balanceAmount}
                  step="0.01"
                  required
                  placeholder={`Amount (max ₹${inv.balanceAmount})`}
                  className={inputCls}
                />
                <select name="paymentType" className={inputCls} defaultValue="advance">
                  <option value="advance">Advance</option>
                  <option value="milestone">Milestone</option>
                  <option value="final">Final</option>
                </select>
                <input name="transactionId" placeholder="Txn ID / UPI ref (optional)" className={inputCls} />
                <button
                  disabled={saving}
                  className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Record payment
                </button>
              </form>
            )}

            {inv.payments.length > 0 && (
              <ul className="mt-3 space-y-1">
                {inv.payments.map((p) => (
                  <li key={p.id} className="text-xs text-ink-soft">
                    ✓ ₹{p.amount.toLocaleString("en-IN")} ({p.type}) —{" "}
                    {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {error && !showForm && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    </div>
  );
}
