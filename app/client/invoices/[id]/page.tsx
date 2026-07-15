import { redirect } from "next/navigation";

// The OTP-based client portal is retired — everything now lives at
// /client/dashboard (Supabase-authenticated).
export default function ClientInvoiceRedirect() {
  redirect("/login?next=/client/dashboard");
}
