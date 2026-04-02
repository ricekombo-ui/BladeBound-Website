import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}

export default function SectionWrapper({
  children,
  className = "",
  id,
  tight = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${tight ? "py-12 md:py-16" : "py-16 md:py-24"} ${className}`}
    >
      {children}
    </section>
  );
}
