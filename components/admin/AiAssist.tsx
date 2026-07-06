"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AiAssist({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function run(kind: "summary" | "quote_draft") {
    setLoading(kind);
    setError("");
    setResult("");
    const res = await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, kind }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(null);
    if (res.ok) {
      setResult(json.text);
      router.refresh(); // AI output is also saved as a note
    } else {
      setError(json.error || "AI request failed");
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="text-base font-bold text-ink">
        AI assist{" "}
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
          BETA
        </span>
      </h2>
      <p className="mt-1 text-xs text-ink-soft">
        Output is saved to internal notes automatically.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => run("summary")}
          disabled={loading !== null}
          className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-accent transition-colors disabled:opacity-50"
        >
          {loading === "summary" ? "Analyzing..." : "Summarize requirement"}
        </button>
        <button
          onClick={() => run("quote_draft")}
          disabled={loading !== null}
          className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-accent transition-colors disabled:opacity-50"
        >
          {loading === "quote_draft" ? "Drafting..." : "Draft quotation"}
        </button>
      </div>
      {error && (
        <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-5 text-amber-700">
          {error}
        </p>
      )}
      {result && (
        <div className="mt-3">
          <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl bg-background p-4 text-xs leading-5 text-ink font-sans">
            {result}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 text-xs font-semibold text-accent hover:underline"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}
