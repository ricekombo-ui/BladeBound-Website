"use client";

import { useRef, useCallback } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Feature {
  icon: string;
  title: string;
  body: string;
}

interface FeatureCardsProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

function FeatureCard({ f, i }: { f: Feature; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.emberBurst) {
      const r = e.currentTarget.getBoundingClientRect();
      window.emberBurst(r.left + r.width / 2, r.top + r.height / 2, 8);
    }
  }, []);

  return (
    <ScrollReveal key={f.title} delay={i * 80} direction="up">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        className="group relative bg-shadow/20 border border-white/[0.06] rounded-lg p-6 hover:border-ember/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-ember/5 h-full overflow-hidden"
      >
        {/* Cursor-tracking radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
          style={{
            background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(213,96,71,0.08), transparent 60%)",
          }}
        />
        {/* Shimmer sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-out"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(213,96,71,0.06), transparent)",
          }}
        />
        <div className="relative">
          <div className="text-2xl mb-3 w-10 h-10 flex items-center justify-center rounded border border-ember/20 group-hover:border-ember/40 group-hover:shadow-[0_0_12px_rgba(213,96,71,0.2)] transition-all duration-300 group-hover:scale-110 origin-center">{f.icon}</div>
          <h3 className="font-serif text-lg text-bone mb-2 group-hover:text-ember transition-colors duration-300">{f.title}</h3>
          <p className="text-stone text-sm leading-relaxed">{f.body}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function FeatureCards({ features, columns = 3 }: FeatureCardsProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {features.map((f, i) => (
        <FeatureCard key={f.title} f={f} i={i} />
      ))}
    </div>
  );
}
