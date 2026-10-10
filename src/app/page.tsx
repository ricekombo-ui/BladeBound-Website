import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import SectionWrapper from "@/components/ui/SectionWrapper";
import ProofSection from "@/components/sections/ProofSection";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ShortsWheel from "@/components/ui/ShortsWheel";
import EmberGlow from "@/components/ui/EmberGlow";
import DualityScroll from "@/components/ui/DualityScroll";
import { LINKS } from "@/lib/constants";
import { getFeaturedVideos, getShortsFromPlaylist } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "BladeBound | Narrative-First Daggerheart Content",
  description:
    "BladeBound is a home for narrative-first Daggerheart content, cinematic play, and a community built around serious tabletop craft.",
};

// Routes by intent: what a visitor is trying to do, not a list of what we offer.
const startHere = [
  {
    heading: "New to Daggerheart",
    body: "Class guides, campaign frames, and rules explained by a GM with 200+ sessions behind the screen.",
    href: "/content",
    cta: "Start watching",
  },
  {
    heading: "Ready to play",
    body: "One-shots and campaigns run story-first, built for first-timers and veterans alike.",
    href: "/play",
    cta: "See the games",
  },
  {
    heading: "Need tools for your table",
    body: "Free class quick-guides you can print or pull up mid-session.",
    href: "/armory#samples",
    cta: "Get the guides",
  },
];

export default async function HomePage() {
  const [featuredVideos, shorts] = await Promise.all([
    getFeaturedVideos(),
    getShortsFromPlaylist(),
  ]);

  return (
    <>
      <DualityScroll />
      <Hero featuredVideos={featuredVideos} />

      {/* Start here: three routes by intent */}
      <SectionWrapper tight id="start">
        <ScrollReveal direction="up">
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-10 max-w-2xl">
            Where do you want to start?
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
          {startHere.map((item, i) => (
            <ScrollReveal key={item.heading} direction="up" delay={i * 120}>
              <div className="border-t border-ember/40 pt-6 h-full flex flex-col">
                <h3 className="font-serif text-xl text-bone mb-3">{item.heading}</h3>
                <p className="text-stone text-base leading-relaxed mb-5 flex-1">{item.body}</p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-ember text-sm font-semibold hover:text-dust transition-colors"
                >
                  {item.cta} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      {/* Shorts */}
      <SectionWrapper id="watch">
        <ScrollReveal direction="up">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
              Watch Before You Decide
            </h2>
            <p className="text-stone text-base md:text-lg max-w-xl mx-auto">
              Quick hits from the channel. Swipe to explore.
            </p>
          </div>
        </ScrollReveal>
        <ShortsWheel shorts={shorts} />
      </SectionWrapper>

      {/* Play */}
      <SectionWrapper id="play" tight className="relative">
        <EmberGlow />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div>
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
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {[
                { title: "Narrative first", body: "Story drives every session. Mechanics serve the fiction, not the other way around." },
                { title: "Beginner friendly", body: "New to Daggerheart or to TTRPGs? Thorough onboarding gets you comfortable fast." },
                { title: "Cinematic play", body: "Scenes are crafted and moments are built. Your character will matter." },
                { title: "Real GM support", body: "Session zero, clear expectations, and a GM who knows the system deeply." },
              ].map((item) => (
                <div key={item.title} className="border-l-2 border-ember/40 pl-4">
                  <dt className="font-serif text-base text-bone mb-1">{item.title}</dt>
                  <dd className="text-stone text-sm leading-relaxed">{item.body}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </SectionWrapper>

      {/* Proof */}
      <SectionWrapper tight>
        <ScrollReveal direction="up">
          <h2 className="font-serif text-2xl md:text-3xl text-bone mb-10 text-center">
            Built on Real Table Experience
          </h2>
        </ScrollReveal>
        <ProofSection />
      </SectionWrapper>

      {/* Community CTA */}
      <div className="relative overflow-hidden">
        <SectionWrapper tight>
          <ScrollReveal direction="up">
            <CTABlock
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

      {/* Support */}
      <SectionWrapper tight>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <ScrollReveal direction="left">
            <div>
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
            <ul className="space-y-3">
              {[
                "Early access to new content and releases",
                "Bonus resources: connection questions, build guides, supplements",
                "Access to exclusive supporter games",
                "Behind-the-scenes updates and progress notes",
                "Direct input on future projects and content direction",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-ember mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                  <span className="text-stone text-base">{item}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </SectionWrapper>
    </>
  );
}
