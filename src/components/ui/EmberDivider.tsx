"use client";

import ScrollReveal from "./ScrollReveal";

interface EmberDividerProps {
  className?: string;
}

export default function EmberDivider({ className = "" }: EmberDividerProps) {
  return (
    <ScrollReveal direction="none" duration={1000} className={className}>
      <div className="relative w-full overflow-hidden py-2">
        <img
          src="/misc/divider-element.svg"
          alt=""
          aria-hidden="true"
          className="w-full max-w-4xl mx-auto h-auto opacity-80"
        />
      </div>
    </ScrollReveal>
  );
}
