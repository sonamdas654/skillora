"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECT_STATUSES } from "@/lib/projectStatus";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

interface ProjectView {
  id: string;
  projectName: string;
  clientName: string;
  serviceType: string | null;
  status: string;
  startDate: string | null;
  expectedDeliveryDate: string | null;
}

export default function ProjectsManager({
  projects,
  leads,
}: {
  projects: ProjectView[];
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
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: fd.get("leadId"),
        projectName: fd.get("projectName"),
        expectedDeliveryDate: fd.get("expectedDeliveryDate"),
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to create project");
    }
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  const statusIndex = (s: string) => PROJECT_STATUSES.indexOf(s as (typeof PROJECT_STATUSES)[number]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm ? "Cancel" : "+ New project"}
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
              <label className="mb-1.5 block text-sm font-semibold text-ink">Project name *</label>
              <input name="projectName" required placeholder="e.g. Spice Route website" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Expected delivery</label>
              <input name="expectedDeliveryDate" type="date" className={inputCls} />
            </div>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create project"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {projects.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No projects yet. Create one when a lead is confirmed.
          </p>
        )}
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {p.projectName}{" "}
                  <span className="font-normal text-ink-soft">· {p.clientName}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {p.serviceType}
                  {p.expectedDeliveryDate &&
                    ` · delivery ${new Date(p.expectedDeliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                </p>
              </div>
              <select
                value={p.status}
                onChange={(e) => setStatus(p.id, e.target.value)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-accent focus:outline-none"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {/* Status progress bar */}
            <div className="mt-3 h-1.5 rounded-full bg-line">
              <div
                className={`h-1.5 rounded-full ${p.status === "Delivered" || p.status === "Maintenance active" ? "bg-mint" : "bg-accent"}`}
                style={{
                  width: `${((statusIndex(p.status) + 1) / PROJECT_STATUSES.length) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
