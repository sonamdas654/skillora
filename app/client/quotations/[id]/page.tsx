import { redirect } from "next/navigation";

// The OTP-based client portal is retired — everything now lives at
// /client/dashboard (Supabase-authenticated).
export default function ClientQuotationRedirect() {
  redirect("/login?next=/client/dashboard");
}
