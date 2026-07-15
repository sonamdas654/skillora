"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type State = { loggedIn: boolean; role: "client" | "admin" | null };

// Footer login/account link — mirrors the header's AuthNavLink but styled
// like the other footer links. Shows "Client Login" to guests, and the
// right dashboard to a signed-in client/admin.
export default function FooterAuthLink() {
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

  const cls =
    "group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-accent";
  const inner = (label: string) => (
    <>
      <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" aria-hidden />
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">{label}</span>
    </>
  );

  // Before we know the session, show the guest link so the footer never
  // looks empty (SSR-safe default).
  if (!loaded || !state.loggedIn) {
    return (
      <Link href="/login" className={cls}>
        {inner("Client Login")}
      </Link>
    );
  }

  if (state.role === "admin") {
    return (
      <Link href="/admin/dashboard" className={cls}>
        {inner("Admin Dashboard")}
      </Link>
    );
  }

  return (
    <Link href="/client/dashboard" className={cls}>
      {inner("My Dashboard")}
    </Link>
  );
}
