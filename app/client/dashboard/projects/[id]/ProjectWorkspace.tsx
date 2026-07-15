"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  PROJECT_STATUS_LABEL,
  QUOTE_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  REVISION_STATUS_LABEL,
  PROJECT_STATUS_OPTIONS,
  REVISION_STATUS_OPTIONS,
  statusPillClass,
} from "@/lib/portalLabels";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

async function uploadToStorage(supabase: SupabaseClient, userId: string, projectId: string, file: File, kind: string) {
  const path = `${userId}/${projectId}/${kind}-${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("project-files").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export default function ProjectWorkspace({
  project,
  quotes,
  payments,
  revisions,
  previews,
  files,
  messages,
  userId,
  role,
}: {
  project: Row;
  quotes: Row[];
  payments: Row[];
  revisions: Row[];
  previews: Row[];
  files: Row[];
  messages: Row[];
  userId: string;
  role: "client" | "admin";
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isAdmin = role === "admin";

  async function run(key: string, fn: () => PromiseLike<{ error?: unknown } | void>) {
    setBusy(key);
    setError("");
    try {
      const res = await fn();
      if (res && "error" in res && res.error) throw res.error;
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  const latestQuote = quotes[0];

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-line bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{project.service_category}</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">{project.title}</h1>
          {project.description && <p className="mt-2 max-w-xl text-sm text-ink-soft">{project.description}</p>}
          <div className="mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="text-right">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPillClass(project.status)}`}>
            {PROJECT_STATUS_LABEL[project.status] ?? project.status}
          </span>
          {isAdmin && (
            <AdminStatusControl
              projectId={project.id}
              current={project.status}
              progress={project.progress}
              busy={busy === "status"}
              onSave={(status, progress) =>
                run("status", () => supabase.rpc("update_project_status", { p_project_id: project.id, p_status: status, p_progress: progress }))
              }
            />
          )}
        </div>
      </div>

      {/* Scope & Quote */}
      <Section title="Written scope & quote" empty={quotes.length === 0} emptyText="No quote has been prepared yet.">
        {isAdmin && (
          <QuoteForm
            projectId={project.id}
            existing={latestQuote}
            busy={busy === "quote"}
            onSave={(payload) => run("quote", () => supabase.rpc("publish_quote", payload))}
          />
        )}
        {quotes.map((q) => (
          <div key={q.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-ink">{q.title || q.quote_number}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPillClass(q.status)}`}>
                {QUOTE_STATUS_LABEL[q.status] ?? q.status}
              </span>
            </div>
            <p className="mt-1 text-2xl font-black text-ink">
              {q.currency} {Number(q.amount).toLocaleString("en-IN")}
            </p>
            {Array.isArray(q.scope) && q.scope.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {q.scope.map((item: string | { label: string }, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent">✓</span>
                    <span>{typeof item === "string" ? item : item.label}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-soft">
              {q.revisions != null && <span>{q.revisions} revisions included</span>}
              {q.payment_terms && <span>· {q.payment_terms}</span>}
              {q.valid_until && <span>· Valid until {new Date(q.valid_until).toLocaleDateString("en-IN")}</span>}
            </div>
            {!isAdmin && q.status === "sent" && (
              <div className="mt-4 flex gap-3">
                <button
                  disabled={busy === "quote-yes"}
                  onClick={() => run("quote-yes", () => supabase.rpc("respond_to_quote", { p_quote_id: q.id, p_approve: true }))}
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep disabled:opacity-60"
                >
                  Approve quote
                </button>
                <button
                  disabled={busy === "quote-no"}
                  onClick={() => run("quote-no", () => supabase.rpc("respond_to_quote", { p_quote_id: q.id, p_approve: false }))}
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent disabled:opacity-60"
                >
                  Request changes
                </button>
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* Payment */}
      <Section title="Payment status" empty={payments.length === 0} emptyText="No payment has been requested yet.">
        {isAdmin && (
          <CreatePaymentForm
            projectId={project.id}
            busy={busy === "payment-new"}
            onCreate={(amount, currency, due) =>
              run("payment-new", () => supabase.rpc("create_payment_request", { p_project_id: project.id, p_amount: amount, p_currency: currency, p_due_date: due || null }))
            }
          />
        )}
        {payments.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-ink">{p.invoice_number}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPillClass(p.status)}`}>
                {PAYMENT_STATUS_LABEL[p.status] ?? p.status}
              </span>
            </div>
            <p className="mt-1 text-xl font-black text-ink">
              {p.currency} {Number(p.amount).toLocaleString("en-IN")}
            </p>
            {p.due_date && <p className="mt-1 text-xs text-ink-soft">Due {new Date(p.due_date).toLocaleDateString("en-IN")}</p>}
            {p.reference && <p className="mt-1 text-xs text-ink-soft">Reference: {p.reference}</p>}

            {!isAdmin && p.status === "pending" && (
              <PaymentProofForm
                busy={busy === `pay-${p.id}`}
                onSubmit={(method, ref, file) =>
                  run(`pay-${p.id}`, async () => {
                    let path: string | null = null;
                    if (file) path = await uploadToStorage(supabase, userId, project.id, file, "payment");
                    return supabase.rpc("submit_payment_proof", { p_payment_id: p.id, p_method: method, p_reference: ref, p_screenshot_path: path });
                  })
                }
              />
            )}
            {isAdmin && p.status === "submitted" && (
              <div className="mt-4 flex gap-3">
                <button
                  disabled={busy === `verify-${p.id}`}
                  onClick={() => run(`verify-${p.id}`, () => supabase.rpc("verify_payment", { p_payment_id: p.id, p_verify: true }))}
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep disabled:opacity-60"
                >
                  Verify payment
                </button>
                <button
                  disabled={busy === `reject-${p.id}`}
                  onClick={() => run(`reject-${p.id}`, () => supabase.rpc("verify_payment", { p_payment_id: p.id, p_verify: false }))}
                  className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* Preview links */}
      <Section title="Preview links" empty={previews.length === 0} emptyText="No preview has been shared yet.">
        {isAdmin && (
          <PreviewForm
            busy={busy === "preview-new"}
            onCreate={(label, url) => run("preview-new", () => supabase.rpc("share_preview_link", { p_project_id: project.id, p_label: label, p_url: url }))}
          />
        )}
        {previews.map((pv) => (
          <a
            key={pv.id}
            href={pv.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 hover:border-accent"
          >
            <div>
              <p className="font-bold text-ink">{pv.label || "Preview"}</p>
              <p className="mt-0.5 truncate text-sm text-accent">{pv.url}</p>
            </div>
            <span className="text-accent">→</span>
          </a>
        ))}
      </Section>

      {/* Revisions */}
      <Section title="Revision requests" empty={revisions.length === 0} emptyText="No revisions requested yet.">
        {!isAdmin && (
          <RevisionForm
            busy={busy === "revision-new"}
            onSubmit={(notes) => run("revision-new", () => supabase.rpc("submit_revision", { p_project_id: project.id, p_items: [], p_notes: notes }))}
          />
        )}
        {revisions.map((r) => (
          <div key={r.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-ink">Round {r.round_number}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusPillClass(r.status)}`}>
                {REVISION_STATUS_LABEL[r.status] ?? r.status}
              </span>
            </div>
            {r.notes && <p className="mt-2 text-sm text-ink-soft">{r.notes}</p>}
            {isAdmin && r.status !== "completed" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {REVISION_STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    disabled={busy === `rev-${r.id}-${s}`}
                    onClick={() => run(`rev-${r.id}-${s}`, () => supabase.rpc("respond_to_revision", { p_revision_id: r.id, p_status: s }))}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent disabled:opacity-60"
                  >
                    {REVISION_STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* Files */}
      <Section title="Files & handover" empty={files.length === 0} emptyText="No files yet.">
        <FileUploadForm
          busy={busy === "file-new"}
          adminUpload={isAdmin}
          onUpload={(file) =>
            run("file-new", async () => {
              const path = await uploadToStorage(supabase, userId, project.id, file, isAdmin ? "delivery" : "upload");
              return supabase.rpc("register_file", {
                p_project_id: project.id,
                p_name: file.name,
                p_storage_path: path,
                p_size_bytes: file.size,
                p_mime_type: file.type,
                p_kind: isAdmin ? "delivery" : "upload",
              });
            })
          }
        />
        {files.map((f) => (
          <FileRow key={f.id} file={f} supabase={supabase} />
        ))}
      </Section>

      {/* Messages */}
      <Section title="Messages & updates" empty={messages.length === 0} emptyText="No messages yet — say hello!">
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-md rounded-2xl border p-4 text-sm ${
                m.sender_id === userId ? "ml-auto border-accent bg-accent-soft/40" : "border-line bg-white"
              }`}
            >
              <p className="text-ink">{m.body}</p>
              <p className="mt-1 text-[11px] text-ink-soft">{new Date(m.created_at).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
        <MessageForm
          busy={busy === "message-new"}
          onSend={(body) => run("message-new", () => supabase.rpc("send_message", { p_project_id: project.id, p_body: body }))}
        />
      </Section>

      {isAdmin && project.status !== "closed" && (
        <button
          disabled={busy === "close"}
          onClick={() => run("close", () => supabase.rpc("close_project", { p_project_id: project.id }))}
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:border-accent hover:text-accent disabled:opacity-60"
        >
          Mark project as closed
        </button>
      )}
    </div>
  );
}

function Section({ title, empty, emptyText, children }: { title: string; empty: boolean; emptyText: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold text-ink">{title}</h2>
      <div className="space-y-3">
        {children}
        {empty && (
          <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-center text-sm text-ink-soft">{emptyText}</div>
        )}
      </div>
    </section>
  );
}

function AdminStatusControl({
  current,
  progress,
  busy,
  onSave,
}: {
  projectId: string;
  current: string;
  progress: number;
  busy: boolean;
  onSave: (status: string, progress: number) => void;
}) {
  const [status, setStatus] = useState(current);
  const [prog, setProg] = useState(progress);
  return (
    <div className="mt-3 flex items-center gap-2">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-line px-2 py-1.5 text-xs">
        {PROJECT_STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {PROJECT_STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        max={100}
        value={prog}
        onChange={(e) => setProg(Number(e.target.value))}
        className="w-16 rounded-lg border border-line px-2 py-1.5 text-xs"
      />
      <button disabled={busy} onClick={() => onSave(status, prog)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">
        Save
      </button>
    </div>
  );
}

function QuoteForm({ existing, busy, onSave }: { projectId: string; existing?: Row; busy: boolean; onSave: (p: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [amount, setAmount] = useState(existing?.amount || "");
  const [scopeText, setScopeText] = useState(
    Array.isArray(existing?.scope)
      ? existing.scope.map((s: string | { label: string }) => (typeof s === "string" ? s : s.label)).join("\n")
      : ""
  );
  const [terms, setTerms] = useState(existing?.payment_terms || "50% advance, 50% on delivery");
  const [revs, setRevs] = useState(existing?.revisions ?? 2);

  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-5">
      <p className="mb-3 text-sm font-bold text-ink">{existing ? "Update quote" : "Prepare a quote"}</p>
      <div className="space-y-2.5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quote title" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (INR)"
          className="w-full rounded-lg border border-line px-3 py-2 text-sm"
        />
        <textarea
          value={scopeText}
          onChange={(e) => setScopeText(e.target.value)}
          rows={3}
          placeholder="Scope, one line per item"
          className="w-full rounded-lg border border-line px-3 py-2 text-sm"
        />
        <div className="grid grid-cols-2 gap-2.5">
          <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Payment terms" className="rounded-lg border border-line px-3 py-2 text-sm" />
          <input type="number" value={revs} onChange={(e) => setRevs(Number(e.target.value))} placeholder="Revisions" className="rounded-lg border border-line px-3 py-2 text-sm" />
        </div>
        <button
          disabled={busy || !title || !amount}
          onClick={() =>
            onSave({
              p_quote_id: existing?.status === "draft" ? existing.id : null,
              p_project_id: existing?.project_id,
              p_title: title,
              p_scope: scopeText.split("\n").filter(Boolean),
              p_amount: Number(amount),
              p_currency: "INR",
              p_revisions: revs,
              p_payment_terms: terms,
              p_valid_until: null,
            })
          }
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {existing ? "Update & send" : "Publish quote"}
        </button>
      </div>
    </div>
  );
}

function CreatePaymentForm({ busy, onCreate }: { projectId: string; busy: boolean; onCreate: (amount: number, currency: string, due: string) => void }) {
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState("");
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-5">
      <p className="mb-3 text-sm font-bold text-ink">Request a payment</p>
      <div className="flex flex-wrap gap-2.5">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (INR)" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="rounded-lg border border-line px-3 py-2 text-sm" />
        <button
          disabled={busy || !amount}
          onClick={() => onCreate(Number(amount), "INR", due)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          Send request
        </button>
      </div>
    </div>
  );
}

function PaymentProofForm({ busy, onSubmit }: { busy: boolean; onSubmit: (method: string, ref: string, file: File | null) => void }) {
  const [method, setMethod] = useState("UPI");
  const [ref, setRef] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-4 space-y-2.5 rounded-xl bg-background p-4">
      <p className="text-xs font-semibold text-ink-soft">Submit payment proof</p>
      <div className="flex flex-wrap gap-2.5">
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="rounded-lg border border-line px-3 py-2 text-sm">
          <option>UPI</option>
          <option>Bank transfer</option>
          <option>Other</option>
        </select>
        <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Transaction reference / UTR" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="text-sm" />
      </div>
      <button
        disabled={busy || !ref}
        onClick={() => onSubmit(method, ref, fileRef.current?.files?.[0] ?? null)}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        Submit proof
      </button>
    </div>
  );
}

function PreviewForm({ busy, onCreate }: { busy: boolean; onCreate: (label: string, url: string) => void }) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-5">
      <p className="mb-3 text-sm font-bold text-ink">Share a preview link</p>
      <div className="flex flex-wrap gap-2.5">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. Homepage draft)" className="rounded-lg border border-line px-3 py-2 text-sm" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="flex-1 rounded-lg border border-line px-3 py-2 text-sm" />
        <button disabled={busy || !url} onClick={() => onCreate(label, url)} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          Share
        </button>
      </div>
    </div>
  );
}

function RevisionForm({ busy, onSubmit }: { busy: boolean; onSubmit: (notes: string) => void }) {
  const [notes, setNotes] = useState("");
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-5">
      <p className="mb-3 text-sm font-bold text-ink">Request a revision</p>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="What would you like changed?" className="w-full rounded-lg border border-line px-3 py-2 text-sm" />
      <button
        disabled={busy || !notes}
        onClick={() => onSubmit(notes)}
        className="mt-2.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        Submit revision request
      </button>
    </div>
  );
}

function FileUploadForm({ busy, adminUpload, onUpload }: { busy: boolean; adminUpload: boolean; onUpload: (f: File) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-5">
      <p className="mb-3 text-sm font-bold text-ink">{adminUpload ? "Upload delivery file" : "Upload a file for the team"}</p>
      <div className="flex flex-wrap gap-2.5">
        <input ref={fileRef} type="file" className="text-sm" />
        <button
          disabled={busy}
          onClick={() => {
            const f = fileRef.current?.files?.[0];
            if (f) onUpload(f);
          }}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

function FileRow({ file, supabase }: { file: Row; supabase: SupabaseClient }) {
  const [busy, setBusy] = useState(false);
  async function download() {
    setBusy(true);
    const { data } = await supabase.storage.from("project-files").createSignedUrl(file.storage_path, 60);
    setBusy(false);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5">
      <div className="min-w-0">
        <p className="truncate font-bold text-ink">{file.name}</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {file.kind === "delivery" ? "Delivered by Skilloura" : "Uploaded by you"} · {new Date(file.created_at).toLocaleDateString("en-IN")}
        </p>
      </div>
      <button disabled={busy} onClick={download} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent disabled:opacity-60">
        Download
      </button>
    </div>
  );
}

function MessageForm({ busy, onSend }: { busy: boolean; onSend: (body: string) => void }) {
  const [body, setBody] = useState("");
  return (
    <div className="mt-3 flex gap-2.5">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a message…"
        className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && body.trim()) {
            onSend(body.trim());
            setBody("");
          }
        }}
      />
      <button
        disabled={busy || !body.trim()}
        onClick={() => {
          onSend(body.trim());
          setBody("");
        }}
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        Send
      </button>
    </div>
  );
}
