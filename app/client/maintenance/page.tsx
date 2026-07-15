import { redirect } from "next/navigation";

// The OTP-based client portal is retired — request a maintenance plan by
// starting a project from /client/dashboard instead.
export default function ClientMaintenanceRedirect() {
  redirect("/login?next=/client/dashboard");
}
