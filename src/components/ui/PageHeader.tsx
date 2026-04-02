interface PageHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function PageHeader({
  label,
  title,
  subtitle,
  centered = false,
}: PageHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? "text-center" : ""}`}>
      {label && (
        <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
          {label}
        </span>
      )}
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-stone text-lg md:text-xl max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
