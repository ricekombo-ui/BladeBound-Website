"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import VideoEmbed from "@/components/ui/VideoEmbed";
import { LINKS } from "@/lib/constants";

interface FeaturedVideo {
  id: string;
  title: string;
}

const FEATURED_LABELS = [
  "Most Viewed · Sage Touched",
  "Most Recent",
  "Worth Watching",
];

const FALLBACK_VIDEOS: FeaturedVideo[] = [
  { id: "zxPCnBOg_-8", title: "Sage Touched: The Motherboard" },
  { id: "aGegKuhWblQ", title: "Sage Touched: The Seraph" },
  { id: "LHoghRxzSf4", title: "Gauntlet: Age of Umbra" },
];

export default function Hero({ featuredVideos }: { featuredVideos?: FeaturedVideo[] }) {
  const videos = featuredVideos ?? FALLBACK_VIDEOS;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Entrance triggers immediately — DualityLanding unmounts itself when done
    const timer = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-start overflow-hidden">
      {/* Layered cinematic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-void" />
        <div className="absolute inset-0 bg-gradient-to-br from-void via-shadow/20 to-plum/10 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-transparent to-void/80" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-ember/4 blur-[100px] animate-glow-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/5 w-[500px] h-[500px] rounded-full bg-crimson/5 blur-[120px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "2s" }} />
        <div className="absolute top-2/3 left-1/6 w-[400px] h-[400px] rounded-full bg-plum/8 blur-[100px] animate-glow-pulse pointer-events-none" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.5%22/%3E%3C/svg%3E')" }} />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent" />
      </div>

      {/* Hero content — pushed toward top */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-12 w-full">
        {/* Top section: headline + CTAs on left, logo on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start mb-12 md:mb-16">
          <div className="max-w-3xl">
            {/* Label */}
            <span
              className="inline-block text-ember text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(20px)",
                transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0ms",
              }}
            >
              Daggerheart Content &middot; Community &middot; Play
            </span>

            {/* Headline */}
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-[4.5rem] text-bone leading-[1.08] mb-5"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(30px)",
                transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 150ms",
              }}
            >
              Where the Story
              <br />
              <span className="text-gradient">Takes the Lead</span>
            </h1>

            {/* Subtext */}
            <p
              className="text-stone text-lg md:text-xl leading-relaxed max-w-xl mb-8"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(25px)",
                transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 350ms",
              }}
            >
              BladeBound is a home for narrative-first Daggerheart play, system education, and cinematic tabletop storytelling. Built for players who care about craft.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 mb-3"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "none" : "translateY(20px)",
                transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1) 550ms",
              }}
            >
              <Button href={LINKS.youtube} variant="primary" size="lg" external>
                Watch on YouTube
              </Button>
              <Button href={LINKS.discord} variant="secondary" size="lg" external>
                Join the Discord
              </Button>
              <Button href={LINKS.patreon} variant="ghost" size="md" external>
                Support on Patreon
              </Button>
            </div>

            <div
              style={{
                opacity: entered ? 1 : 0,
                transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1) 700ms",
              }}
            >
              <Button href="/play" variant="ghost" size="md">
                Play in a Game &rarr;
              </Button>
            </div>
          </div>

          {/* Logo on right side — large and centered in open space */}
          <div
            className="hidden lg:flex flex-col items-center justify-center px-12 xl:px-20"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "none" : "scale(0.8)",
              transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 400ms",
            }}
          >
            <div className="relative">
              <div className="absolute -inset-12 rounded-full bg-ember/5 blur-[60px] animate-glow-pulse" />
              <img
                src="/logo.png"
                alt="BladeBound"
                className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full object-cover shadow-2xl shadow-ember/20 ring-2 ring-ember/20"
              />
            </div>
            <span className="mt-5 font-serif text-xl text-bone/60 tracking-widest uppercase">
              BladeBound
            </span>
          </div>
        </div>

        {/* Featured content grid — images and links right in the hero */}
        <div
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 800ms",
          }}
        >
          <span className="inline-block text-ember/70 text-xs font-semibold uppercase tracking-widest mb-4">
            Featured Content
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((item, i) => (
              <div
                key={item.id}
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "none" : "translateY(20px)",
                  transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${900 + i * 150}ms`,
                }}
              >
                <VideoEmbed videoId={item.id} title={item.title} />
                <p className="mt-2 text-ember/70 text-[10px] font-semibold uppercase tracking-widest">
                  {FEATURED_LABELS[i] ?? ""}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Proof line */}
        <div
          className="flex flex-wrap gap-8 mt-10 pt-6 border-t border-white/5"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "none" : "translateY(15px)",
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1300ms",
          }}
        >
          {[
            { stat: "200+", label: "Games Run" },
            { stat: "Active", label: "Discord Community" },
            { stat: "Daggerheart", label: "Focused Content" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span className="text-ember font-semibold text-base">{item.stat}</span>
              <span className="text-stone/70 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
