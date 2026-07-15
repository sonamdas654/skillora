import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="grid min-h-screen place-items-center bg-grid px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-3xl border border-line bg-white p-8 shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)]">
          <h1 className="text-xl font-bold text-ink">Admin login</h1>
          <p className="mt-1 text-sm text-ink-soft">Content Studio — Blog, Portfolio &amp; Testimonials only.</p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
          <p className="mt-5 text-center text-xs text-ink-soft">
            Looking for leads, projects, quotes or payments?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Go to Business OS login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
