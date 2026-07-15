import { redirect } from "next/navigation";

// The OTP-based client portal is retired — support/tickets now live inside
// a project's Messages tab at /client/dashboard.
export default function ClientSupportRedirect() {
  redirect("/login?next=/client/dashboard");
}
