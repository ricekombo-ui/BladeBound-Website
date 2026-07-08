"use client";

import { ReactNode } from "react";
import DualityLanding from "@/components/sections/DualityLanding";
import ParticleField from "@/components/ui/ParticleField";
import DiceField from "@/components/ui/DiceField";
import FloatingPlatformBar from "@/components/ui/FloatingPlatformBar";
import AmbientTheme from "@/components/ui/AmbientTheme";
import SiteBackground from "@/components/ui/SiteBackground";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ember focus:text-void focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <DualityLanding />
      <SiteBackground />
      <ParticleField />
      <DiceField />
      <AmbientTheme />
      {children}
      <FloatingPlatformBar />
    </>
  );
}
