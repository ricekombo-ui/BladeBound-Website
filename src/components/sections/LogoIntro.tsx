"use client";

import { useState, useEffect } from "react";

export default function LogoIntro() {
  const [phase, setPhase] = useState<"logo" | "fade" | "done">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 1400);
    const t2 = setTimeout(() => setPhase("done"), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-void transition-opacity duration-500 ${
        phase === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Glow ring */}
      <div className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full animate-ping-slow opacity-20 border border-ember/40" />
      <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-ember/5 blur-3xl animate-pulse" />

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-4 animate-intro-scale">
        <img
          src="/logo.png"
          alt="BladeBound"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-2xl shadow-ember/30 ring-2 ring-ember/30"
        />
        <span className="font-serif text-2xl md:text-3xl text-bone tracking-widest uppercase opacity-0 animate-intro-text">
          BladeBound
        </span>
      </div>
    </div>
  );
}
