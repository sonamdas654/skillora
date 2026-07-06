"use client";

import { useEffect, useState } from "react";

export default function Hero3D() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already present
    const existingScript = document.querySelector('script[src*="spline-viewer"]');
    if (existingScript) {
      setLoaded(true);
      return;
    }

    // Load the official Spline Viewer web component script from CDN
    // This runs completely in the browser DOM and avoids bundler-related decoding issues
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js";
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(true); // Fallback to try rendering anyway
    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none" aria-hidden>
      {/* Subtle blue/indigo radial glow under the Spline canvas */}
      <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent blur-3xl pointer-events-none" />
      
      {!loaded ? (
        <Hero3DPlaceholder />
      ) : (
        <div 
          className="h-full w-full transition-opacity duration-700 ease-in-out"
          dangerouslySetInnerHTML={{
            __html: '<spline-viewer url="https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode" style="width: 100%; height: 100%; display: block;"></spline-viewer>'
          }}
        />
      )}
    </div>
  );
}

// Sleek loading animation themed around the orbital 'o' portal design
function Hero3DPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Triple pulsing concentric glow rings */}
        <div className="absolute size-44 animate-pulse rounded-full border border-accent/20 opacity-25" />
        <div className="absolute size-32 animate-[spin_8s_linear_infinite] rounded-full border-2 border-dashed border-accent/30" />
        <div className="absolute size-20 animate-[spin_4s_linear_infinite] rounded-full border-t-2 border-r-2 border-indigo-500/80" />
        <div className="absolute size-12 animate-[spin_2s_linear_infinite] rounded-full border-b-2 border-l-2 border-mint" />
        
        {/* Core pulsing portal node */}
        <div className="size-6 rounded-full bg-gradient-to-tr from-accent to-mint shadow-[0_0_15px_rgba(40,87,255,0.4)] animate-pulse" />
      </div>
    </div>
  );
}

