"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-red-300 hover:text-red-500 transition-colors"
    >
      Logout
    </button>
  );
}
