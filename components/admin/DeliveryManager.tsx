"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface DeliveryFileView {
  id: string;
  fileName: string;
  fileSize: number;
  note: string | null;
  createdAt: string;
}

// Owner uploads final deliverables; the client sees them in their portal
// and gets an email automatically.
export default function DeliveryManager({
  leadId,
  files,
}: {
  leadId: string;
  files: DeliveryFileView[];
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    const selected = fileInput.current?.files;
    if (!selected || selected.length === 0) {
      setError("Choose at least one file.");
      return;
    }
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("note", note);
    [...selected].forEach((f) => fd.append("files", f));
    const res = await fetch(`/api/admin/leads/${leadId}/delivery`, { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) {
      if (fileInput.current) fileInput.current.value = "";
      setNote("");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Upload failed");
    }
  }

  async function remove(fileId: string) {
    if (!confirm("Remove this delivered file? The client will no longer see it.")) return;
    await fetch(`/api/admin/leads/${leadId}/delivery`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    });
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="text-base font-bold text-ink">Deliverables ({files.length})</h2>
      <p className="mt-1 text-xs text-ink-soft">
        Files you upload here appear in the client&apos;s portal — they get an email instantly.
      </p>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-2.5"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">{f.fileName}</span>
                {f.note && <span className="block truncate text-xs text-ink-soft">{f.note}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-ink-soft">
                  {(f.fileSize / 1024 / 1024).toFixed(1)} MB
                </span>
                <button
                  onClick={() => remove(f.id)}
                  className="text-sm font-semibold text-red-500 hover:underline"
                >
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={upload} className="mt-4 space-y-3 border-t border-line pt-4">
        <input
          ref={fileInput}
          type="file"
          multiple
          className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note shown to client (e.g. Final website files + credentials)"
          className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        <button
          disabled={busy}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Deliver files to client"}
        </button>
      </form>
    </div>
  );
}
