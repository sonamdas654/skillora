import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icons";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="relative w-full max-w-md text-center">
        <Link href="/" className="mb-6 inline-flex items-center justify-center gap-2">
          <Image src="/logo-mark.png" alt="Skilloura" width={40} height={40} className="size-9 object-contain" />
          <span className="text-title-1 font-black tracking-tight text-ink">Skilloura</span>
        </Link>

        <div className="rounded-panel border border-line bg-surface p-8 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.4)]">
          <span className="mx-auto grid size-14 place-items-center rounded-card bg-danger-soft text-danger">
            <Icon name="shield" className="size-7" />
          </span>
          <h1 className="mt-5 text-title-1 font-bold text-ink">You don&apos;t have access to this page</h1>
          <p className="mt-2 text-body-sm leading-6 text-ink-soft">
            Your account doesn&apos;t have permission to view this area. If you think this is a
            mistake, contact us.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/client/dashboard"
              className="rounded-full bg-brand px-5 py-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-deep"
            >
              Go to your dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full border border-line px-5 py-2.5 text-body-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Back to skilloura.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
