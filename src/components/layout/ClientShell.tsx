"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import LogoIntro from "@/components/sections/LogoIntro";
import ParticleField from "@/components/ui/ParticleField";
import DiceField from "@/components/ui/DiceField";
import FloatingPlatformBar from "@/components/ui/FloatingPlatformBar";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LogoIntro />
      <ParticleField />
      <DiceField />
      {children}
      <FloatingPlatformBar />
      <ThemeToggle />
    </ThemeProvider>
  );
}
