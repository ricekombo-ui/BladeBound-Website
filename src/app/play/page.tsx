import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CTABlock from "@/components/ui/CTABlock";
import FAQAccordion from "@/components/ui/FAQAccordion";
import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Play",
  description:
    "Book a seat at a BladeBound Saga Daggerheart game. Narrative-first, beginner-friendly, professionally run one-shots and campaigns through StartPlaying.",
};

const whatToExpect = [
  {
    title: "A Real Session Zero",
    body: "Every game starts with expectations, introductions, and a clear picture of what this table is about. You know exactly what you are walking into.",
  },
  {
    title: "Narrative Weight",
    body: "Scenes are paced deliberately. Choices matter. Your character has room to breathe and moments that will stay with you after the session ends.",
  },
  {
    title: "Mechanical Grounding",
    body: "Daggerheart is used with confidence. Rules serve the story rather than interrupting it. You will leave knowing the system better than when you arrived.",
  },
  {
    title: "Collaborative Energy",
    body: "The table plays together. No lone wolves, no sidelined characters. Everyone gets their moment.",
  },
  {
    title: "Beginner Onboarding",
    body: "New to Daggerheart? No problem. Character creation guidance, rules explanations, and a GM who will help you get comfortable without slowing the table down.",
  },
  {
    title: "Strong Pacing",
    body: "Sessions start on time, stay focused, and end with intention. Downtime is used well. You are not sitting around waiting for something to happen.",
  },
];

const faqItems = [
  {
    question: "Do I need to know Daggerheart to play?",
    answer:
      "No. Complete beginners are welcome at every table. Character creation help and rules support are included. You will not feel lost or left behind.",
  },
  {
    question: "What kinds of games are available?",
    answer:
      "One-shots and short campaigns are the primary offerings. Check the StartPlaying listing for what is currently open. Tables vary by tone, campaign frame, and content level.",
  },
  {
    question: "What is the table size?",
    answer:
      "Most tables run 3 to 5 players. Smaller tables tend to allow for deeper individual character focus.",
  },
  {
    question: "What platform are games run on?",
    answer:
      "Games are run online via video call with shared digital tools. All tools and references are provided in advance.",
  },
  {
    question: "How does booking work?",
    answer:
      "Games are listed on StartPlaying. Select a game, review the description, and book your seat directly through the platform. Session details are sent via confirmation.",
  },
  {
    question: "Can I request a private or group game?",
    answer:
      "Yes. Custom tables for groups, events, or specific campaign frames are available. Use the contact page or reach out via Discord to discuss options.",
  },
];

export default function PlayPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="bg-void border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Play Daggerheart
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Sit at a Table That Takes Story Seriously
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            Narrative-first Daggerheart games run by a professional GM with over 200 sessions of experience. One-shots and campaigns. Beginners welcome.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href={LINKS.startplaying} variant="primary" size="lg" external>
              View Games on StartPlaying
            </Button>
            <Button href={LINKS.discord} variant="secondary" size="lg" external>
              Ask a Question on Discord
            </Button>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
              Who Plays Here
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-6">
              Made for Players Who Want More
            </h2>
            <div className="space-y-4 text-stone text-base leading-relaxed">
              <p>
                BladeBound games are not pickup sessions. They are built for players who want a full narrative experience: stakes, character moments, collaborative storytelling, and a GM who knows how to deliver all of it.
              </p>
              <p>
                If you have played Daggerheart before and want a table that runs it at a high level, you belong here. If you have never played and want a safe, well-structured introduction, you belong here too.
              </p>
              <p>
                There is one standard: show up ready to engage with the story and your fellow players. The rest is handled.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "New to Daggerheart or TTRPGs entirely",
              "Experienced players looking for narrative-first play",
              "Groups who want a one-shot for a specific campaign frame",
              "Players who have seen the content and want the live experience",
              "Anyone who wants to play without running",
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

      {/* What to Expect */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            What You Get
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
            What Every Table Includes
          </h2>
          <p className="text-stone text-base md:text-lg max-w-xl">
            These are not promises. They are the baseline for every game run at BladeBound.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatToExpect.map((item) => (
            <div
              key={item.title}
              className="bg-shadow/10 border border-white/5 rounded-lg p-5 hover:border-ember/20 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-ember mb-3" />
              <h3 className="font-serif text-base text-bone mb-2">{item.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* Book CTA */}
      <SectionWrapper tight>
        <CTABlock
          label="Book a Seat"
          title="Ready to Play?"
          body="All games are listed and booked through StartPlaying. Find a table that fits your schedule and claim your seat."
          primaryText="Book a Seat on StartPlaying"
          primaryHref={LINKS.startplaying}
          primaryExternal
          secondaryText="Questions? Join the Discord"
          secondaryHref={LINKS.discord}
          secondaryExternal
        />
      </SectionWrapper>

      {/* Divider */}
      <div className="section-divider" />

      {/* FAQ */}
      <SectionWrapper>
        <div className="mb-10">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-3">
            FAQ
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            Common Questions
          </h2>
        </div>
        <div className="max-w-3xl">
          <FAQAccordion items={faqItems} />
        </div>
      </SectionWrapper>
    </>
  );
}
