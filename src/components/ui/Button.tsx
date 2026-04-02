import Link from "next/link";
import { ReactNode } from "react";

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

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
