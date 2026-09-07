"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      // Always show success — never reveal whether an email is registered.
      setDone(true);
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
          <h1 className="text-title-1 font-bold text-ink">Reset your password</h1>
          <p className="mt-1 text-body-sm text-ink-soft">
            Enter your account email — we&apos;ll send a link to reset your password.
          </p>

          {done ? (
            <div className="mt-5 rounded-field border border-mint/25 bg-success/10 px-4 py-3 text-body-sm font-medium text-ink">
              If an account exists for that email, a reset link is on its way. Check your inbox.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              {error && (
                <div role="alert" className="rounded-field border border-danger/25 bg-danger-soft px-4 py-3 text-body-sm font-medium text-danger">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-body-sm font-semibold text-ink">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-field border border-line bg-surface px-4 py-3 text-body-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-accent/20"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-brand py-3 text-body-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-body-sm text-ink-soft">
            <Link href="/login" className="font-semibold text-brand hover:underline">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
