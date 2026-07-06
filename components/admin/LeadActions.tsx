"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES } from "@/lib/leadStatus";

interface NoteView {
  id: string;
  note: string;
  author: string;
  date: string;
}

export default function LeadActions({
  leadId,
  currentStatus,
  currentScore,
  notes,
}: {
  leadId: string;
  currentStatus: string;
  currentScore: string;
  notes: NoteView[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState("");

  async function patch(data: Record<string, string>) {
    setSaving(true);
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    router.refresh();
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteText }),
    });
    setNoteText("");
    setSaving(false);
    router.refresh();
  }

  const selectCls =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="text-base font-bold text-ink">Manage lead</h2>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Status
      </label>
      <select
        className={`mt-1.5 ${selectCls}`}
        value={currentStatus}
        disabled={saving}
        onChange={(e) => patch({ leadStatus: e.target.value })}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Lead score
      </label>
      <select
        className={`mt-1.5 ${selectCls}`}
        value={currentScore}
        disabled={saving}
        onChange={(e) => patch({ leadScore: e.target.value })}
      >
        {["High", "Medium", "Low"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Internal notes
      </label>
      <div className="mt-1.5 flex gap-2">
        <input
          className={selectCls}
          placeholder="Add a note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
        <button
          onClick={addNote}
          disabled={saving || !noteText.trim()}
          className="shrink-0 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Add
        </button>
      </div>
      <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto">
        {notes.map((n) => (
          <li key={n.id} className="rounded-xl bg-background px-3.5 py-2.5">
            <p className="text-sm text-ink whitespace-pre-wrap">{n.note}</p>
            <p className="mt-1 text-[11px] text-ink-soft">
              {n.author} ·{" "}
              {new Date(n.date).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
