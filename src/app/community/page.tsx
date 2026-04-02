import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the BladeBound Saga Discord. A community for Daggerheart players, GMs, and fans who take the craft seriously.",
};

const communityPerks = [
  {
    icon: "💬",
    title: "Daggerheart Discussion",
    body: "Channels dedicated to classes, campaign frames, rules questions, and design discussion. Talk about the game with people who actually play it.",
  },
  {
    icon: "🎲",
    title: "Game Announcements",
    body: "Community members get first notice of new game openings, special events, and campaign opportunities before they are posted publicly.",
  },
  {
    icon: "📢",
    title: "Content Updates",
    body: "New videos, guides, and resources announced directly in the Discord before anywhere else.",
  },
  {
    icon: "🧠",
    title: "GM and Player Support",
    body: "Ask questions, get feedback, share your table horror stories. A space to talk craft with people who care about getting it right.",
  },
  {
    icon: "📅",
    title: "Events and One-Shots",
    body: "Community games, special events, and exclusive sessions run for Discord members.",
  },
  {
    icon: "🤝",
    title: "Find a Table",
    body: "Looking for players or a GM? The community helps you connect with people who want the same kind of play.",
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Community
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            A Space for People Who Play Seriously
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            The BladeBound Discord is where Daggerheart players and GMs gather to discuss the game, find tables, and stay connected with everything the brand is building.
          </p>
          <Button href={LINKS.discord} variant="primary" size="lg" external>
            Join the Discord
          </Button>
        </div>
      </section>

      {/* What You Get */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            What You Get
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            More Than a Chat Server
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            The BladeBound community is built around Daggerheart and the people who want to play it well.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityPerks.map((perk) => (
            <div
              key={perk.title}
              className="bg-shadow/10 border border-white/5 rounded-lg p-5 hover:border-ember/20 transition-colors"
            >
              <div className="text-2xl mb-3">{perk.icon}</div>
              <h3 className="font-serif text-base text-bone mb-2">{perk.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{perk.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Who Is It For */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Who Belongs Here
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-6">
              You Do Not Need to Be an Expert
            </h2>
            <div className="space-y-4 text-stone text-base leading-relaxed">
              <p>
                The BladeBound community welcomes anyone who is interested in Daggerheart, whether you have played for years or just heard about it for the first time.
              </p>
              <p>
                The standard here is engagement, not experience. Show up, ask questions, share what you know. Treat other members with respect. That is all that is required.
              </p>
              <p>
                If you care about narrative play and want to talk with people who do too, this is the right room.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              "Players who want to improve their game",
              "GMs looking for a Daggerheart-focused space",
              "New players exploring the system",
              "Content viewers who want more connection",
              "Anyone building toward their next campaign",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 bg-shadow/10 border border-white/5 rounded-lg">
                <span className="text-ember flex-shrink-0">→</span>
                <span className="text-stone text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="Join Now"
          title="The Table is Open"
          body="The BladeBound community is free to join. Come for Daggerheart. Stay for the people."
          primaryText="Join the Discord"
          primaryHref={LINKS.discord}
          primaryExternal
          secondaryText="Watch Content First"
          secondaryHref={LINKS.youtube}
          secondaryExternal
        />
      </SectionWrapper>
    </>
  );
}
