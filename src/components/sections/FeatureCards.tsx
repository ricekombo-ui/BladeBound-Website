"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

interface Feature {
  icon: string;
  title: string;
  body: string;
}

interface FeatureCardsProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
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
        <ScrollReveal key={f.title} delay={i * 100} direction="up">
          <div className="group bg-shadow/10 border border-white/5 rounded-lg p-6 hover:border-ember/30 hover:bg-shadow/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-ember/5 h-full">
            <div className="text-2xl mb-3 group-hover:scale-125 transition-transform duration-300 origin-left">{f.icon}</div>
            <h3 className="font-serif text-lg text-bone mb-2 group-hover:text-ember transition-colors duration-300">{f.title}</h3>
            <p className="text-stone text-sm leading-relaxed">{f.body}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
