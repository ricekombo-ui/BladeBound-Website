import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Daniel and the story behind BladeBound, a Daggerheart-focused content brand built around narrative-first play.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            About
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Built for the Kind of Play That Actually Matters
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed">
            BladeBound started with a simple conviction: the best tabletop experiences happen when story and mechanics work together, not against each other.
          </p>
        </div>
      </section>

      {/* About Daniel */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            {/* Photo + intro */}
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
                  The GM Behind the Brand
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-bone mb-2">
                  Hi. I am Daniel.
                </h2>
                <p className="text-stone text-sm">Founder, Content Creator, Professional GM</p>
              </div>
            </div>
            <div className="space-y-4 text-stone text-base leading-relaxed">
              <p>
                I have been running tabletop RPGs for years. More than 200 sessions across campaigns, one-shots, pick-up games, and professional tables. I have seen what works, what breaks immersion, and what sends players home with a story they will retell for months.
              </p>
              <p>
                When Daggerheart arrived, something clicked. The system is built for the kind of play I had been trying to run all along: collaborative, narrative-forward, mechanically interesting without suffocating the fiction. I knew it immediately.
              </p>
              <p>
                So I went deep. I learned the system inside out. I built content around it. I started running professional games through StartPlaying. And eventually, BladeBound became the brand that holds all of that work together.
              </p>
              <p>
                I am not just a fan who picked up a new system. I am a content creator, an educator, and a professional GM who takes the craft seriously. Every video, every guide, every session at a BladeBound table reflects that.
              </p>
            </div>
          </div>

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
                className="bg-shadow/10 border border-white/5 rounded-lg p-5 hover:border-ember/20 transition-colors"
              >
                <h3 className="font-serif text-base text-bone mb-2">{item.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Why BladeBound */}
      <SectionWrapper>
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
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* What Makes It Different */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            The Difference
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            What Sets BladeBound Apart
          </h2>
        </div>
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
          ].map((item) => (
            <div
              key={item.title}
              className="border-l-2 border-ember pl-5 py-1"
            >
              <h3 className="font-serif text-lg text-bone mb-2">{item.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* CTA */}
      <SectionWrapper tight>
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
      </SectionWrapper>
    </>
  );
}
