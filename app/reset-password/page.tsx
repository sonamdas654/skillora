"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // The recovery link logs the user in via a temporary session and fires
    // this event once Supabase has processed the URL.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // In case the event already fired before we subscribed.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/logo-mark.png" alt="Skilloura" width={40} height={40} className="size-9 object-contain" />
          <span className="text-title-1 font-black tracking-tight text-ink">Skilloura</span>
        </Link>

        <div className="rounded-panel border border-line bg-surface p-7 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)] sm:p-8">
          <h1 className="text-title-1 font-bold text-ink">Set a new password</h1>

          {!ready && !done && (
            <p className="mt-3 text-body-sm text-ink-soft">
              Verifying your reset link… If this doesn&apos;t update, open the link from your email
              again.
            </p>
          )}

          {done && (
            <div className="mt-4 rounded-field border border-mint/25 bg-success/10 px-4 py-3 text-body-sm font-medium text-ink">
              Password updated. Redirecting you to sign in…
            </div>
          )}

          {ready && !done && (
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              {error && (
                <div role="alert" className="rounded-field border border-danger/25 bg-danger-soft px-4 py-3 text-body-sm font-medium text-danger">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-ink">New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-field border border-line bg-surface px-4 py-3 text-body-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-accent/20"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-ink">Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-field border border-line bg-surface px-4 py-3 text-body-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-accent/20"
                  placeholder="Re-enter new password"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-brand py-3 text-body-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                {busy ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
