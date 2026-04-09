"use client";

import { useRef, useState } from "react";
import type { VideoItem } from "@/lib/youtube";

interface ShortsWheelProps {
  shorts: [VideoItem, VideoItem, VideoItem];
  labels: [string, string, string];
}

function extractId(id: string): string {
  return id;
}

function ShortCard({ video, label }: { video: VideoItem; label: string }) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;

  return (
    <div className="flex-none w-[200px] flex flex-col gap-2">
      <div className="relative group overflow-hidden rounded-xl bg-void border border-white/5 hover:border-ember/30 transition-all duration-300 aspect-[9/16]">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="relative w-full h-full cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            <img
              src={thumbUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-void/40 group-hover:bg-void/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-ember/90 flex items-center justify-center shadow-xl shadow-ember/30 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-void ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-void/95 to-transparent">
              <p className="text-bone text-xs font-medium line-clamp-2 leading-snug">{video.title}</p>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
      <span className="text-ember text-[10px] font-semibold uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
}

export default function ShortsWheel({ shorts, labels }: ShortsWheelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 240 : -240, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-8 z-10 w-9 h-9 rounded-full bg-void/80 border border-white/10 flex items-center justify-center text-stone hover:text-ember hover:border-ember/30 transition-all duration-200 -translate-x-4 md:flex hidden"
        aria-label="Scroll left"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {shorts.map((short, i) => (
          <div key={`${short.id}-${i}`} className="snap-start">
            <ShortCard video={short} label={labels[i]} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-8 z-10 w-9 h-9 rounded-full bg-void/80 border border-white/10 flex items-center justify-center text-stone hover:text-ember hover:border-ember/30 transition-all duration-200 translate-x-4 md:flex hidden"
        aria-label="Scroll right"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Hide scrollbar for webkit */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
