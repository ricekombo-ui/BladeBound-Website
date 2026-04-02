"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface SeriesCardProps {
  label: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  accent?: string;
  linkText?: string;
  index?: number;
}

export default function SeriesCard({
  label,
  title,
  description,
  href,
  external = false,
  accent = "#d56047",
  linkText = "Watch Now",
  index = 0,
}: SeriesCardProps) {
  return (
    <ScrollReveal delay={index * 150} direction="up">
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group block bg-void border border-white/5 rounded-lg overflow-hidden hover:border-ember/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-ember/10 h-full"
      >
        <div className="h-1 w-full transition-all duration-500 group-hover:h-1.5" style={{ backgroundColor: accent }} />
        <div className="p-6">
          <span className="text-xs font-semibold uppercase tracking-widest transition-colors duration-300" style={{ color: accent }}>
            {label}
          </span>
          <h3 className="font-serif text-xl text-bone mt-2 mb-3 group-hover:text-ember transition-colors duration-300">
            {title}
          </h3>
          <p className="text-stone text-sm leading-relaxed">{description}</p>
          <span className="inline-flex items-center gap-1.5 mt-4 text-ember text-xs font-medium group-hover:gap-3 transition-all duration-300">
            {linkText} <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}
