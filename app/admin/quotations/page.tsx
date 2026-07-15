import { redirect } from "next/navigation";

export default function AdminQuotationsRedirect() {
  redirect("/admin/dashboard/projects");
}
