"use client";

import { useEffect, useRef } from "react";

// Interactive hero backdrop:
//  1. A flowing color field — large soft gradient blobs drifting on sine
//     paths behind a heavy blur (Stripe-style "living gradient").
//  2. A particle constellation that links nearby dots and gently follows
//     the cursor.
// Pure canvas, no dependencies; disabled for reduced-motion users.

const BLOBS = [
  { color: "40,87,255", alpha: 0.5, radius: 0.42, ax: 0.34, ay: 0.26, sx: 0.11, sy: 0.09, phase: 0.0 },
  { color: "139,92,246", alpha: 0.42, radius: 0.38, ax: 0.3, ay: 0.3, sx: 0.08, sy: 0.13, phase: 2.1 },
  { color: "16,185,129", alpha: 0.34, radius: 0.34, ax: 0.36, ay: 0.24, sx: 0.13, sy: 0.07, phase: 4.2 },
  { color: "56,189,248", alpha: 0.36, radius: 0.3, ax: 0.28, ay: 0.32, sx: 0.06, sy: 0.11, phase: 1.2 },
];

export default function HeroMotion() {
  const flowRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const flow = flowRef.current;
    const dots = dotsRef.current;
    if (!flow || !dots) return;
    const fctx = flow.getContext("2d");
    const dctx = dots.getContext("2d");
    if (!fctx || !dctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Coarse pointer = phone/tablet: lower resolution + half-rate flow field
    // so the hero doesn't drain battery on mobile GPUs.
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 2);
    const COLORS = ["40,87,255", "139,92,246", "16,185,129"];
    const LINK_DIST = 130;
    const FLOW_SCALE = 0.14; // flow field renders tiny, blur hides it
    const mouse = { x: -9999, y: -9999 };

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let fw = 0;
    let fh = 0;
    let raf = 0;

    const resize = () => {
      const rect = dots.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dots.width = w * DPR;
      dots.height = h * DPR;
      dctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      fw = Math.max(2, Math.floor(w * FLOW_SCALE));
      fh = Math.max(2, Math.floor(h * FLOW_SCALE));
      flow.width = fw;
      flow.height = fh;
      const count = Math.min(90, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 2.2,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const drawFlow = (t: number) => {
      fctx.clearRect(0, 0, fw, fh);
      for (const b of BLOBS) {
        const cx = fw * (0.5 + b.ax * Math.sin(t * b.sx + b.phase));
        const cy = fh * (0.5 + b.ay * Math.cos(t * b.sy + b.phase * 1.4));
        const r = Math.max(fw, fh) * b.radius;
        const g = fctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.color},${b.alpha})`);
        g.addColorStop(1, `rgba(${b.color},0)`);
        fctx.fillStyle = g;
        fctx.fillRect(0, 0, fw, fh);
      }
    };

    let frame = 0;
    const step = () => {
      const t = performance.now() / 1000;
      // On mobile the blurred flow field only needs ~30fps to look identical.
      frame++;
      if (!isCoarse || frame % 2 === 0) drawFlow(t);

      dctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        if (dx * dx + dy * dy < 160 * 160) {
          p.vx += dx * 0.00002;
          p.vy += dy * 0.00002;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const o = (1 - Math.sqrt(d2) / LINK_DIST) * 0.15;
            dctx.strokeStyle = `rgba(40,87,255,${o})`;
            dctx.lineWidth = 1;
            dctx.beginPath();
            dctx.moveTo(a.x, a.y);
            dctx.lineTo(b.x, b.y);
            dctx.stroke();
          }
        }
      }
      for (const p of particles) {
        dctx.fillStyle = `rgba(${p.c},0.55)`;
        dctx.beginPath();
        dctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        dctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const rect = dots.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();

    // Only animate while the hero is actually on screen — once the user
    // scrolls past it, the rAF loop stops entirely.
    let running = false;
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(dots.parentElement!);

    window.addEventListener("resize", resize);
    if (!isCoarse) {
      window.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
    }
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <canvas
        ref={flowRef}
        className="absolute inset-0 h-full w-full opacity-60 saturate-[1.15]"
        style={{ filter: "blur(48px)", transform: "scale(1.15)" }}
      />
      <canvas ref={dotsRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
