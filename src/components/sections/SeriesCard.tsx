import Link from "next/link";

interface SeriesCardProps {
  label: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  accent?: string;
  linkText?: string;
}

export default function SeriesCard({
  label,
  title,
  description,
  href,
  external = false,
  accent = "#d56047",
  linkText = "Watch Now",
}: SeriesCardProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group block bg-void border border-white/5 rounded-lg overflow-hidden hover:border-ember/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ember/5"
    >
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <div className="p-6">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
          {label}
        </span>
        <h3 className="font-serif text-xl text-bone mt-2 mb-3 group-hover:text-ember transition-colors">
          {title}
        </h3>
        <p className="text-stone text-sm leading-relaxed">{description}</p>
        <span className="inline-flex items-center gap-1 mt-4 text-ember text-xs font-medium group-hover:gap-2 transition-all duration-300">
          {linkText} <span>&rarr;</span>
        </span>
      </div>
    </Link>
  );
}
