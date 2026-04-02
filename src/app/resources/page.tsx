import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free Daggerheart tools, connection questions, build guides, and beginner resources from BladeBound.",
};

const freeResources = [
  {
    title: "Connection Question Pack",
    description:
      "A curated set of pre-session connection questions designed for Daggerheart tables. Use them in session zero or between sessions to deepen character bonds.",
    status: "Free Download",
    href: "#",
  },
  {
    title: "Daggerheart Beginner Guide",
    description:
      "A plain-language overview of the core Daggerheart rules, written for players coming from D&D or other systems. What changes, what stays the same, and what to focus on first.",
    status: "Free Download",
    href: "#",
  },
  {
    title: "Session Zero Framework",
    description:
      "A structured approach to running session zero for a Daggerheart campaign. Covers safety tools, expectations, tone-setting, and character connection.",
    status: "Free Download",
    href: "#",
  },
  {
    title: "GM Prep Template",
    description:
      "A lightweight session prep format designed for Daggerheart's narrative structure. Scenes, NPCs, beats, and fallbacks built into one document.",
    status: "Coming Soon",
    href: "#",
  },
];

const upcomingResources = [
  {
    title: "Class Build Guides",
    description: "Practical builds for every Daggerheart class, with notes on how to get the most out of each at different tiers.",
    status: "In Development",
  },
  {
    title: "Campaign Frame Primer",
    description: "A comparison guide for every official Daggerheart campaign frame, including tone, mechanical hooks, and GM advice for each.",
    status: "In Development",
  },
  {
    title: "Daggerheart Supplement: Supplement Name TBD",
    description: "An original supplement expanding Daggerheart options for a specific area of play. Details to be announced.",
    status: "Planned",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Resources
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Tools That Make the Table Better
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed">
            Free downloads, guides, and materials for Daggerheart players and GMs. Useful things, built with the same care as everything else on this site.
          </p>
        </div>
      </section>

      {/* Free Resources */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            Free
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            Available Now
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            No signup required for most downloads. Just take what is useful and use it.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {freeResources.map((item) => (
            <div
              key={item.title}
              className="bg-shadow/10 border border-white/5 rounded-lg p-6 hover:border-ember/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-ember text-xs font-semibold uppercase tracking-wider">
                  {item.status}
                </span>
              </div>
              <h3 className="font-serif text-lg text-bone mb-2">{item.title}</h3>
              <p className="text-stone text-sm leading-relaxed mb-4">{item.description}</p>
              {item.status === "Free Download" ? (
                <Button href={item.href} variant="secondary" size="sm">
                  Download
                </Button>
              ) : (
                <span className="text-stone text-xs italic">Coming soon</span>
              )}
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Upcoming Resources */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            In the Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            What Is Coming
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            Resources currently in development or planned. Supporters get access first.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingResources.map((item) => (
            <div
              key={item.title}
              className="bg-void border border-white/5 rounded-lg p-5"
            >
              <span className="inline-block text-stone text-xs font-semibold uppercase tracking-wider mb-3 border border-stone/20 px-2 py-0.5 rounded">
                {item.status}
              </span>
              <h3 className="font-serif text-base text-bone mb-2">{item.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Supporter Resources CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="Supporter Access"
          title="Get Resources Before Anyone Else"
          body="Supporters on Patreon receive early access to every new resource, plus bonus materials not available to the public."
          primaryText="Support on Patreon"
          primaryHref={LINKS.patreon}
          primaryExternal
          secondaryText="Join the Discord"
          secondaryHref={LINKS.discord}
          secondaryExternal
        />
      </SectionWrapper>
    </>
  );
}
