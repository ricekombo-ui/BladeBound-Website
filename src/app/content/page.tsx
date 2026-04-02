import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SeriesCard from "@/components/sections/SeriesCard";
import ContentCard from "@/components/sections/ContentCard";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Content",
  description:
    "Daggerheart guides, GM tips, actual play, and system education. Browse BladeBound Saga's full content library.",
};

const featuredSeries = [
  {
    label: "Discussion Series",
    title: "Sage Touched",
    description:
      "A dedicated breakdown and discussion series for Daggerheart. Classes, campaign frames, mechanics, and design philosophy covered from both GM and player perspectives. The definitive starting point for anyone learning the game.",
    href: LINKS.youtube,
    external: true,
    accent: "#d56047",
  },
  {
    label: "Actual Play",
    title: "Campaign Frame Gauntlet",
    description:
      "Each official Daggerheart campaign frame gets its own focused one-shot. Watch how the tone, stakes, and mechanics shift across different frames. System education and live play combined.",
    href: LINKS.youtube,
    external: true,
    accent: "#ae4641",
  },
  {
    label: "GM Education",
    title: "GM Tips",
    description:
      "Direct, practical content on running better Daggerheart sessions. Pacing, player engagement, scene framing, mechanical calls, and narrative design. Short enough to apply immediately.",
    href: LINKS.youtube,
    external: true,
    accent: "#69354c",
  },
];

const contentCategories = [
  {
    category: "Daggerheart Basics",
    items: [
      {
        title: "How Daggerheart Actually Works",
        description: "A ground-level overview of the dice system, stress, hope, fear, and what makes it different from other RPGs.",
        badge: "Start Here",
      },
      {
        title: "Choosing Your Class",
        description: "A breakdown of every Daggerheart class with practical guidance on which fits your playstyle.",
      },
      {
        title: "Understanding Campaign Frames",
        description: "What campaign frames are, how they shape play, and how to pick the right one for your table.",
      },
    ],
  },
  {
    category: "GM Advice",
    items: [
      {
        title: "Running Fear and Hope at the Table",
        description: "How to leverage the fear and hope economy to create tension and momentum in your sessions.",
      },
      {
        title: "Scene Framing for Daggerheart GMs",
        description: "Practical techniques for opening, escalating, and closing scenes with intention.",
      },
      {
        title: "Managing the Spotlight",
        description: "How to give every player meaningful time without losing narrative momentum.",
      },
    ],
  },
  {
    category: "Player Guides",
    items: [
      {
        title: "Playing Your Character, Not Your Sheet",
        description: "How to make mechanical decisions that feel like in-world choices rather than optimization calls.",
      },
      {
        title: "Connection Questions: Why They Matter",
        description: "The power of pre-session character bonds and how to use them at the table.",
      },
    ],
  },
];

export default function ContentPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Content Library
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Daggerheart Content Worth Watching
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
            Series, guides, actual play, and education. All focused on Daggerheart. All built to make you a better player or GM.
          </p>
          <Button href={LINKS.youtube} variant="primary" size="lg" external>
            Watch on YouTube
          </Button>
        </div>
      </section>

      {/* Featured Series */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            Featured Series
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            Three Series. Three Purposes.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSeries.map((series) => (
            <SeriesCard key={series.title} {...series} />
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Content Categories */}
      {contentCategories.map((cat) => (
        <div key={cat.category}>
          <SectionWrapper tight>
            <div className="mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-bone">
                {cat.category}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((item) => (
                <ContentCard
                  key={item.title}
                  category={cat.category}
                  title={item.title}
                  description={item.description}
                  href={LINKS.youtube}
                  external
                  badge={"badge" in item ? (item as { badge: string }).badge : undefined}
                />
              ))}
            </div>
          </SectionWrapper>
          <div className="section-divider" />
        </div>
      ))}

      {/* Shorts Section */}
      <SectionWrapper tight>
        <div className="mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-bone mb-2">
            Shorts and Quick Tips
          </h2>
          <p className="text-stone text-sm">Fast, focused content under 5 minutes. One idea, delivered clearly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "What is Hope and Fear?",
            "The One Rule New Players Always Forget",
            "How to Use Downtime Well",
            "Why Daggerheart Stress Works",
          ].map((title) => (
            <ContentCard
              key={title}
              category="Quick Tip"
              title={title}
              description="Short-form content. One concept, explained cleanly."
              href={LINKS.youtube}
              external
            />
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="Subscribe"
          title="Stay Current on Everything BladeBound"
          body="New content drops regularly. Subscribe on YouTube and join the Discord to catch every release."
          primaryText="Subscribe on YouTube"
          primaryHref={LINKS.youtube}
          primaryExternal
          secondaryText="Join the Discord"
          secondaryHref={LINKS.discord}
          secondaryExternal
        />
      </SectionWrapper>
    </>
  );
}
