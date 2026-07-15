import { redirect } from "next/navigation";

export default function AdminTicketsRedirect() {
  redirect("/admin/dashboard/projects");
}
