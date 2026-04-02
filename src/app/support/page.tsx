import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support BladeBound Saga on Patreon. Get early access, bonus resources, exclusive games, and help build more Daggerheart content.",
};

const tiers = [
  {
    name: "Supporter",
    price: "$5/mo",
    description: "Back the work and stay close to what is being built.",
    perks: [
      "Early access to new content",
      "Behind-the-scenes updates and notes",
      "Supporter role in the Discord",
      "Monthly progress and project updates",
    ],
    cta: "Back the Work",
    accent: false,
  },
  {
    name: "Adventurer",
    price: "$10/mo",
    description: "Deeper access, more resources, and a direct line to future projects.",
    perks: [
      "Everything in Supporter",
      "Bonus resources: connection questions, build guides",
      "Access to digital supplements as released",
      "Input on future content direction",
      "Priority Discord channels",
    ],
    cta: "Join as Adventurer",
    accent: true,
  },
  {
    name: "Patron",
    price: "$25/mo",
    description: "Full access, exclusive games, and the closest connection to the work.",
    perks: [
      "Everything in Adventurer",
      "Access to exclusive supporter-only games",
      "Named credit in appropriate productions",
      "Direct feedback channel",
      "First access to new products and campaigns",
    ],
    cta: "Become a Patron",
    accent: false,
  },
];

export default function SupportPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Support BladeBound
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Back What You Want More Of
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            BladeBound Saga is an independent project. Supporting it means more content, more games, better resources, and a stronger community. You get real value in return.
          </p>
          <Button href={LINKS.patreon} variant="primary" size="lg" external>
            Support on Patreon
          </Button>
        </div>
      </section>

      {/* Why Support */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Why It Matters
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-6">
              Independent Work Runs on Support
            </h2>
            <div className="space-y-4 text-stone text-base leading-relaxed">
              <p>
                Every video, session, guide, and resource produced by BladeBound Saga exists because it was worth making. Not because an algorithm demanded it. Not because it was optimized for engagement over substance.
              </p>
              <p>
                That kind of work takes time and commitment to sustain. Patron support is what makes it possible to keep the quality high and the output consistent without compromising the purpose of the project.
              </p>
              <p>
                If BladeBound has given you something useful, whether that is a better session, a clearer understanding of the system, or a table you loved sitting at, this is the way to help build more of it.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-lg text-bone mb-4">Support goes toward:</h3>
            {[
              "More and higher-quality video content",
              "Continued professional GM services",
              "Development of digital supplements and resources",
              "Community infrastructure and events",
              "Expanded actual play and series production",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="text-ember mt-0.5 flex-shrink-0">✓</span>
                <span className="text-stone text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Tiers */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            Support Tiers
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            Choose Your Level
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            All tiers are managed through Patreon. Final pricing and perks are confirmed on the Patreon page.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg p-6 flex flex-col ${
                tier.accent
                  ? "bg-ember/10 border border-ember/40"
                  : "bg-shadow/10 border border-white/5"
              }`}
            >
              {tier.accent && (
                <span className="text-xs font-semibold uppercase tracking-widest text-ember mb-3">
                  Most Popular
                </span>
              )}
              <h3 className="font-serif text-xl text-bone mb-1">{tier.name}</h3>
              <div className="text-2xl font-semibold text-ember mb-3">{tier.price}</div>
              <p className="text-stone text-sm mb-5 leading-relaxed">{tier.description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="text-ember flex-shrink-0 text-xs mt-0.5">✓</span>
                    <span className="text-stone text-xs leading-relaxed">{perk}</span>
                  </li>
                ))}
              </ul>
              <Button href={LINKS.patreon} variant={tier.accent ? "primary" : "secondary"} external>
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="One-Time Support"
          title="Not Ready to Commit Monthly?"
          body="A one-time contribution is also welcome. Every bit of support directly funds more content, more games, and more resources for the Daggerheart community."
          primaryText="Support on Patreon"
          primaryHref={LINKS.patreon}
          primaryExternal
          secondaryText="Join the Discord First"
          secondaryHref={LINKS.discord}
          secondaryExternal
        />
      </SectionWrapper>
    </>
  );
}
