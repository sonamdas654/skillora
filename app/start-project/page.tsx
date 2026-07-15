import { redirect } from "next/navigation";

// The Start-Project flow now lives at /get-started (unified auth + portal).
// Keep this route alive as a redirect so existing links, bookmarks and
// search-indexed URLs still land the visitor in the right place.
export default async function StartProjectRedirect({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  redirect(service ? `/get-started?service=${encodeURIComponent(service)}` : "/get-started");
}
