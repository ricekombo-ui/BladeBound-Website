import Button from "@/components/ui/Button";
import { LINKS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-void">
        <div className="absolute inset-0 bg-gradient-to-br from-void via-shadow/30 to-void opacity-80" />
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-ember/5 blur-3xl animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-shadow/20 blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-2/3 left-1/6 w-[300px] h-[300px] rounded-full bg-plum/10 blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: "4s" }} />
        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ember/30 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-block text-ember text-xs font-semibold uppercase tracking-widest mb-6 opacity-0 animate-fade-in-up">
            Daggerheart Content and Community
          </span>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-bone leading-[1.1] mb-6 opacity-0 animate-fade-in-up animation-delay-200">
            Where the Story
            <br />
            <span className="text-gradient">Takes the Lead</span>
          </h1>

          <p className="text-stone text-lg md:text-xl leading-relaxed max-w-xl mb-10 opacity-0 animate-fade-in-up animation-delay-400">
            BladeBound is a home for narrative-first Daggerheart play, system education, and cinematic tabletop storytelling. Built for players who care about craft.
          </p>

          {/* Primary platform CTAs */}
          <div className="flex flex-wrap gap-4 mb-6 opacity-0 animate-fade-in-up animation-delay-600">
            <Button href={LINKS.youtube} variant="primary" size="lg" external>
              Watch on YouTube
            </Button>
            <Button href={LINKS.discord} variant="secondary" size="lg" external>
              Join the Discord
            </Button>
            <Button href={LINKS.patreon} variant="secondary" size="lg" external>
              Support on Patreon
            </Button>
          </div>

          {/* Secondary action */}
          <div className="opacity-0 animate-fade-in-up animation-delay-600">
            <Button href="/play" variant="ghost" size="md">
              Play in a Game &rarr;
            </Button>
          </div>

          {/* Proof badges */}
          <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/5">
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
