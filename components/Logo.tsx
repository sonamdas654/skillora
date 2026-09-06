import Link from "next/link";
import Image from "next/image";

// The mark + "Skilloura" wordmark come straight from the original artwork
// (public/logo-core.png). The "SMART DIGITAL SERVICES" tagline and gradient
// underline are re-rendered as real text/CSS below it — inside the bitmap
// they become unreadably small at header sizes; here they stay crisp at
// any size.
//
// The underline used to repeat the artwork's blue/violet ramp, which fights
// the petrol + aura palette. It now runs brand -> aura, so the lockup reads
// as part of the site even though the mark itself is still the original
// blue artwork.
export default function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const img = size === "lg" ? "h-16 sm:h-20" : "h-12 sm:h-14";
  const tagline =
    size === "lg" ? "text-[10px] sm:text-[11px]" : "text-[8px] sm:text-[9px]";
  const line = size === "lg" ? "h-[4px]" : "h-[3px]";

  return (
    <Link
      href="/"
      className="inline-flex flex-col items-center group"
      aria-label="Skilloura — Smart Digital Services"
    >
      <span className="sr-only">Skilloura</span>
      <Image
        src="/logo-core.png"
        alt="Skilloura logo"
        width={903}
        height={560}
        priority
        sizes={size === "lg" ? "160px" : "120px"}
        className={`${img} w-auto transition-transform duration-300 group-hover:scale-[1.03]`}
      />
      <span
        className={`${tagline} mt-1 font-bold uppercase tracking-[0.18em] text-ink-soft leading-none whitespace-nowrap`}
      >
        Smart Digital Services
      </span>
      <span
        className={`${line} mt-1.5 w-3/5 rounded-full`}
        style={{
          background:
            "linear-gradient(90deg, var(--color-brand) 0%, var(--color-aura-2) 55%, var(--color-aura-1) 100%)",
        }}
        aria-hidden
      />
    </Link>
  );
}
