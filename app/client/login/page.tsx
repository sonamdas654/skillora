import { redirect } from "next/navigation";

// The client portal now runs on unified Supabase auth at /login (with a
// real dashboard at /client/dashboard) — this OTP-based login is retired.
export default function ClientLoginRedirect() {
  redirect("/login?next=/client/dashboard");
}
