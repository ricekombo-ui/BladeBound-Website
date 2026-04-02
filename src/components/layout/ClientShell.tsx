"use client";

import { ReactNode } from "react";
import LogoIntro from "@/components/sections/LogoIntro";
import ParticleField from "@/components/ui/ParticleField";
import FloatingPlatformBar from "@/components/ui/FloatingPlatformBar";

export default function ClientShell({ children }: { children: ReactNode }) {
  return (
    <>
      <LogoIntro />
      <ParticleField />
      {children}
      <FloatingPlatformBar />
    </>
  );
}
