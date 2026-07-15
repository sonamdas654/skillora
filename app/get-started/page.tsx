"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { serviceCategories } from "@/lib/services";
import { budgetRanges } from "@/lib/site";

type Step = 1 | 2;

// Everything needed to (a) restore the form after a login round-trip and
// (b) submit the exact same row (same ref => upsert, never a duplicate).
type Draft = {
  ref: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  serviceType: string;
  description: string;
  budget: string;
  deadline: string;
  pkg: string;
  pendingSubmit: boolean;
};

const DRAFT_KEY = "skilloura_getstarted_v2";

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}
function saveDraft(d: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {}
}
function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export default function GetStartedPage() {
  return (
    <Suspense fallback={null}>
      <GetStartedForm />
    </Suspense>
  );
}

function GetStartedForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  // A stable ref for this submission. Restored from the draft if we're
  // resuming after login, so the partial row and the final submit are one row.
  const [ref, setRef] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
  );

  const [step, setStep] = useState<Step>(1);
  const [loggedIn, setLoggedIn] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // ?service=<slug> from a CTA elsewhere on the site (e.g. a service page's
  // "Get Free Quote" button) — prefill it; a resumed draft overrides this below.
  const [service, setService] = useState(() => {
    const slug = searchParams.get("service");
    return slug && serviceCategories.some((s) => s.slug === slug) ? slug : "";
  });
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  // ?package=<name> from a pricing "Get This Package" CTA — shown as a chip and
  // included in the request so the client never re-picks what they just chose.
  const [pkg, setPkg] = useState(() => searchParams.get("package") || "");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function applyDraft(d: Draft) {
    setRef(d.ref);
    setName(d.name);
    setEmail(d.email);
    setPhone(d.phone);
    setService(d.service);
    setServiceType(d.serviceType);
    setDescription(d.description);
    setBudget(d.budget);
    setDeadline(d.deadline);
    setPkg(d.pkg || "");
  }

  function currentDraft(pendingSubmit: boolean): Draft {
    return { ref, name, email, phone, service, serviceType, description, budget, deadline, pkg, pendingSubmit };
  }

  async function submitDraft(d: Draft, partial: boolean) {
    const svc = serviceCategories.find((s) => s.slug === d.service);
    // Fold the chosen package (from a pricing CTA) into the description so it
    // reaches the admin without needing a separate DB column.
    const description = d.pkg ? `[Package chosen: ${d.pkg}]\n${d.description}` : d.description;
    return supabase.rpc("submit_project_request", {
      p_ref: d.ref,
      p_name: d.name,
      p_email: d.email,
      p_phone: d.phone,
      p_service: svc?.name ?? d.service,
      p_service_type: d.serviceType,
      p_description: description,
      p_budget: d.budget,
      p_deadline: d.deadline,
      p_partial: partial,
    });
  }

  // On load: resume a draft, and if the user is now logged in and had a
  // pending submit, finish it automatically — right where they left off.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const draft = loadDraft();

      if (data.user) {
        setLoggedIn(true);
        if (draft) {
          applyDraft(draft);
          if (draft.pendingSubmit) {
            // Resume: submit the saved request for this now-signed-in user.
            setStep(2);
            setFinishing(true);
            const { error } = await submitDraft(draft, false);
            if (!active) return;
            if (error) {
              setFinishing(false);
              setError(error.message || "Could not submit your request. Please try again.");
              return;
            }
            clearDraft();
            router.replace("/client/dashboard?submitted=1");
            router.refresh();
            return;
          }
          setStep(2);
        } else {
          // Fresh visit while logged in — prefill contact from the account.
          setEmail(data.user.email ?? "");
          setName((data.user.user_metadata?.full_name as string) ?? "");
          setPhone((data.user.user_metadata?.whatsapp as string) ?? "");
        }
      } else if (draft) {
        // Guest returned without signing in — restore so nothing is lost.
        applyDraft(draft);
        setStep(draft.service || draft.description ? 2 : 1);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeService = serviceCategories.find((s) => s.slug === service);

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Persist locally so a refresh / login round-trip never loses the form.
    saveDraft(currentDraft(false));
    // Best-effort partial capture so the owner still sees abandoned leads.
    try {
      await submitDraft(currentDraft(false), true);
    } catch {}
    setBusy(false);
    setStep(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    if (!loggedIn) {
      // Require a real, verified account at the moment of submission.
      // Save everything and hand off to login — we'll resume on return.
      saveDraft(currentDraft(true));
      router.push("/login?next=/get-started");
      return;
    }

    const { error } = await submitDraft(currentDraft(false), false);
    if (error) {
      setError(error.message || "Could not submit. Please try again.");
      setBusy(false);
      return;
    }
    clearDraft();
    router.replace("/client/dashboard?submitted=1");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-xl px-4 py-12">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/logo-mark.png" alt="Skilloura" width={36} height={36} className="size-8 object-contain" />
          <span className="text-lg font-black tracking-tight text-ink">Skilloura</span>
        </Link>

        <div className="rounded-3xl border border-line bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)] sm:p-8">
          {finishing ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid size-12 animate-pulse place-items-center rounded-2xl bg-accent-soft text-2xl">⏳</span>
              <h1 className="mt-4 text-xl font-bold text-ink">Finishing your request…</h1>
              <p className="mt-1 text-sm text-ink-soft">You&apos;re signed in — submitting the details you entered.</p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-soft">
                <span>Step {step} of 2</span>
                <span>Takes 3–5 minutes</span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                {[1, 2].map((n) => (
                  <div key={n} className={`h-1.5 flex-1 rounded-full ${step >= n ? "bg-accent" : "bg-line"}`} />
                ))}
              </div>
              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-ink-soft">
                <span className="inline-flex items-center gap-1">✓ No payment required</span>
                <span className="inline-flex items-center gap-1">✓ We won&apos;t spam you</span>
                <span className="inline-flex items-center gap-1">✓ Free, no obligation</span>
              </div>

              {pkg && (
                <div className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-accent/25 bg-accent-soft/50 px-4 py-2.5">
                  <span className="text-sm text-ink">
                    Selected package: <span className="font-bold">{pkg}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPkg("")}
                    className="text-xs font-semibold text-ink-soft hover:text-accent hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={onContinue} className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-ink">Start your project</h1>
                    <p className="mt-1 text-sm text-ink-soft">
                      Tell us how to reach you — then your requirement. Free, no obligation.
                    </p>
                  </div>
                  <div>
                    <label className={labelCls}>Full name</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp number</label>
                    <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
                    <p className="mt-1.5 text-xs text-ink-soft">
                      We use your email + WhatsApp only to send your scope, quote and project
                      updates — never for spam.
                    </p>
                  </div>
                  <button type="submit" disabled={busy} className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60">
                    {busy ? "Please wait…" : "Continue"}
                  </button>
                  <p className="text-center text-xs text-ink-soft">
                    Already have an account?{" "}
                    <Link href="/login?next=/get-started" className="font-semibold text-accent hover:underline">Sign in</Link>
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-ink">Your requirement</h1>
                    <p className="mt-1 text-sm text-ink-soft">A few details so we can prepare a clear scope and quote.</p>
                  </div>
                  <div>
                    <label className={labelCls}>Service</label>
                    <select required value={service} onChange={(e) => { setService(e.target.value); setServiceType(""); }} className={inputCls}>
                      <option value="">Select a service…</option>
                      {serviceCategories.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  {activeService && (
                    <div>
                      <label className={labelCls}>Project type</label>
                      <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputCls}>
                        <option value="">Select…</option>
                        {activeService.services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className={labelCls}>Describe your project</label>
                    <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="What you need, for whom, and anything important…" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Budget range</label>
                      <select value={budget} onChange={(e) => setBudget(e.target.value)} className={inputCls}>
                        <option value="">Select…</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Deadline (optional)</label>
                      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} min={new Date().toISOString().split("T")[0]} />
                    </div>
                  </div>

                  {!loggedIn && (
                    <div className="rounded-xl border border-accent/20 bg-accent-soft/50 px-4 py-3 text-xs leading-5 text-ink-soft">
                      To submit, you&apos;ll quickly sign in or create a free account — this confirms your request and gives you a
                      dashboard to track it. <span className="font-semibold text-ink">Your details are saved</span>, so you&apos;ll come
                      right back here and finish automatically.
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent">
                      Back
                    </button>
                    <button type="submit" disabled={busy} className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60">
                      {busy ? "Please wait…" : loggedIn ? "Submit request" : "Sign in & submit"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
