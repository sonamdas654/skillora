import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";
import { verifyReviewToken } from "@/lib/reviewToken";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Share Your Review",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await verifyReviewToken(token);
  let alreadyUsed = false;
  if (invite) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("review_token_used", { p_invite_token: invite.jti });
    alreadyUsed = Boolean(data);
  }

  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 pt-32 sm:pt-40 pb-24">
          {!invite ? (
            <div className="rounded-3xl border border-line bg-white p-8 sm:p-10 text-center shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)]">
              <h1 className="text-2xl font-bold text-ink">This review link is invalid or expired</h1>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Review links are personal and valid for 30 days. Please ask for a fresh link,
                or just send your feedback on WhatsApp — it means a lot either way.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep"
              >
                Go to homepage
              </Link>
            </div>
          ) : alreadyUsed ? (
            <div className="rounded-3xl border border-line bg-white p-8 sm:p-10 text-center shadow-[0_24px_60px_-30px_rgba(11,19,48,0.25)]">
              <h1 className="text-2xl font-bold text-ink">Thank you, {invite.clientName}!</h1>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                Your review was already received with this link. It will appear on the site
                once approved.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-deep"
              >
                Go to homepage
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Client Review
                </p>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                  How was your experience,{" "}
                  <span className="font-accent font-normal text-accent">{invite.clientName}?</span>
                </h1>
                <p className="mt-3 text-sm sm:text-base leading-6 text-ink-soft">
                  Your honest words take 2 minutes and help other businesses trust the work.
                </p>
              </div>
              <div className="mt-8">
                <ReviewForm
                  token={token}
                  clientName={invite.clientName}
                  clientBusiness={invite.clientBusiness}
                />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
