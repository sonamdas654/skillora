"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Shown on the client dashboard until the account's email is confirmed.
// Sensitive areas (projects, quotes, payments, files) stay locked until
// then — see requireVerifiedClient() in lib/supabase/guards.ts for the
// server-side gate used once those pages are built.
export default function VerifyEmailBanner({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function resend() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email });
    setSent(true);
    setBusy(false);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-warning/25 bg-gold-soft px-5 py-4">
      <p className="text-body-sm font-medium text-ink">
        <span className="font-bold">Please verify your email</span> — project, quote, payment and
        file access unlocks once you confirm {email}.
      </p>
      <button
        onClick={resend}
        disabled={busy || sent}
        className="shrink-0 rounded-full border border-amber-300 bg-surface px-4 py-2 text-body-sm font-bold text-ink transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
      >
        {sent ? "Email sent ✓" : busy ? "Sending…" : "Resend email"}
      </button>
    </div>
  );
}
