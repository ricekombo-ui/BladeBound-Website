interface ProofItem {
  stat: string;
  label: string;
  detail?: string;
}

const proofItems: ProofItem[] = [
  { stat: "200+", label: "Games Run", detail: "Across campaigns and one-shots" },
  { stat: "Active", label: "Discord Community", detail: "Daggerheart players and GMs" },
  { stat: "Daggerheart", label: "Focused Content", detail: "Not just another TTRPG channel" },
  { stat: "Narrative", label: "First Approach", detail: "Story and mechanics in balance" },
];

export default function ProofSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {proofItems.map((item) => (
        <div key={item.label} className="text-center p-6 bg-shadow/10 border border-white/5 rounded-lg">
          <div className="text-ember font-serif text-2xl md:text-3xl font-semibold mb-1">
            {item.stat}
          </div>
          <div className="text-bone text-sm font-medium mb-1">{item.label}</div>
          {item.detail && (
            <div className="text-stone text-xs">{item.detail}</div>
          )}
        </div>
      ))}
    </div>
  );
}
