"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { serviceCategories } from "@/lib/services";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

interface ItemView {
  id: string;
  projectTitle: string;
  industry: string;
  category: string;
  problem: string;
  solution: string;
  demoLink: string | null;
  technologyUsed: string | null;
  isDemo: boolean;
  status: string;
}

export default function PortfolioManager({ items }: { items: ItemView[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectTitle: fd.get("projectTitle"),
        industry: fd.get("industry"),
        category: fd.get("category"),
        problem: fd.get("problem"),
        solution: fd.get("solution"),
        features: fd.get("features"),
        demoLink: fd.get("demoLink"),
        technologyUsed: fd.get("technologyUsed"),
        isDemo: fd.get("isDemo") === "on",
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to add project");
    }
  }

  async function toggle(id: string, status: string) {
    await fetch(`/api/admin/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status === "active" ? "hidden" : "active" }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this portfolio item permanently?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Portfolio</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm ? "Cancel" : "+ Add project"}
        </button>
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        Items added here appear on the public portfolio page alongside the built-in demo
        concepts. Add real client projects (with permission) and untick &quot;demo&quot; — they&apos;ll show
        without the Concept badge.
      </p>

      {showForm && (
        <form onSubmit={create} className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Project title *</label>
              <input name="projectTitle" required className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Industry *</label>
              <input name="industry" required placeholder="e.g. Restaurant / Food" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Category *</label>
              <select name="category" required className={inputCls}>
                {serviceCategories.map((s) => (
                  <option key={s.slug} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Demo link</label>
              <input name="demoLink" placeholder="https://..." className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Problem *</label>
            <textarea name="problem" required rows={2} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Solution *</label>
            <textarea name="solution" required rows={2} className={inputCls} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Features (comma separated)</label>
              <input name="features" placeholder="Menu, Booking, WhatsApp" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Technology used</label>
              <input name="technologyUsed" placeholder="Next.js, Tailwind" className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm text-ink">
            <input type="checkbox" name="isDemo" className="size-4 accent-[var(--accent)]" />
            This is a demo concept (shows &quot;Concept&quot; badge — keep honest!)
          </label>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Adding..." : "Add project"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No custom portfolio items yet. The 6 built-in demo concepts are showing on the public page.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {item.projectTitle}{" "}
                  {item.isDemo && (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                      DEMO
                    </span>
                  )}{" "}
                  {item.status === "hidden" && (
                    <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[11px] font-bold text-ink-soft">
                      HIDDEN
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {item.industry} · {item.category}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggle(item.id, item.status)}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  {item.status === "active" ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => remove(item.id)}
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
