"use client";

import { useRef, useCallback } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Feature {
  icon: string;
  title: string;
  body: string;
}

// ── Thin-line sigil icons (keyed by name, emoji keys kept for back-compat) ──
const ICONS: Record<string, React.ReactNode> = {
  blade: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M19 21l2-2" />
    </svg>
  ),
  film: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20M2 15h20M7 4v16M17 4v16" />
    </svg>
  ),
  dice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2l8.5 6.2-3.2 10.3H6.7L3.5 8.2 12 2z" />
      <path d="M12 2v7.5M3.5 8.2l8.5 1.3 8.5-1.3M6.7 18.5l5.3-9 5.3 9" />
    </svg>
  ),
  hall: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 21h18M4 21V8l8-5 8 5v13" />
      <path d="M8 21v-6h8v6M12 8v3" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20V2H6.5A2.5 2.5 0 004 4.5v15z" />
      <path d="M4 19.5A2.5 2.5 0 006.5 22H20v-5" />
      <path d="M9 7h7M9 11h5" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 22c4.4 0 7-2.8 7-6.5 0-4-3.5-6.5-5-9.5-.4 2-1.5 3-2.5 3.5C10 7 9.5 4.5 10 2 6.5 4.5 5 8.5 5 12.5 5 19.2 7.6 22 12 22z" />
      <path d="M12 22c-1.8 0-3-1.4-3-3.2 0-2 1.6-3 3-5.3 1.4 2.3 3 3.3 3 5.3 0 1.8-1.2 3.2-3 3.2z" />
    </svg>
  ),
};

// Back-compat: map the original emoji to sigil keys
const EMOJI_MAP: Record<string, string> = {
  "⚔": "blade", "🎬": "film", "🎲": "dice", "🏛": "hall", "📖": "book", "🔥": "flame",
};

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
          <div className="text-ember mb-3 w-10 h-10 flex items-center justify-center rounded border border-ember/20 group-hover:border-ember/40 group-hover:shadow-[0_0_12px_rgba(213,96,71,0.2)] transition-all duration-300 group-hover:scale-110 origin-center">
            {ICONS[EMOJI_MAP[f.icon] ?? f.icon] ?? f.icon}
          </div>
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
