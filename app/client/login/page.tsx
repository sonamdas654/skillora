import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import ClientLoginForm from "@/components/client/ClientLoginForm";
import { getClientSession } from "@/lib/clientAuth";

export const metadata: Metadata = {
  title: "Client Login",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function ClientLoginPage() {
  const session = await getClientSession();
  if (session) redirect("/client");

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-3xl border border-line bg-white p-8 shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)]">
          <h1 className="text-xl font-bold text-ink">Client portal</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Track your project, quotations, invoices and payments.
          </p>
          <div className="mt-6">
            <ClientLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
