import { redirect } from "next/navigation";
import { createClient } from "./server";

// Use at the top of any page that shows sensitive data (projects, quotes,
// payments, files, messages) once those pages are built. Requires a signed-in
// AND email-confirmed client; otherwise redirects appropriately.
export async function requireVerifiedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!user.email_confirmed_at) redirect("/client/dashboard?verify=1");
  return user;
}
