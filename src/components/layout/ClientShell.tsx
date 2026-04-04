"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import DualityLanding from "@/components/sections/DualityLanding";
import ParticleField from "@/components/ui/ParticleField";
import DiceField from "@/components/ui/DiceField";
import FloatingPlatformBar from "@/components/ui/FloatingPlatformBar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AmbientTheme from "@/components/ui/AmbientTheme";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DualityLanding />
      <ParticleField />
      <DiceField />
      <AmbientTheme />
      {children}
      <FloatingPlatformBar />
      <ThemeToggle />
    </ThemeProvider>
  );
}
