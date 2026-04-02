import Link from "next/link";

interface ContentCardProps {
  category: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  badge?: string;
}

export default function ContentCard({
  category,
  title,
  description,
  href,
  external = false,
  badge,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group block bg-shadow/10 border border-white/5 rounded-lg p-5 hover:border-ember/25 hover:bg-shadow/20 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-ember text-xs font-semibold uppercase tracking-wider">{category}</span>
        {badge && (
          <span className="text-xs text-void bg-ember px-2 py-0.5 rounded font-medium">{badge}</span>
        )}
      </div>
      <h3 className="font-serif text-base text-bone mb-2 group-hover:text-ember transition-colors">
        {title}
      </h3>
      <p className="text-stone text-sm leading-relaxed">{description}</p>
    </Link>
  );
}
