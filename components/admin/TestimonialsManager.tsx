"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

interface TestimonialView {
  id: string;
  clientName: string;
  clientBusiness: string | null;
  rating: number;
  review: string;
  status: string;
}

export default function TestimonialsManager({
  testimonials,
}: {
  testimonials: TestimonialView[];
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
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: fd.get("clientName"),
        clientBusiness: fd.get("clientBusiness"),
        rating: Number(fd.get("rating")),
        review: fd.get("review"),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to add testimonial");
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial permanently?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Testimonials</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm ? "Cancel" : "+ Add review"}
        </button>
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        Only add <strong>real reviews from real clients</strong> — fake reviews destroy trust
        and can get you flagged. Reviews marked &quot;active&quot; appear on the homepage.
      </p>

      {showForm && (
        <form onSubmit={create} className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Client name *</label>
              <input name="clientName" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Business</label>
              <input name="clientBusiness" placeholder="e.g. Spice Route, Pune" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Rating *</label>
              <select name="rating" required className={inputCls} defaultValue="5">
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {"★".repeat(r)} ({r})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Review *</label>
            <textarea name="review" required rows={3} className={inputCls} />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add review"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {testimonials.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No reviews yet. After delivering projects, ask happy clients for a short review and
            add it here.
          </p>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {t.clientName}
                  {t.clientBusiness && (
                    <span className="font-normal text-ink-soft"> · {t.clientBusiness}</span>
                  )}{" "}
                  <span className="text-amber-500">{"★".repeat(t.rating)}</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">&quot;{t.review}&quot;</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={t.status}
                  onChange={(e) => setStatus(t.id, e.target.value)}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active (public)</option>
                  <option value="hidden">Hidden</option>
                </select>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-red-500 hover:border-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
