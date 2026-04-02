"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export default function Hero() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Delay entrance until after logo intro clears
    const timer = setTimeout(() => setEntered(true), 2900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Layered cinematic background */}
      <div className="absolute inset-0">
        {/* Base void */}
        <div className="absolute inset-0 bg-void" />
        {/* Gradient atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-void via-shadow/20 to-plum/10 opacity-80" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/80" />
        {/* Ember glow orbs - spatial depth */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-ember/4 blur-[100px] animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/5 w-[500px] h-[500px] rounded-full bg-crimson/5 blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-2/3 left-1/6 w-[400px] h-[400px] rounded-full bg-plum/8 blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "4s" }} />
        {/* Film grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.5%22/%3E%3C/svg%3E')" }} />
        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="max-w-3xl">
          {/* Label */}
          <span
            className="inline-block text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0ms",
            }}
          >
            Daggerheart Content &middot; Community &middot; Play
          </span>

          {/* Headline */}
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-[5.5rem] text-bone leading-[1.05] mb-6"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 200ms",
            }}
          >
            Where the Story
            <br />
            <span className="text-gradient">Takes the Lead</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-stone text-lg md:text-xl leading-relaxed max-w-xl mb-12"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(25px)",
              transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 450ms",
            }}
          >
            BladeBound is a home for narrative-first Daggerheart play, system education, and cinematic tabletop storytelling. Built for players who care about craft.
          </p>

          {/* CTAs - staggered */}
          <div
            className="flex flex-wrap gap-4 mb-4"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(20px)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 700ms",
            }}
          >
            <Button href={LINKS.youtube} variant="primary" size="lg" external>
              Watch on YouTube
            </Button>
            <Button href={LINKS.discord} variant="secondary" size="lg" external>
              Join the Discord
            </Button>
            <Button href={LINKS.patreon} variant="secondary" size="lg" external>
              Support on Patreon
            </Button>
          </div>

          <div
            style={{
              opacity: entered ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 900ms",
            }}
          >
            <Button href="/play" variant="ghost" size="md">
              Play in a Game &rarr;
            </Button>
          </div>

          {/* Proof line */}
          <div
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/5"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "translateY(15px)",
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1100ms",
            }}
          >
            {[
              { stat: "200+", label: "Games Run" },
              { stat: "Active", label: "Discord Community" },
              { stat: "Daggerheart", label: "Focused Content" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="text-ember font-semibold text-base">{item.stat}</span>
                <span className="text-stone/70 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
