import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GiveawayForm from "@/components/sections/GiveawayForm";

export const metadata: Metadata = {
  title: "Hope & Fear Giveaway",
  description: "Enter the BladeBound Hope & Fear Giveaway — winners drawn live on stream.",
};

export default function GiveawayPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
            Hope &amp; Fear Giveaway
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
            Roll the Dice on a Prize
          </h1>
          <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed">
            Enter below for a chance to win. Winners are drawn live on stream — the wheel decides who takes home the prize.
          </p>
        </div>
      </section>

      <SectionWrapper tight>
        <div className="max-w-xl">
          <GiveawayForm />
        </div>
      </SectionWrapper>
    </>
  );
}
