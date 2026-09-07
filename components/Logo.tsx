import Link from "next/link";
import Image from "next/image";

// The mark + "Skilloura" wordmark come straight from the original artwork
// (public/logo-core.png). The "SMART DIGITAL SERVICES" tagline and gradient
// underline are re-rendered as real text/CSS below it — inside the bitmap
// they become unreadably small at header sizes; here they stay crisp at
// any size.
//
// The underline reproduces the ORIGINAL artwork's ramp, sampled straight out
// of public/logo-full.webp at its most saturated row: blue #476ed2, through
// violet #7442ff, into coral and amber #f0af69.
//
// It had been changed to run petrol -> aura, on the reasoning that the blue
// fought the site palette. The owner's instruction is to leave the logo
// alone, so it is back to the artwork's own colours. This is the right call
// regardless: the lockup is one thing, and having the CSS underline disagree
// with the printed logo would mean two different versions of the same mark.
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
        // Deliberately NOT priority.
        //
        // It was, which emitted a <link rel=preload> for a full srcset up to
        // 3840w — for a mark rendered at 120px in the header. On a 1.6 Mbps
        // connection that preload competes directly with the hero poster,
        // which IS the LCP element, and the homepage measured 3.44s LCP
        // against a 2.5s target. The header logo can arrive a moment late;
        // the hero cannot.
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
            "linear-gradient(90deg, #476ed2 0%, #515aff 20%, #7442ff 40%, #9042e9 55%, #d78b81 85%, #f0af69 100%)",
        }}
        aria-hidden
      />
    </Link>
  );
}
