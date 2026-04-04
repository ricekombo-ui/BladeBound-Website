import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
  alternate?: boolean;
}

export default function SectionWrapper({
  children,
  className = "",
  id,
  tight = false,
  alternate = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${tight ? "py-12 md:py-16" : "py-16 md:py-24"} ${className}`}
    >
      {alternate && (
        <div className="absolute inset-0 -mx-[100vw] bg-shadow/[0.03]" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }} />
      )}
      <div className="relative">
        {children}
      </div>
    </section>
  );
}
