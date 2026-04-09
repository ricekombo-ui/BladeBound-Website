import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import FeatureCards from "@/components/sections/FeatureCards";
import ProofSection from "@/components/sections/ProofSection";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import VideoEmbed from "@/components/ui/VideoEmbed";
import ShortsWheel from "@/components/ui/ShortsWheel";
import EmberDivider from "@/components/ui/EmberDivider";
import EmberGlow from "@/components/ui/EmberGlow";
import { LINKS } from "@/lib/constants";
import { getFeaturedVideos, getShortsVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "BladeBound | Narrative-First Daggerheart Content",
  description:
    "BladeBound is a home for narrative-first Daggerheart content, cinematic play, and a community built around serious tabletop craft.",
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


export default async function HomePage() {
  const [featuredVideos, shorts] = await Promise.all([
    getFeaturedVideos(),
    getShortsVideos(),
  ]);

  return (
    <>
      <Hero />

      {/* What BladeBound Offers */}
      <SectionWrapper id="what-we-offer">
        <ScrollReveal direction="up">
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
        </ScrollReveal>
        <FeatureCards features={whatWeOffer} columns={3} />
      </SectionWrapper>

      <EmberDivider />

      {/* Featured Content */}
      <SectionWrapper id="featured-series" className="relative">
        <EmberGlow />
        <ScrollReveal direction="up">
          <div className="mb-12">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Featured Content
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
              Content Worth Watching
            </h2>
            <p className="text-stone text-base md:text-lg max-w-xl">
              Most viewed, most recent, and a hidden gem — pulled fresh from the channel.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredVideos.map((video, i) => {
            const label = i === 0 ? "Most Viewed · Sage Touched" : i === 1 ? "Most Recent" : "Worth Watching";
            return (
              <ScrollReveal key={`${video.id}-${i}`} delay={i * 150} direction="up">
                <div>
                  <VideoEmbed videoId={video.id} title={video.title} />
                  <p className="mt-2 text-ember text-[10px] font-semibold uppercase tracking-widest">{label}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
        <ScrollReveal delay={500} direction="up">
          <div className="mt-8 text-center">
            <Button href={LINKS.youtube} variant="secondary" external>
              Browse All Content on YouTube
            </Button>
          </div>
        </ScrollReveal>
      </SectionWrapper>

      <EmberDivider />

      {/* Watch Before You Decide — Shorts Wheel */}
      <SectionWrapper id="watch">
        <ScrollReveal direction="up">
          <div className="mb-12 text-center">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              See It in Action
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
              Watch Before You Decide
            </h2>
            <p className="text-stone text-base md:text-lg max-w-xl mx-auto">
              Quick hits from the channel. Swipe to explore.
            </p>
          </div>
        </ScrollReveal>
        <ShortsWheel
          shorts={shorts}
          labels={["Most Viewed Short", "Most Recent Short", "Worth Watching"]}
        />
      </SectionWrapper>

      <EmberDivider />

      {/* Play CTA */}
      <SectionWrapper id="play" tight className="relative">
        <EmberGlow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
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
          </ScrollReveal>
          <ScrollReveal direction="right" delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Narrative First", body: "Story drives every session. Mechanics serve the fiction, not the other way around." },
                { title: "Beginner Friendly", body: "New to Daggerheart? New to TTRPGs? We have you covered with thorough onboarding." },
                { title: "Cinematic Play", body: "Scenes are crafted. Moments are built. Your character will matter." },
                { title: "Active GM Support", body: "Session zero, clear expectations, and a GM who knows the system deeply." },
              ].map((item) => (
                <div key={item.title} className="bg-shadow/10 border border-white/5 rounded-lg p-4 hover:border-ember/20 hover:bg-shadow/20 transition-all duration-300">
                  <h4 className="font-serif text-sm text-ember mb-2">{item.title}</h4>
                  <p className="text-stone text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </SectionWrapper>

      <EmberDivider />

      {/* Proof */}
      <SectionWrapper tight>
        <ScrollReveal direction="up">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-bone">
              Built on Real Table Experience
            </h2>
          </div>
        </ScrollReveal>
        <ProofSection />
      </SectionWrapper>

      <EmberDivider />

      {/* Community CTA — with hosts watermark */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "url('/background-hosts.png')" }}
        />
        <SectionWrapper tight>
          <ScrollReveal direction="up">
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
          </ScrollReveal>
        </SectionWrapper>
      </div>

      <EmberDivider />

      {/* Support CTA */}
      <SectionWrapper tight>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollReveal direction="left">
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
          </ScrollReveal>
          <ScrollReveal direction="right" delay={200}>
            <div className="space-y-3">
              {[
                "Early access to new content and releases",
                "Bonus resources: connection questions, build guides, supplements",
                "Access to exclusive supporter games",
                "Behind-the-scenes updates and progress notes",
                "Direct input on future projects and content direction",
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-3 opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}>
                  <span className="text-ember mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-stone text-sm">{item}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </SectionWrapper>
    </>
  );
}
