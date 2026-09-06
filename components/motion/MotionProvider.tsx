"use client";

import { useEffect } from "react";
import { startRevealRegistry, disableReveals } from "@/lib/motion/revealRegistry";
import { resolveMotionTier } from "@/lib/motion/useMotionTier";

/**
 * Installs the shared reveal observer.
 *
 * The `data-motion="on"` attribute that actually hides pending reveals is set
 * by MotionBootScript below, which runs before first paint — otherwise
 * anything already scrolled past would flash in, then out, then animate.
 *
 * Mount this once, high in the tree. It is deliberately render-free.
 */
export default function MotionProvider() {
  useEffect(() => {
    if (resolveMotionTier() === "off") {
      disableReveals();
      return;
    }
    return startRevealRegistry();
  }, []);

  return null;
}

/**
 * Runs synchronously in the document, before paint.
 *
 * Sets data-motion="on" only when the visitor has not asked for reduced
 * motion, and arms a failsafe that clears it if hydration never happens. If
 * JavaScript is off entirely this never runs, data-motion is never set, and
 * every reveal renders in its final visible state — which is exactly what we
 * want, and what the previous framer-motion version got wrong.
 */
export function MotionBootScript() {
  const script = `(function(){try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var d=document.documentElement;d.setAttribute('data-motion','on');
setTimeout(function(){
  var pending=document.querySelectorAll('[data-reveal]:not([data-reveal-done])');
  for(var i=0;i<pending.length;i++)pending[i].setAttribute('data-reveal-done','');
},3500);
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
