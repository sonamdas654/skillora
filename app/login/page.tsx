"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

function destForRole(role: string | undefined, next: string | null) {
  if (role === "admin") return "/admin/dashboard";
  if (next && next.startsWith("/client/dashboard")) return next;
  return "/client/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const supabase = createClient();
    const next =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : null;

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setBusy(false);
          return;
        }

        // Every public signup creates a client account — admin accounts are
        // provisioned separately and never created through this form.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: "client", full_name: name, whatsapp } },
        });
        if (error) throw error;

        // Supabase returns a user with an empty `identities` array (no error,
        // to avoid leaking which emails exist) when the email is already
        // registered and confirmed. Treat that as "please sign in".
        if (data.user && (data.user.identities?.length ?? 0) === 0) {
          setError("An account with this email already exists. Please sign in instead.");
          setMode("signin");
          setBusy(false);
          return;
        }

        // If email confirmation is required, there's no session yet.
        if (!data.session) {
          setNotice("Account created. Please check your email to confirm, then sign in.");
          setMode("signin");
          setBusy(false);
          return;
        }
        router.replace(destForRole("client", next));
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const role = (data.user?.user_metadata?.role as string) || "client";
      router.replace(destForRole(role, next));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/logo-mark.png" alt="Skilloura" width={40} height={40} className="size-9 object-contain" />
          <span className="text-xl font-black tracking-tight text-ink">Skilloura</span>
        </Link>

        <div className="rounded-3xl border border-line bg-white p-7 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)] sm:p-8">
          <h1 className="text-2xl font-bold text-ink">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {mode === "signin"
              ? "Sign in to your Skilloura account."
              : "Sign up to track your projects, quotes and files."}
          </p>

          {notice && (
            <div className="mt-4 rounded-xl border border-mint/25 bg-mint/10 px-4 py-3 text-sm font-medium text-ink">
              {notice}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">Full name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">WhatsApp number</label>
                  <input
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="At least 6 characters"
              />
            </div>
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">Confirm password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="Re-enter your password"
                />
              </div>
            )}
            {mode === "signin" && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs font-semibold text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-soft">
            {mode === "signin" ? "New to Skilloura?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setNotice("");
              }}
              className="font-semibold text-accent hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-ink-soft">
          <Link href="/" className="hover:text-accent">← Back to skilloura.com</Link>
        </p>
      </div>
    </div>
  );
}
