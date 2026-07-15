"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { serviceCategories } from "@/lib/services";
import { budgetRanges } from "@/lib/site";

type Step = 1 | 2 | 3;

export default function GetStartedPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [ref] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
  );
  const [step, setStep] = useState<Step>(1);
  const [loggedIn, setLoggedIn] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Prefill for logged-in users and skip the contact step.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setLoggedIn(true);
        setEmail(data.user.email ?? "");
        setName((data.user.user_metadata?.full_name as string) ?? "");
        setPhone((data.user.user_metadata?.whatsapp as string) ?? "");
      }
    });
  }, [supabase]);

  const activeService = serviceCategories.find((s) => s.slug === service);

  async function rpc(partial: boolean) {
    return supabase.rpc("submit_project_request", {
      p_ref: ref,
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_service: activeService?.name ?? service,
      p_service_type: serviceType,
      p_description: description,
      p_budget: budget,
      p_deadline: deadline,
      p_partial: partial,
    });
  }

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    // Partial lead capture — best effort, don't block the user if it fails.
    try {
      await rpc(true);
    } catch {}
    setBusy(false);
    setStep(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await rpc(false);
    if (error) {
      setError(error.message || "Could not submit. Please try again.");
      setBusy(false);
      return;
    }
    if (loggedIn) {
      router.replace("/client/dashboard?submitted=1");
      router.refresh();
      return;
    }
    setStep(3);
    setBusy(false);
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
          {/* Progress */}
          {step < 3 && (
            <div className="mb-6 flex items-center gap-2">
              {[1, 2].map((n) => (
                <div key={n} className={`h-1.5 flex-1 rounded-full ${step >= n ? "bg-accent" : "bg-line"}`} />
              ))}
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
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent">
                  Back
                </button>
                <button type="submit" disabled={busy} className="flex-1 rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60">
                  {busy ? "Submitting…" : "Submit request"}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-mint/10 text-2xl">✅</span>
              <h1 className="mt-4 text-2xl font-bold text-ink">Request submitted!</h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Thanks, {name || "there"}. We&apos;ll review it and reply within 24 hours.
                <br />
                <span className="font-semibold text-ink">Create your account</span> to track this
                project, approve quotes and get files — we&apos;ll link it to <span className="font-semibold">{email}</span> automatically.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href={`/login?next=/client/dashboard`}
                  className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
                >
                  Create account / Sign in
                </Link>
                <Link href="/" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink hover:border-accent hover:text-accent">
                  Back to home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
