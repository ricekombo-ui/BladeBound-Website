"use client";

import { useEffect, useState } from "react";

/**
 * Reads the Hope/Fear dice result from sessionStorage and applies
 * a subtle ambient gradient overlay to shift page warmth.
 * Hope = warmer ember tones, Fear = cooler shadow/plum tones.
 */
export default function AmbientTheme() {
  const [result, setResult] = useState<"hope" | "fear" | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bb_result");
      if (stored === "hope" || stored === "fear") {
        setResult(stored);
      }
    } catch {
      // sessionStorage unavailable
    }

    // Listen for storage changes (in case dice is re-rolled)
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem("bb_result");
        if (stored === "hope" || stored === "fear") {
          setResult(stored);
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  if (!result) return null;

  const gradient =
    result === "hope"
      ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(213,96,71,0.04) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(206,114,103,0.03) 0%, transparent 60%)"
      : "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(105,53,76,0.05) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 20% 100%, rgba(68,56,89,0.04) 0%, transparent 60%)";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-1000"
      style={{ background: gradient }}
      aria-hidden="true"
    />
  );
}
