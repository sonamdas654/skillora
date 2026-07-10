import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/clientAuth";
import { maintenancePlans } from "@/lib/maintenancePlans";
import ClientPortalShell from "@/components/client/ClientPortalShell";
import MaintenanceRequest from "@/components/client/MaintenanceRequest";

export const metadata: Metadata = {
  title: "Maintenance Plans",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function ClientMaintenancePage() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  return (
    <ClientPortalShell email={session.email}>
      <h1 className="text-2xl font-bold text-ink">Maintenance plans</h1>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-ink-soft">
        Keep your project healthy after delivery — updates, backups and fixes, monthly. Request a
        plan and we&apos;ll confirm the scope before anything is billed. Third-party costs
        (hosting, domain, APIs) stay separate.
      </p>
      <div className="mt-8">
        <MaintenanceRequest plans={maintenancePlans} />
      </div>
    </ClientPortalShell>
  );
}
