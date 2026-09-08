"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { serviceCategories } from "@/lib/services";
import { budgetRanges } from "@/lib/site";
import DynamicFormFields from "@/components/DynamicFormFields";
import PricingSummary from "@/components/PricingSummary";
import { usePricingConfig } from "@/lib/usePricingConfig";
import { computeEstimate, isFieldVisible } from "@/lib/pricingEngine";
import { trackEvent } from "@/lib/track";

type Step = 1 | 2;
type Answers = Record<string, string | string[]>;

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
  answers: Answers;
  pendingSubmit: boolean;
};

const DRAFT_KEY = "skilloura_getstarted_v3";

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

/**
 * The requirement flow.
 *
 * Moved out of app/get-started/page.tsx unchanged so that the route can be a
 * server component and finally export metadata — the site's primary
 * conversion URL had no title, description or canonical at all, because a
 * "use client" file cannot export any.
 *
 * NOTHING below this line changed except className strings. Specifically
 * untouched: the DRAFT_KEY, the stable ref UUID that makes the submit an
 * upsert rather than a duplicate, the partial-lead capture between step 1 and
 * step 2, the pendingSubmit login round-trip, the "[Package chosen: X]"
 * description prefix, the answer label-mapping, and the
 * supabase.rpc("submit_project_request") call.
 */
export default function GetStartedFlow() {
  return (
    <Suspense fallback={<FlowSkeleton />}>
      <GetStartedForm />
    </Suspense>
  );
}

/**
 * Shown while the flow hydrates.
 *
 * The fallback used to be `null`, so the primary conversion page rendered a
 * completely blank document until JavaScript finished — nothing in the HTML,
 * nothing on screen. This keeps the frame, the heading and the promise
 * visible from the first paint, so the page is never empty.
 */
