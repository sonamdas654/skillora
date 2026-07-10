"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/client/logout", { method: "POST" });
        router.push("/client/login");
        router.refresh();
      }}
      className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink-soft hover:border-accent hover:text-accent transition-colors"
    >
      Sign out
    </button>
  );
}
