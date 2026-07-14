"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }
  return (
    <button
      onClick={signOut}
      className={
        className ??
        "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
      }
    >
      Sign out
    </button>
  );
}
