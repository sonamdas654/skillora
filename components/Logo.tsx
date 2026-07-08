import Link from "next/link";
import Image from "next/image";

// Renders the real Skilloura lockup artwork exactly as designed (mark on
// top, full "Skilloura" wordmark + tagline below) — never recreated with
// HTML text, so the name always stays fully legible.
export default function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  const heightClass = size === "lg" ? "h-20 sm:h-24" : "h-16 sm:h-[72px]";
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Skilloura home">
      <Image
        src="/logo-full.png"
        alt="Skilloura — All Digital Solutions"
        width={911}
        height={711}
        priority
        className={`${heightClass} w-auto transition-transform duration-300 hover:scale-[1.03]`}
      />
    </Link>
  );
}
