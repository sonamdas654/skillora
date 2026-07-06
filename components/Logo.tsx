import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex flex-col items-start justify-center group" aria-label="Skillora home">
      <div className="flex items-center gap-1 font-extrabold text-2xl tracking-tight leading-none">
        <span className={light ? "text-white" : "text-ink"}>Skill</span>
        
        {/* Custom SVG portal 'o' representing integrated digital solutions */}
        <svg 
          viewBox="0 0 100 100" 
          className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px] inline-block animate-[spin_24s_linear_infinite] group-hover:animate-[spin_12s_linear_infinite] transition-all"
          fill="none" 
          aria-hidden
        >
          <defs>
            <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2857ff" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          
          {/* Subtle concentric background loop */}
          <circle cx="50" cy="50" r="40" stroke="url(#portalGrad)" strokeWidth="6" opacity="0.12" />
          <circle cx="50" cy="50" r="28" stroke="url(#portalGrad)" strokeWidth="5" opacity="0.08" />

          {/* Spiral/orbital paths */}
          <path 
            d="M50 10 A 40 40 0 1 1 18 26" 
            stroke="#2857ff" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />
          <path 
            d="M50 22 A 28 28 0 1 1 28 38" 
            stroke="#8b5cf6" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />
          <path 
            d="M50 34 A 16 16 0 1 1 38 50" 
            stroke="#10b981" 
            strokeWidth="7" 
            strokeLinecap="round" 
          />
          
          {/* Glowing colorful nodes (Solutions) */}
          <circle cx="50" cy="10" r="8" fill="#2857ff" className="shadow-sm" />
          <circle cx="90" cy="50" r="8" fill="#8b5cf6" />
          <circle cx="50" cy="90" r="8" fill="#10b981" />
          <circle cx="18" cy="26" r="8" fill="#f59e0b" />
        </svg>
        
        <span className={light ? "text-white" : "text-ink"}>ra</span>
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

