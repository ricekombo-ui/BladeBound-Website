"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ProofItem {
  stat: number;
  suffix: string;
  label: string;
  detail: string;
}

const proofItems: ProofItem[] = [
  { stat: 200, suffix: "+", label: "Games Run", detail: "Across campaigns and one-shots" },
  { stat: 50, suffix: "+", label: "Players Served", detail: "Daggerheart players and GMs" },
  { stat: 3, suffix: "", label: "Active Series", detail: "Consistent, focused content" },
  { stat: 1, suffix: "", label: "System Focus", detail: "Daggerheart. That's it." },
];

export default function ProofSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {proofItems.map((item, i) => (
        <ScrollReveal key={item.label} delay={i * 150} direction="up">
          <div className="text-center p-6 bg-shadow/10 border border-white/5 rounded-lg hover:border-ember/20 transition-all duration-300">
            <div className="text-ember font-serif text-3xl md:text-4xl font-semibold mb-1">
              <AnimatedCounter target={item.stat} suffix={item.suffix} duration={2000} />
            </div>
            <div className="text-bone text-sm font-medium mb-1">{item.label}</div>
            <div className="text-stone text-xs">{item.detail}</div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
