"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none";

export default function ClientLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/client/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/client/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/client");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={requestCode} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ink">
            Your email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="The email you submitted your project with"
            className={inputCls}
          />
        </div>
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
        >
          {busy ? "Sending code…" : "Email me a login code"}
        </button>
        <p className="text-center text-xs leading-5 text-ink-soft">
          No password needed — we email you a 6-digit code each time.
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode} className="space-y-4">
      <p className="text-sm leading-6 text-ink-soft">
        We sent a 6-digit code to <b className="text-ink">{email}</b>. It expires in 10 minutes.
      </p>
      <div>
        <label htmlFor="code" className="mb-1.5 block text-sm font-semibold text-ink">
          Login code
        </label>
        <input
          id="code"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          className={`${inputCls} text-center text-2xl font-bold tracking-[0.5em]`}
        />
      </div>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <button
        disabled={busy || code.length !== 6}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
      >
        {busy ? "Checking…" : "Sign in"}
      </button>
      <button
        type="button"
        onClick={() => {
          setStep("email");
          setCode("");
          setError("");
        }}
        className="w-full text-center text-xs font-semibold text-ink-soft hover:text-accent"
      >
        Different email / resend code
      </button>
    </form>
  );
}
