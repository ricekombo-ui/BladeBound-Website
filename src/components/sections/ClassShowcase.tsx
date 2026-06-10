import { LINKS } from "@/lib/constants";

// ── Daggerheart domain colors ─────────────────────────────────────────────────
const DOMAINS: Record<string, string> = {
  Arcana:   "#8b5cf6",
  Blade:    "#dc4444",
  Bone:     "#d8cfc0",
  Codex:    "#4a7fd6",
  Grace:    "#d65ca8",
  Midnight: "#5d5a8f",
  Sage:     "#4caf6e",
  Splendor: "#e0b341",
  Valor:    "#e07b39",
};

interface ClassEntry {
  name: string;
  domains: [string, string];
  tagline: string;
  /** Sage Touched episode URL — defaults to the playlist until each episode is linked */
  video?: string;
}

const SAGE_TOUCHED_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLoQqS6kdYti3BOL9CHTpTH8i3zowr4Zlt";

const CLASSES: ClassEntry[] = [
  { name: "Bard",     domains: ["Grace", "Codex"],     tagline: "Words that wound, songs that shield." },
  { name: "Druid",    domains: ["Sage", "Arcana"],     tagline: "The wild does not ask permission." },
  { name: "Guardian", domains: ["Valor", "Blade"],     tagline: "The wall between the party and the dark." },
  { name: "Ranger",   domains: ["Bone", "Sage"],       tagline: "Every trail ends where the hunter decides." },
  { name: "Rogue",    domains: ["Midnight", "Grace"],  tagline: "Unseen, unheard, unforgotten." },
  { name: "Seraph",   domains: ["Splendor", "Valor"],  tagline: "Faith with a blade's edge." },
  { name: "Sorcerer", domains: ["Arcana", "Midnight"], tagline: "Power that was never meant to be tamed." },
  { name: "Warrior",  domains: ["Blade", "Bone"],      tagline: "Steel answers what words cannot." },
  { name: "Wizard",   domains: ["Codex", "Splendor"],  tagline: "Knowledge is the sharpest weapon." },
];

export default function ClassShowcase() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CLASSES.map((cls) => {
          const c1 = DOMAINS[cls.domains[0]];
          const c2 = DOMAINS[cls.domains[1]];
          return (
            <div
              key={cls.name}
              className="bb-class-card relative rounded-lg border border-white/5 bg-shadow/10 p-6 overflow-hidden"
              style={{ "--c1": c1, "--c2": c2 } as React.CSSProperties}
            >
              {/* Domain gradient glow — flares on hover */}
              <div
                className="bb-class-glow absolute inset-0 opacity-[0.07] transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${c1}55 0%, transparent 45%, ${c2}55 100%)`,
                }}
              />

              <div className="relative">
                {/* Domain chips */}
                <div className="flex gap-2 mb-4">
                  {cls.domains.map((d, i) => (
                    <span
                      key={d}
                      className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={{
                        color: i === 0 ? c1 : c2,
                        borderColor: `${i === 0 ? c1 : c2}44`,
                        background: `${i === 0 ? c1 : c2}11`,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <h3 className="font-serif text-2xl text-bone mb-1">{cls.name}</h3>
                <p className="text-stone text-sm italic mb-6">{cls.tagline}</p>

                {/* Free path */}
                <a
                  href={cls.video ?? SAGE_TOUCHED_PLAYLIST}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-bone hover:text-ember transition-colors mb-2.5 group/link"
                >
                  <span className="w-6 h-6 rounded-full bg-ember/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-ember ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>
                    Watch the breakdown
                    <span className="text-stone/50 text-xs ml-2">Free · Sage Touched</span>
                  </span>
                </a>

                {/* Forge path */}
                <a
                  href={LINKS.patreon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-stone hover:text-bone transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-stone" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                    </svg>
                  </span>
                  <span>
                    Build infographic
                    <span className="text-ember/70 text-xs ml-2">The Forge · $10/mo</span>
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover flare styles */}
      <style>{`
        .bb-class-card { transition: border-color 400ms, transform 300ms, box-shadow 400ms; }
        .bb-class-card:hover {
          border-color: color-mix(in srgb, var(--c1) 45%, transparent);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px -12px color-mix(in srgb, var(--c1) 35%, transparent),
                      0 4px 20px -8px color-mix(in srgb, var(--c2) 30%, transparent);
        }
        .bb-class-card:hover .bb-class-glow { opacity: 0.22; }
      `}</style>
    </>
  );
}
