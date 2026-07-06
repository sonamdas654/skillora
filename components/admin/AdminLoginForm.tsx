"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Login failed");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="a-email" className="mb-1.5 block text-sm font-semibold text-ink">
          Email
        </label>
        <input id="a-email" name="email" type="email" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="a-pass" className="mb-1.5 block text-sm font-semibold text-ink">
          Password
        </label>
        <input id="a-pass" name="password" type="password" required className={inputCls} />
      </div>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep transition-colors disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
