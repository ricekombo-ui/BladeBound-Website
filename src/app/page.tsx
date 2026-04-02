import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import FeatureCards from "@/components/sections/FeatureCards";
import SeriesCard from "@/components/sections/SeriesCard";
import ProofSection from "@/components/sections/ProofSection";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "BladeBound Saga | Narrative-First Daggerheart Content",
  description:
    "BladeBound Saga is a home for narrative-first Daggerheart content, cinematic play, and a community built around serious tabletop craft.",
};

const whatWeOffer = [
  {
    icon: "⚔",
    title: "Daggerheart Education",
    body: "Deep-dive content covering classes, campaign frames, mechanics, and play philosophy. Whether you are new or experienced, there is something here for you.",
  },
  {
    icon: "🎬",
    title: "Cinematic Actual Play",
    body: "Actual play content that prioritizes story, character, and meaningful stakes. Entertainment and system education in the same seat.",
  },
  {
    icon: "🎲",
    title: "Professional GM Services",
    body: "Narrative-first Daggerheart games run by a GM with 200+ sessions of experience. One-shots and campaigns available through StartPlaying.",
  },
  {
    icon: "🏛",
    title: "Community Space",
    body: "A Discord community for Daggerheart players, GMs, and fans who care about the craft. Discussion, events, games, and more.",
  },
  {
    icon: "📖",
    title: "Resources and Guides",
    body: "Free tools, connection questions, build guides, and digital resources to improve your game and your table.",
  },
  {
    icon: "🔥",
    title: "Supporter Benefits",
    body: "Back the work and get early access, bonus resources, exclusive games, and a direct line to future projects.",
  },
];

const featuredSeries = [
  {
    label: "Series",
    title: "Sage Touched",
    description:
      "A Daggerheart discussion and breakdown series covering classes, campaign frames, mechanics, and design. The entry point for anyone new to the game.",
    href: LINKS.youtube,
    external: true,
    accent: "#d56047",
  },
  {
    label: "Actual Play",
    title: "Campaign Frame Gauntlet",
    description:
      "Official Daggerheart campaign frames, showcased through focused one-shots. See how each frame plays at a real table before you choose your next adventure.",
    href: LINKS.youtube,
    external: true,
    accent: "#ae4641",
  },
  {
    label: "Education",
    title: "GM Tips",
    description:
      "Short and mid-form content on narrative habits, pacing, player engagement, and running better Daggerheart sessions. Practical and direct.",
    href: LINKS.youtube,
    external: true,
    accent: "#69354c",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* What BladeBound Offers */}
      <SectionWrapper id="what-we-offer">
        <div className="mb-12">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            What We Do
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            Everything You Need at One Table
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            Content, community, games, and resources. All focused on Daggerheart, all built around narrative-first play.
          </p>
        </div>
        <FeatureCards features={whatWeOffer} columns={3} />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Featured Series */}
      <SectionWrapper id="featured-series">
        <div className="mb-12">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            Featured Content
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            Content Worth Watching
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            Three series. Each one serves a different purpose. All of them are worth your time.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSeries.map((series) => (
            <SeriesCard key={series.title} {...series} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href={LINKS.youtube} variant="secondary" external>
            Browse All Content on YouTube
          </Button>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Play CTA */}
      <SectionWrapper id="play" tight>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Play Daggerheart
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-4">
              Sit at a Table That Takes Story Seriously
            </h2>
            <p className="text-stone text-base leading-relaxed mb-3">
              BladeBound games are narrative-first, mechanically grounded, and welcoming to players of all experience levels. If you have never played Daggerheart, this is the best possible place to start.
            </p>
            <p className="text-stone text-base leading-relaxed mb-6">
              Over 200 sessions run. Every game designed to give players a real story to take home.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={LINKS.startplaying} variant="primary" size="lg" external>
                View Games on StartPlaying
              </Button>
              <Button href="/play" variant="ghost" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Narrative First", body: "Story drives every session. Mechanics serve the fiction, not the other way around." },
              { title: "Beginner Friendly", body: "New to Daggerheart? New to TTRPGs? We have you covered with thorough onboarding." },
              { title: "Cinematic Play", body: "Scenes are crafted. Moments are built. Your character will matter." },
              { title: "Active GM Support", body: "Session zero, clear expectations, and a GM who knows the system deeply." },
            ].map((item) => (
              <div key={item.title} className="bg-shadow/10 border border-white/5 rounded-lg p-4">
                <h4 className="font-serif text-sm text-ember mb-2">{item.title}</h4>
                <p className="text-stone text-xs leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Proof */}
      <SectionWrapper tight>
        <div className="mb-10 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-bone">
            Built on Real Table Experience
          </h2>
        </div>
        <ProofSection />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Community CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="Community"
          title="The Story Goes Further Together"
          body="Join the BladeBound Discord to connect with Daggerheart players and GMs, get updates on games and content, and find your next table."
          primaryText="Join the Discord"
          primaryHref={LINKS.discord}
          primaryExternal
          secondaryText="Learn More"
          secondaryHref="/community"
        />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Support CTA */}
      <SectionWrapper tight>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Support the Work
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-4">
              Back What You Want to See More Of
            </h2>
            <p className="text-stone text-base leading-relaxed mb-6">
              BladeBound exists because people like you value this kind of work. Supporting the project means more content, more games, more resources, and more community infrastructure. You also get direct value in return.
            </p>
            <Button href={LINKS.patreon} variant="primary" size="lg" external>
              Support on Patreon
            </Button>
          </div>
          <div className="space-y-3">
            {[
              "Early access to new content and releases",
              "Bonus resources: connection questions, build guides, supplements",
              "Access to exclusive supporter games",
              "Behind-the-scenes updates and progress notes",
              "Direct input on future projects and content direction",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-ember mt-0.5 flex-shrink-0">✓</span>
                <span className="text-stone text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
