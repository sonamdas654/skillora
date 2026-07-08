import Link from "next/link";
import Image from "next/image";

// The mark + "Skilloura" wordmark come straight from the original artwork
// (public/logo-core.png). The "ALL DIGITAL SOLUTIONS" tagline and gradient
// underline are re-rendered as real text/CSS below it — inside the bitmap
// they become unreadably small at header sizes; here they stay crisp at
// any size, using the exact colors sampled from the artwork.
export default function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const img = size === "lg" ? "h-16 sm:h-20" : "h-12 sm:h-14";
  const tagline =
    size === "lg" ? "text-[11px] sm:text-xs" : "text-[9px] sm:text-[10px]";
  const line = size === "lg" ? "h-[4px]" : "h-[3px]";

  return (
    <Link
      href="/"
      className="inline-flex flex-col items-center group"
      aria-label="Skilloura home"
    >
      <Image
        src="/logo-core.png"
        alt="Skilloura"
        width={903}
        height={560}
        priority
        className={`${img} w-auto transition-transform duration-300 group-hover:scale-[1.03]`}
      />
      <span
        className={`${tagline} mt-1 font-bold uppercase tracking-[0.22em] text-[#4a5a78] leading-none whitespace-nowrap`}
      >
        All Digital Solutions
      </span>
      <span
        className={`${line} mt-1.5 w-3/5 rounded-full`}
        style={{
          background:
            "linear-gradient(90deg, rgb(53,111,254) 0%, rgb(130,57,253) 50%, rgb(253,177,75) 100%)",
        }}
        aria-hidden
      />
    </Link>
  );
}
