"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <HeroFallback pulse />,
});

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static illustration shown while loading or when WebGL is unavailable. */
function HeroFallback({ pulse = false }: { pulse?: boolean }) {
  return (
    <div className="relative h-full w-full" aria-hidden>
      <div
        className={`absolute left-1/2 top-1/2 size-64 sm:size-80 -translate-x-1/2 -translate-y-1/2 rounded-[45%_55%_52%_48%/48%_45%_55%_52%] bg-gradient-to-br from-accent to-accent-deep shadow-[0_40px_90px_-30px_rgba(40,87,255,0.55)] ${
        pulse ? "animate-pulse" : "animate-float"
        }`}
      />
      <div className="absolute left-[12%] top-[16%] size-16 rounded-full border-8 border-mint animate-float" style={{ animationDelay: "0.8s" }} />
      <div className="absolute right-[14%] bottom-[20%] size-12 rotate-12 rounded-xl bg-[#7c9bff] animate-float" style={{ animationDelay: "1.6s" }} />
      <div className="absolute right-[20%] top-[12%] size-8 rotate-45 rounded-lg bg-[#ffb454] animate-float" style={{ animationDelay: "2.2s" }} />
    </div>
  );
}

export default function Hero3DLoader() {
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  if (webgl === null) return <HeroFallback pulse />;
  if (!webgl) return <HeroFallback />;
  return <Hero3D />;
}
