import type { Metadata } from "next";
import SectionWrapper from "@/components/ui/SectionWrapper";
import GiveawayForm from "@/components/sections/GiveawayForm";
import VideoEmbed from "@/components/ui/VideoEmbed";

export const metadata: Metadata = {
  title: "Hope & Fear Giveaway",
  description: "Enter the BladeBound Hope & Fear Giveaway. Winner drawn live on stream August 25th.",
};

export default function GiveawayPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-4">
                Hope &amp; Fear Giveaway
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone max-w-3xl leading-tight mb-6">
                Roll the Dice on a Prize
              </h1>
              <p className="text-stone text-lg md:text-xl max-w-2xl leading-relaxed mb-4">
                Enter below for a chance to win the Daggerheart Hope &amp; Fear expansion. The winner is drawn live on stream, August 25th at 8pm EST.
              </p>
              <p className="text-stone/70 text-sm max-w-2xl leading-relaxed">
                Must be 18 years or older to enter. Prize can only be shipped to an address within the United States.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/giveaway/hope-and-fear-book.png"
                alt="Daggerheart Hope & Fear expansion book and cards"
                className="w-64 md:w-80 h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionWrapper tight>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <GiveawayForm />
          <div>
            <span className="inline-block text-ember/70 text-xs font-semibold uppercase tracking-widest mb-4">
              Watch
            </span>
            <VideoEmbed videoId="https://youtu.be/heeZhfGo85I" title="Hope & Fear Giveaway" />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
