import { redirect } from "next/navigation";

// Business-ops moved to the new Business OS — send straight there (no old
// login gate) so this never becomes a double-login step.
export default function AdminRootRedirect() {
  redirect("/admin/dashboard");
}
