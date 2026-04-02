import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 bg-void">
        <div className="absolute inset-0 bg-gradient-to-br from-void via-shadow/30 to-void opacity-80" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ember/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ember/20 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-6">
            Daggerheart Content and Community
          </span>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-bone leading-[1.1] mb-6">
            Where the Story
            <br />
            <span className="text-gradient">Takes the Lead</span>
          </h1>

          <p className="text-stone text-lg md:text-xl leading-relaxed max-w-xl mb-10">
            BladeBound Saga is a home for narrative-first Daggerheart play, system education, and cinematic tabletop storytelling. Built for players who care about craft.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href={LINKS.discord} variant="primary" size="lg" external>
              Join the Community
            </Button>
            <Button href={LINKS.youtube} variant="secondary" size="lg" external>
              Watch on YouTube
            </Button>
            <Button href="/play" variant="ghost" size="lg">
              Play in a Game
            </Button>
          </div>

          {/* Proof badges */}
          <div className="flex flex-wrap gap-6 mt-14 pt-8 border-t border-white/5">
            {[
              { stat: "200+", label: "Games Run" },
              { stat: "Active", label: "Discord Community" },
              { stat: "Daggerheart", label: "Focused Content" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-ember font-semibold text-base">{item.stat}</span>
                <span className="text-stone text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
