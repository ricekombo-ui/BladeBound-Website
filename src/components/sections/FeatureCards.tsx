interface Feature {
  icon: string;
  title: string;
  body: string;
}

interface FeatureCardsProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export default function FeatureCards({ features, columns = 3 }: FeatureCardsProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {features.map((f) => (
        <div
          key={f.title}
          className="bg-shadow/10 border border-white/5 rounded-lg p-6 hover:border-ember/20 transition-colors"
        >
          <div className="text-2xl mb-3">{f.icon}</div>
          <h3 className="font-serif text-lg text-bone mb-2">{f.title}</h3>
          <p className="text-stone text-sm leading-relaxed">{f.body}</p>
        </div>
      ))}
    </div>
  );
}
