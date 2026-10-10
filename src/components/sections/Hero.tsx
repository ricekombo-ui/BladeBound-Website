"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import VideoEmbed from "@/components/ui/VideoEmbed";
import { LINKS } from "@/lib/constants";

interface FeaturedVideo {
  id: string;
  title: string;
}

const FALLBACK_VIDEOS: FeaturedVideo[] = [
  { id: "zxPCnBOg_-8", title: "Sage Touched: The Motherboard" },
  { id: "aGegKuhWblQ", title: "Sage Touched: The Seraph" },
  { id: "LHoghRxzSf4", title: "Gauntlet: Age of Umbra" },
];

const reveal = (entered: boolean, delay: number, distance = 24) => ({
  opacity: entered ? 1 : 0,
  transform: entered ? "none" : `translateY(${distance}px)`,
  transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
});

export default function Hero({ featuredVideos }: { featuredVideos?: FeaturedVideo[] }) {
  const videos = featuredVideos ?? FALLBACK_VIDEOS;
  // Order from getFeaturedVideos(): [most viewed, most recent, worth watching].
  // The most recent gets the big hero card, so it must not repeat in the row below.
  const [mostViewed, latest, worthWatching] = [videos[0], videos[1] ?? videos[0], videos[2]];
  const moreToWatch = [
    { video: mostViewed, label: "Most viewed" },
    { video: worthWatching, label: "Worth watching" },
  ].filter((item) => item.video && item.video.id !== latest.id);

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Entrance triggers immediately; DualityLanding unmounts itself when done
    const timer = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-void" />
        <div className="absolute inset-0 bg-gradient-to-br from-void via-shadow/20 to-plum/10 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/80" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-ember/4 blur-[100px] animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/5 w-[500px] h-[500px] rounded-full bg-crimson/5 blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-16 md:pb-24 w-full">
        {/* Headline + CTAs on the left, latest episode on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] gap-10 lg:gap-16 items-center mb-14 md:mb-20">
          <div>
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-[3.4rem] text-bone leading-[1.12] mb-5"
              style={reveal(entered, 100, 30)}
            >
              Where the Story
              <br />
              <span className="text-ember">Takes the Lead</span>
            </h1>

            <p
              className="text-stone text-lg md:text-xl leading-relaxed max-w-xl mb-8"
              style={reveal(entered, 250)}
            >
              BladeBound is a home for narrative-first Daggerheart play, system education, and cinematic tabletop storytelling. Built for players who care about craft.
            </p>

            <div className="flex flex-wrap gap-4" style={reveal(entered, 400)}>
              <Button href={LINKS.youtube} variant="primary" size="lg" external>
                Watch on YouTube
              </Button>
              <Button href="/play" variant="secondary" size="lg">
                Play in a Game
              </Button>
            </div>
          </div>

          {/* Latest episode */}
          <div style={reveal(entered, 350, 30)}>
            <a
              href={`https://www.youtube.com/watch?v=${latest.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 group-hover:border-ember/40 transition-colors">
                <img
                  src={`https://i.ytimg.com/vi/${latest.id}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-ember text-void text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  Latest episode
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-ember flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-void ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>
              <p className="mt-3 text-bone text-base font-medium leading-snug group-hover:text-ember transition-colors">
                {latest.title}
              </p>
            </a>
          </div>
        </div>

        {/* More to watch: titles sit below the thumbnails, never on top of thumbnail art */}
        {moreToWatch.length > 0 && (
          <div style={reveal(entered, 550)}>
            <h2 className="font-serif text-xl text-bone mb-5">More to watch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {moreToWatch.map(({ video, label }) => (
                <div key={video.id}>
                  <VideoEmbed videoId={video.id} title={video.title} overlayTitle={false} />
                  <p className="mt-3 text-ember text-xs font-semibold uppercase tracking-wider">{label}</p>
                  <p className="mt-1 text-bone text-base leading-snug">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
