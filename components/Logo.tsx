import Link from "next/link";
import Image from "next/image";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex flex-col items-start justify-center group" aria-label="Skilloura home">
      <div className="flex items-center gap-1 font-extrabold text-2xl tracking-tight leading-none">
        <span className={light ? "text-white" : "text-ink"}>Skill</span>

        {/* Official Skilloura mark */}
        <Image
          src="/logo-mark.png"
          alt=""
          width={64}
          height={64}
          priority
          className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px] inline-block transition-transform duration-500 group-hover:rotate-[20deg]"
        />

        <span className={light ? "text-white" : "text-ink"}>ura</span>
        <span className="text-accent animate-pulse">.</span>
      </div>
      
      {/* Dynamic Sub-tagline */}
      <span 
        className={`text-[8px] sm:text-[9px] font-bold tracking-[0.16em] uppercase mt-1 transition-colors ${
          light ? "text-white/60" : "text-ink-soft group-hover:text-accent"
        }`}
      >
        ALL DIGITAL SOLUTIONS
      </span>
    </Link>
  );
}

