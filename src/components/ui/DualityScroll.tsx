"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage scroll narrative layer.
 *
 * Whichever verdict the visitor rolled on the lander (Hope or Fear),
 * the page opens saturated in that domain. As they scroll toward the
 * footer, the opposite force gradually rises — the duality lives in
 * the page itself. A parallax ember field drifts upward, its hue
 * crossing from one domain to the other along the same journey.
 */

const HOPE = { r: 213, g: 96, b: 71 };   // ember
const FEAR = { r: 115, g: 78, b: 175 };  // veiled violet

interface Particle {
  x: number;       // 0..1 viewport fraction
  y: number;       // 0..1 viewport fraction
  depth: number;   // 0.25 (far) .. 1 (near) — drives size, speed, parallax
  drift: number;   // upward speed
  sway: number;    // horizontal sine phase
  swayAmp: number;
  alpha: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function DualityScroll() {
  const [start, setStart] = useState<"hope" | "fear">("hope");
  const [reduced, setReduced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hopeLayer = useRef<HTMLDivElement>(null);
  const fearLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bb_result");
      if (stored === "fear") setStart("fear");
    } catch {}
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    resize();
    window.addEventListener("resize", resize);

    // ── Ember field ─────────────────────────────────────────────────
    const COUNT = w < 768 ? 28 : 54;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      depth: 0.25 + Math.random() * 0.75,
      drift: 0.00012 + Math.random() * 0.00028,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 0.004 + Math.random() * 0.01,
      alpha: 0.25 + Math.random() * 0.45,
    }));

    let lastScroll = window.scrollY;
    let raf = 0;

    function frame(now: number) {
      if (!canvas || !ctx) return;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

      // Cross-fade the two gradient layers with scroll
      const from = start === "hope" ? 1 - progress : progress;
      if (hopeLayer.current) hopeLayer.current.style.opacity = String(from);
      if (fearLayer.current) fearLayer.current.style.opacity = String(1 - from);

      // Hue travels the same arc as the gradients
      const cFrom = start === "hope" ? HOPE : FEAR;
      const cTo = start === "hope" ? FEAR : HOPE;
      const r = lerp(cFrom.r, cTo.r, progress);
      const g = lerp(cFrom.g, cTo.g, progress);
      const b = lerp(cFrom.b, cTo.b, progress);

      // Parallax: embers slide opposite to scroll, deeper = slower
      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const t = now * 0.001;
      for (const p of particles) {
        p.y -= p.drift * p.depth * 16;                 // constant upward drift
        p.y -= (scrollDelta / h) * (1 - p.depth) * 0.5; // parallax kick
        const sx = Math.sin(t * 0.6 + p.sway) * p.swayAmp;

        // wrap vertically
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        if (p.y > 1.08) { p.y = -0.04; p.x = Math.random(); }

        const px = (p.x + sx) * w;
        const py = p.y * h;
        const size = p.depth * 2.4;
        const flicker = 0.75 + Math.sin(t * 2.2 + p.sway * 3) * 0.25;
        const a = p.alpha * p.depth * flicker * 0.55;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, size * 3.5);
        grad.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${a})`);
        grad.addColorStop(1, `rgba(${r | 0},${g | 0},${b | 0},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, start]);

  // Domain gradients — stacked and cross-faded by scroll
  const hopeBg =
    "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(213,96,71,0.07) 0%, transparent 65%)," +
    "radial-gradient(ellipse 55% 40% at 85% 90%, rgba(213,96,71,0.04) 0%, transparent 60%)";
  const fearBg =
    "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(115,78,175,0.07) 0%, transparent 65%)," +
    "radial-gradient(ellipse 55% 40% at 15% 90%, rgba(105,53,76,0.06) 0%, transparent 60%)";

  return (
    <>
      <div
        ref={hopeLayer}
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: hopeBg, opacity: start === "hope" ? 1 : 0, transition: "opacity 150ms linear" }}
        aria-hidden="true"
      />
      <div
        ref={fearLayer}
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ background: fearBg, opacity: start === "fear" ? 1 : 0, transition: "opacity 150ms linear" }}
        aria-hidden="true"
      />
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
          aria-hidden="true"
        />
      )}
    </>
  );
}
