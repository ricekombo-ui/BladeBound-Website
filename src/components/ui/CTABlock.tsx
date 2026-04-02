import Button from "./Button";

interface CTABlockProps {
  label?: string;
  title: string;
  body?: string;
  primaryText: string;
  primaryHref: string;
  primaryExternal?: boolean;
  secondaryText?: string;
  secondaryHref?: string;
  secondaryExternal?: boolean;
  dark?: boolean;
}

export default function CTABlock({
  label,
  title,
  body,
  primaryText,
  primaryHref,
  primaryExternal = false,
  secondaryText,
  secondaryHref,
  secondaryExternal = false,
  dark = false,
}: CTABlockProps) {
  return (
    <div className={`rounded-lg border px-8 py-12 md:py-16 text-center ${dark ? "bg-void border-white/5" : "bg-shadow/20 border-ember/20"}`}>
      {label && (
        <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
          {label}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl text-bone mb-4">{title}</h2>
      {body && <p className="text-stone text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">{body}</p>}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button href={primaryHref} variant="primary" size="lg" external={primaryExternal}>
          {primaryText}
        </Button>
        {secondaryText && secondaryHref && (
          <Button href={secondaryHref} variant="secondary" size="lg" external={secondaryExternal}>
            {secondaryText}
          </Button>
        )}
      </div>
    </div>
  );
}