function FlowSkeleton() {
  return (
    <div className="min-h-screen bg-canvas px-4 py-14">
      <div className="mx-auto max-w-xl">
        <div className="rounded-panel border border-line bg-surface p-7 shadow-e2 sm:p-9">
          <h1 className="text-title-1 font-bold text-ink">Start your project</h1>
          <p className="mt-2 text-body-base text-ink-soft">
            Tell us how to reach you — then your requirement. You get an itemised scope, a
            fixed quote and exact dates in writing before any payment.
          </p>
          <div className="mt-8 space-y-4" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-3 w-24 rounded-pill bg-surface-sunken" />
                <div className="mt-2 h-11 rounded-field border border-line bg-surface-sunken" />
              </div>
            ))}
            <div className="h-11 rounded-pill bg-surface-sunken" />
          </div>
          <p className="sr-only" role="status">
            Loading the requirement form.
          </p>
        </div>
      </div>
    </div>
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
  // Per-service smart-form answers (lib/services.ts formFields) — so the
  // client gives exactly the detail needed for THIS kind of project, and we
  // don't have to chase them for basics afterwards.
  const [answers, setAnswers] = useState<Answers>({});

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
    setAnswers(d.answers || {});
  }

  function currentDraft(pendingSubmit: boolean): Draft {
    return { ref, name, email, phone, service, serviceType, description, budget, deadline, pkg, answers, pendingSubmit };
  }

  async function submitDraft(d: Draft, partial: boolean) {
    const svc = serviceCategories.find((s) => s.slug === d.service);
    // Fold the chosen package (from a pricing CTA) into the description so it
    // reaches the admin without needing a separate DB column.
    const description = d.pkg ? `[Package chosen: ${d.pkg}]\n${d.description}` : d.description;
    // Turn { key: answer } into { "Question label": answer } so the admin
    // email shows the actual question, not an internal field key.
    const labelledAnswers: Record<string, string | string[]> = {};
    for (const f of svc?.formFields ?? []) {
      const v = d.answers[f.key];
      if (v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0)) {
        labelledAnswers[f.label] = v;
      }
    }
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
      p_form_answers: labelledAnswers,
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
            fetch("/api/notify/project-request", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ref: draft.ref }),
            }).catch(() => {});
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
  // Real-time, database-driven questions + pricing for the selected
  // service — this is the actual calculator now. Falls back to the static
  // formFields (rare: DB unreachable / not yet seeded for a service) so the
  // form never breaks.
  const { config: pricingConfig, loading: pricingLoading } = usePricingConfig(service || null);

  const visibleFields = useMemo(() => {
    if (pricingConfig) return pricingConfig.fields.filter((f) => isFieldVisible(f, answers));
    return (activeService?.formFields ?? []).map((f) => ({
      id: f.key,
      service_id: "",
      field_key: f.key,
      label: f.label,
      field_type: f.type,
      required: !!f.required,
      placeholder: f.placeholder ?? null,
      display_order: 0,
      conditional_rule: null,
    }));
  }, [pricingConfig, activeService, answers]);

  const optionsForFields = useMemo(() => {
    if (pricingConfig) return pricingConfig.optionsByField;
    const map: Record<string, { id: string; field_id: string; option_label: string; option_value: string; market_price: number; skilloura_price: number; pricing_type: "fixed"; quantity_unit: null; minimum_quantity: null; maximum_quantity: null; display_order: number }[]> = {};
    for (const f of activeService?.formFields ?? []) {
      map[f.key] = (f.options ?? []).map((o, i) => ({
        id: `${f.key}-${i}`, field_id: f.key, option_label: o, option_value: o,
        market_price: 0, skilloura_price: 0, pricing_type: "fixed", quantity_unit: null,
        minimum_quantity: null, maximum_quantity: null, display_order: i,
      }));
    }
    return map;
  }, [pricingConfig, activeService]);

  const estimate = useMemo(() => {
    if (!pricingConfig) return null;
    return computeEstimate({
      service: pricingConfig.service,
      fields: pricingConfig.fields,
      optionsByField: pricingConfig.optionsByField,
      rules: pricingConfig.rules,
      externalCosts: pricingConfig.externalCosts,
      answers,
      projectType: serviceType,
    });
  }, [pricingConfig, answers, serviceType]);

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
    // Funnel step 1. This whole page fired nothing before — the highest-intent
    // path on the site was the only one nobody could see into.
    trackEvent("get_started_step1_done", { service });
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
      // Fired BEFORE the redirect. Someone who bounces at a login wall halfway
      // through a form leaves no other trace: the draft is saved, but if they
      // never come back nothing in analytics says a login was the reason.
      trackEvent("get_started_login_required", { service });
      router.push("/login?next=/get-started");
      return;
    }

    const { error } = await submitDraft(currentDraft(false), false);
    if (error) {
      // A failed submit and an abandoned form look identical in aggregate
      // numbers. They are not the same problem, so they get separate events.
      trackEvent("get_started_submit_failed", { service });
      setError(error.message || "Could not submit. Please try again.");
      setBusy(false);
      return;
    }
    trackEvent("get_started_submitted", { service, budget });
    // Best-effort: confirmation email to the client + full-detail email to
    // the admin. Never blocks the redirect if it fails.
    fetch("/api/notify/project-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref }),
    }).catch(() => {});
    clearDraft();
    router.replace("/client/dashboard?submitted=1");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";
  const labelCls = "mb-1.5 block text-body-sm font-semibold text-ink";

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-xl px-4 py-12">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/logo-mark.png" alt="Skilloura" width={36} height={36} className="size-8 object-contain" />
          <span className="text-title-2 font-black tracking-tight text-ink">Skilloura</span>
        </Link>

        <div className="rounded-panel border border-line bg-surface p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)] sm:p-8">
          {finishing ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid size-12 animate-pulse place-items-center rounded-card bg-brand-soft text-title-1">⏳</span>
              <h1 className="mt-4 text-title-1 font-bold text-ink">Finishing your request…</h1>
              <p className="mt-1 text-body-sm text-ink-soft">You&apos;re signed in — submitting the details you entered.</p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-2 flex items-center justify-between text-body-sm font-semibold text-ink-soft">
                <span>Step {step} of 2</span>
                <span>Takes 3–5 minutes</span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                {[1, 2].map((n) => (
                  <div key={n} className={`h-1.5 flex-1 rounded-full ${step >= n ? "bg-accent" : "bg-line"}`} />
                ))}
              </div>
              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-micro font-medium text-ink-soft">
                <span className="inline-flex items-center gap-1">✓ No payment required</span>
                <span className="inline-flex items-center gap-1">✓ We won&apos;t spam you</span>
                <span className="inline-flex items-center gap-1">✓ Free, no obligation</span>
              </div>

              {pkg && (
                <div className="mb-4 flex items-center justify-between gap-2 rounded-field border border-brand/25 bg-brand-soft/50 px-4 py-2.5">
                  <span className="text-body-sm text-ink">
                    Selected package: <span className="font-bold">{pkg}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPkg("")}
                    className="text-body-sm font-semibold text-ink-soft hover:text-brand hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {error && (
                <div role="alert" className="mb-4 rounded-field border border-danger/25 bg-danger-soft px-4 py-3 text-body-sm font-medium text-danger">
                  {error}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={onContinue} className="space-y-4">
                  <div>
                    <h1 className="text-title-1 font-bold text-ink">Start your project</h1>
                    <p className="mt-1 text-body-sm text-ink-soft">
                      Tell us how to reach you — then your requirement. Free, no obligation.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="field-name" className={labelCls}>Full name</label>
                    <input id="field-name" name="field-name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="field-email" className={labelCls}>Email</label>
                    <input id="field-email" name="field-email" autoComplete="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label htmlFor="field-phone" className={labelCls}>WhatsApp number</label>
                    <input id="field-phone" name="field-phone" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 98765 43210" />
                    <p className="mt-1.5 text-body-sm text-ink-soft">
                      We use your email + WhatsApp only to send your scope, quote and project
                      updates — never for spam.{" "}
                      <Link href="/data-security" className="font-semibold text-brand hover:underline">
                        How we protect your data
                      </Link>
                    </p>
                  </div>
                  <button type="submit" disabled={busy} className="w-full rounded-full bg-brand py-3 text-body-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60">
                    {busy ? "Please wait…" : "Continue"}
                  </button>
                  <p className="text-center text-body-sm text-ink-soft">
                    Already have an account?{" "}
                    <Link href="/login?next=/get-started" className="font-semibold text-brand hover:underline">Sign in</Link>
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <h1 className="text-title-1 font-bold text-ink">Your requirement</h1>
                    <p className="mt-1 text-body-sm text-ink-soft">A few details so we can prepare a clear scope and quote.</p>
                  </div>
                  <div>
                    <label htmlFor="field-service" className={labelCls}>Service</label>
                    <select id="field-service" name="field-service"
                      required
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value);
                        setServiceType("");
                        setAnswers({});
                      }}
                      className={inputCls}
                    >
                      <option value="">Select a service…</option>
                      {serviceCategories.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {activeService && (
                    <div>
                      <label htmlFor="field-budget" className={labelCls}>Budget range</label>
                      <select id="field-budget" name="field-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={inputCls}>
                        <option value="">Select to see how it affects your estimate…</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {estimate && activeService && (
                    <PricingSummary serviceName={activeService.name} estimate={estimate} />
                  )}
                  {!estimate && activeService && pricingLoading && (
                    <p className="text-body-sm text-ink-soft">Loading live pricing…</p>
                  )}

                  {activeService && (
                    <div>
                      <label htmlFor="field-projecttype" className={labelCls}>Project type</label>
                      <select id="field-projecttype" name="field-projecttype" value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputCls}>
                        <option value="">Select…</option>
                        {activeService.services.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {activeService && visibleFields.length > 0 && (
                    <div className="space-y-4 rounded-card border border-line bg-canvas p-4">
                      <p className="text-body-sm font-bold uppercase tracking-wider text-ink-soft">
                        A few {activeService.name.toLowerCase()} specifics
                      </p>
                      <DynamicFormFields
                        fields={visibleFields.map((f) => ({
                          key: f.field_key,
                          label: f.label,
                          type: f.field_type,
                          required: f.required,
                          placeholder: f.placeholder ?? undefined,
                          options: (optionsForFields[f.id] ?? []).map((o) => o.option_value),
                        }))}
                        values={answers}
                        onChange={(key, value) => setAnswers((a) => ({ ...a, [key]: value }))}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="field-description" className={labelCls}>Anything else? (optional)</label>
                    <textarea id="field-description" name="field-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} placeholder="Anything not covered above, or extra context…" />
                  </div>

                  <p className="text-body-sm text-ink-soft">
                    Not sure what to put in some of these?{" "}
                    <Link href="/contact" className="font-semibold text-brand hover:underline">
                      Send a general request on the Contact page
                    </Link>{" "}
                    instead — leave anything blank and we&apos;ll ask you directly.
                  </p>

                  <div>
                    <label htmlFor="field-deadline" className={labelCls}>Deadline (optional)</label>
                    <input id="field-deadline" name="field-deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputCls} min={new Date().toISOString().split("T")[0]} />
                  </div>

                  {!loggedIn && (
                    <div className="rounded-field border border-brand/20 bg-brand-soft/50 px-4 py-3 text-body-sm leading-5 text-ink-soft">
                      To submit, you&apos;ll quickly sign in or create a free account — this confirms your request and gives you a
                      dashboard to track it. <span className="font-semibold text-ink">Your details are saved</span>, so you&apos;ll come
                      right back here and finish automatically.
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="rounded-full border border-line px-5 py-3 text-body-sm font-semibold text-ink hover:border-brand hover:text-brand">
                      Back
                    </button>
                    <button type="submit" disabled={busy} className="flex-1 rounded-full bg-brand py-3 text-body-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60">
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
