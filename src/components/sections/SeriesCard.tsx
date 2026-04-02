import Link from "next/link";

interface SeriesCardProps {
  label: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  accent?: string;
}

export default function SeriesCard({
  label,
  title,
  description,
  href,
  external = false,
  accent = "#d56047",
}: SeriesCardProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group block bg-void border border-white/5 rounded-lg overflow-hidden hover:border-ember/30 transition-all duration-200"
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
        <span className="inline-block mt-4 text-ember text-xs font-medium">
          Watch Now &rarr;
        </span>
      </div>
    </Link>
  );
}
