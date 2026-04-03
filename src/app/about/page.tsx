import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import ScrollReveal from "@/components/ui/ScrollReveal";
import EmberDivider from "@/components/ui/EmberDivider";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind BladeBound — Daniel, AJ, and Adam. A group of friends building narrative-first Daggerheart content since 2017.",
};

const teamMembers = [
  {
    name: "AJ",
    role: "The Player's Edge",
    photo: null,
    description: [
      "AJ represents what it looks like when a player fully engages with the system.",
      "As a long-time player, AJ brings instinct, emotional awareness, and a deep understanding of how decisions feel at the table. Where systems can become mechanical, AJ keeps the focus on connection, stakes, and momentum.",
      "At BladeBound, AJ anchors the player perspective, showing not just how the game works, but why it matters moment to moment.",
    ],
  },
  {
    name: "Adam",
    role: "The Voice of Immersion",
    photo: null,
    description: [
      "Adam approaches the game through character, voice, and presence.",
      "With a focus on roleplay and performance, Adam brings scenes to life through delivery, tone, and embodiment. As a newer player to Daggerheart, he also represents the learning experience, asking the questions others are thinking and bridging the gap between curiosity and confidence.",
      "At BladeBound, Adam shapes the feel of the table, turning moments into scenes and mechanics into lived experience.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <ScrollReveal direction="up">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
              About
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
              Built for the Kind of Play That Actually Matters
            </h1>
            <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed">
              BladeBound started with a simple conviction: the best tabletop experiences happen when story and mechanics work together, not against each other.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Who We Are */}
      <SectionWrapper>
        <ScrollReveal direction="up">
          <div className="max-w-3xl mb-12">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Who We Are
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-6">
              Friends First. Players Always.
            </h2>
            <div className="space-y-4 text-stone text-base leading-relaxed">
              <p>
                BladeBound is a group of friends who met in college and have been playing tabletop RPGs together since 2017.
              </p>
              <p>
                What started in 5th edition grew into a deeper exploration of tabletop systems, storytelling, and what makes a game truly engaging at the table. Over time, that exploration led us to Daggerheart, a system that aligned with how we already wanted to play: narrative-first, collaborative, and driven by meaningful choices.
              </p>
              <p>
                BladeBound exists to explore that style of play, to showcase what Daggerheart looks like in action, and to help both players and GMs engage with the system at a deeper level.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </SectionWrapper>

      <EmberDivider />

      {/* Daniel — Founder */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <ScrollReveal direction="left">
            <div>
              <div className="flex items-start gap-6 mb-8">
                <div className="relative flex-shrink-0">
                  <img
                    src="/daniel.jpg"
                    alt="Daniel, founder of BladeBound"
                    className="w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover ring-2 ring-ember/20 shadow-lg shadow-ember/10"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-ember rounded-full flex items-center justify-center shadow-md">
                    <span className="text-void text-xs font-bold">GM</span>
                  </div>
                </div>
                <div>
                  <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-2">
                    Game Master &amp; Founder
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-bone mb-2">
                    Daniel
                  </h2>
                  <p className="text-stone text-sm">Founder, Content Creator, Professional GM</p>
                </div>
              </div>
              <div className="space-y-4 text-stone text-base leading-relaxed">
                <p>
                  Daniel has been GMing for over 12 years, running games across a wide range of systems before ultimately landing on Daggerheart as his preferred system.
                </p>
                <p>
                  His experience includes systems such as The Wildsea, Dungeon Crawl Classics, Pathfinder, and Powered by the Apocalypse, each shaping his approach to pacing, player agency, and narrative design.
                </p>
                <p>
                  At BladeBound, Daniel focuses on structure, worldbuilding, and system clarity, ensuring that every game runs with intention while still leaving room for player-driven storytelling.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={200}>
            <div className="space-y-4">
              {[
                {
                  title: "Professional GM",
                  body: "Over 200 sessions run across campaigns and one-shots. Experienced with both veteran players and complete beginners.",
                },
                {
                  title: "Content Creator and Educator",
                  body: "YouTube content focused on teaching Daggerheart properly: classes, campaign frames, mechanics, GM strategy, and player tools.",
                },
                {
                  title: "Founder, BladeBound",
                  body: "Built BladeBound to serve the Daggerheart community with content, games, and resources that actually move the needle.",
                },
                {
                  title: "Narrative-First Design Philosophy",
                  body: "Every system call, session structure, and content piece starts from the same question: what serves the story?",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-shadow/10 border border-white/5 rounded-lg p-5 hover:border-ember/20 transition-colors duration-300"
                >
                  <h3 className="font-serif text-base text-bone mb-2">{item.title}</h3>
                  <p className="text-stone text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </SectionWrapper>

      <EmberDivider />

      {/* Team Members — AJ and Adam */}
      <SectionWrapper>
        <ScrollReveal direction="up">
          <div className="mb-12">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              The Team
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone">
              The Players at the Table
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 150} direction="up">
              <div className="bg-shadow/10 border border-white/5 rounded-lg p-8 hover:border-ember/20 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ember/20 to-plum/20 border border-ember/20 flex items-center justify-center">
                    <span className="font-serif text-2xl text-ember">{member.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-bone">{member.name}</h3>
                    <span className="text-ember text-xs font-semibold uppercase tracking-widest">
                      {member.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-stone text-sm leading-relaxed">
                  {member.description.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      <EmberDivider />

      {/* Why Daggerheart */}
      <SectionWrapper>
        <ScrollReveal direction="up">
          <div className="max-w-3xl">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Why This Exists
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-6">
              Why Daggerheart. Why Now.
            </h2>
            <div className="space-y-4 text-stone text-base leading-relaxed">
              <p>
                Most TTRPG content on the internet is built for the dominant systems. D&D gets the tutorials, the actual plays, the YouTube search traffic, the community infrastructure. If you want to run something else, you often have to piece it together yourself.
              </p>
              <p>
                Daggerheart deserves better than that. It is a new system doing genuinely interesting things with narrative weight, party structure, and collaborative mechanics. Players and GMs who are new to it should have a clear, high-quality resource to turn to.
              </p>
              <p>
                That is what BladeBound is. A focused, serious, craft-oriented space for people who want to play Daggerheart well and think about why it works.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </SectionWrapper>

      <EmberDivider />

      {/* What Makes It Different */}
      <SectionWrapper>
        <ScrollReveal direction="up">
          <div className="mb-10">
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              The Difference
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone">
              What Sets BladeBound Apart
            </h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Focused, Not Generic",
              body: "BladeBound is built around one system done well. Not a general TTRPG channel. Not a rotating door of content. Daggerheart, deeply.",
            },
            {
              title: "Education First",
              body: "The content is designed to actually teach you something. Rules breakdowns, GM strategy, design thinking. Real utility, not filler.",
            },
            {
              title: "Play That Delivers",
              body: "Games run here are crafted with intention. Players leave with memories, not just mechanics. That is the standard every session is held to.",
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100} direction="up">
              <div className="border-l-2 border-ember pl-5 py-1">
                <h3 className="font-serif text-lg text-bone mb-2">{item.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      <EmberDivider />

      {/* CTA */}
      <SectionWrapper tight>
        <ScrollReveal direction="up">
          <CTABlock
            label="Get Involved"
            title="Ready to See It in Action?"
            body="Watch the content, join the community, or sit at a table. Pick the path that fits where you are."
            primaryText="Watch on YouTube"
            primaryHref={LINKS.youtube}
            primaryExternal
            secondaryText="Join the Discord"
            secondaryHref={LINKS.discord}
            secondaryExternal
          />
        </ScrollReveal>
      </SectionWrapper>
    </>
  );
}
