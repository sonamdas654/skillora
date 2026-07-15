"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type State = { loggedIn: boolean; role: "client" | "admin" | null };

export default function AuthNavLink({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<State>({ loggedIn: false, role: null });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (!data.user) {
        setState({ loggedIn: false, role: null });
        setLoaded(true);
        return;
      }
      const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", data.user.id).maybeSingle();
      if (!active) return;
      setState({ loggedIn: true, role: (profile?.role as "client" | "admin") ?? "client" });
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (!loaded) return null;

  const dashboardHref = state.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
  const dashboardLabel = state.role === "admin" ? "Admin Dashboard" : "Dashboard";

  const linkCls =
    variant === "desktop"
      ? "rounded-full px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-accent"
      : "mt-1 rounded-xl border border-line px-4 py-3 text-center text-base font-semibold text-ink hover:border-accent hover:text-accent";

  if (!state.loggedIn) {
    return (
      <Link href="/login" className={linkCls}>
        Login
      </Link>
    );
  }

  return (
    <div className={variant === "desktop" ? "flex items-center gap-1" : "mt-1 flex flex-col gap-1"}>
      <Link href={dashboardHref} className={linkCls}>
        {dashboardLabel}
      </Link>
      <button onClick={signOut} className={linkCls}>
        Logout
      </button>
    </div>
  );
}
