import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renamed the `middleware` convention to `proxy`.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Parallel-safe: only the NEW Supabase dashboards are guarded here. The
// existing live portal (/client/login, /client, /admin, /admin/login, …) and
// all public pages are intentionally NOT matched, so nothing changes for them.
export const config = {
  matcher: ["/client/dashboard/:path*", "/admin/dashboard/:path*", "/login"],
};
