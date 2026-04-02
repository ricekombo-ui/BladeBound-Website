"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-white/8 rounded-md overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left text-bone hover:bg-white/3 transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-medium text-sm md:text-base">{item.question}</span>
            <span className={`text-ember ml-4 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-stone text-sm md:text-base leading-relaxed border-t border-white/5">
              <p className="pt-4">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
