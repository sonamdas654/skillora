import { redirect } from "next/navigation";

// The Start-Project flow now lives at /get-started (unified auth + portal).
// Keep this route alive as a redirect so existing links, bookmarks and
// search-indexed URLs still land the visitor in the right place — forwarding
// the service + package selection so nothing is re-asked.
export default async function StartProjectRedirect({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; package?: string }>;
}) {
  const { service, package: pkg } = await searchParams;
  const qs = new URLSearchParams();
  if (service) qs.set("service", service);
  if (pkg) qs.set("package", pkg);
  const query = qs.toString();
  redirect(query ? `/get-started?${query}` : "/get-started");
}
