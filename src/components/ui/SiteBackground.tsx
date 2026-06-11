"use client";

/**
 * Site-wide atmospheric background — fills the large empty void areas
 * with slow-drifting nebula glows, film grain, and a soft vignette.
 * Pure CSS (no canvas, no rAF) — sits beneath ParticleField/DiceField,
 * which provide the small-scale detail.
 */

const NOISE_SVG =
  "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')";

export default function SiteBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Nebula glows — large, blurred, slowly drifting */}
      <div
        className="bb-orb absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(213,96,71,0.07) 0%, transparent 65%)",
          animationDuration: "46s",
        }}
      />
      <div
        className="bb-orb absolute top-[30%] -right-[15%] w-[60vw] h-[60vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(105,53,76,0.09) 0%, transparent 65%)",
          animationDuration: "58s",
          animationDelay: "-18s",
        }}
      />
      <div
        className="bb-orb absolute -bottom-[20%] left-[15%] w-[50vw] h-[50vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(68,56,89,0.12) 0%, transparent 65%)",
          animationDuration: "52s",
          animationDelay: "-35s",
        }}
      />
      <div
        className="bb-orb absolute top-[55%] left-[40%] w-[35vw] h-[35vw] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(145,64,73,0.06) 0%, transparent 65%)",
          animationDuration: "40s",
          animationDelay: "-9s",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: NOISE_SVG }}
      />

      {/* Vignette — darkened corners pull focus to the content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 50% 45%, transparent 55%, rgba(3,1,10,0.5) 100%)",
        }}
      />

      <style>{`
        .bb-orb {
          animation-name: bb-orb-drift;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @keyframes bb-orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25%      { transform: translate(4vw, -3vh) scale(1.08); }
          50%      { transform: translate(-2vw, 4vh) scale(0.95); }
          75%      { transform: translate(-4vw, -2vh) scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bb-orb { animation: none; }
        }
      `}</style>
    </div>
  );
}
