"use client";

import Link from "next/link";
import { ReactNode, MouseEvent } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ember hover:bg-dust text-void font-semibold shadow-lg hover:shadow-ember/20 hover:glow-ember",
  secondary:
    "bg-transparent border border-ember/40 hover:border-ember text-ember hover:bg-ember/10",
  ghost:
    "bg-transparent text-bone/70 hover:text-bone hover:bg-white/5",
  outline:
    "bg-transparent border border-bone/20 hover:border-bone/50 text-bone",
};

export function ExternalIcon() {
  return (
    <svg
      className="inline-block w-[0.7em] h-[0.7em] opacity-60 flex-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  external = false,
  children,
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded transition-all duration-200 font-medium leading-none";
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`;

  const handleEmberBurst = (e: MouseEvent) => {
    if ((variant === "primary" || variant === "secondary") && window.emberBurst) {
      window.emberBurst(e.clientX, e.clientY, 20);
    }
  };

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        onClick={handleEmberBurst}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
        {external && <ExternalIcon />}
      </Link>
    );
  }

  return (
    <button type={type} onClick={(e) => { handleEmberBurst(e); onClick?.(); }} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
