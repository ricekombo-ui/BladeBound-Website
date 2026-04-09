"use client";

import { useState } from "react";
import type { VideoItem } from "@/lib/youtube";

const SLOT_LABELS: Record<number, string> = {
  0: "Most Viewed Short",
  1: "Most Recent Short",
  2: "Worth Watching",
};

function ShortThumbnail({
  video,
  onClick,
  side,
}: {
  video: VideoItem;
  onClick: () => void;
  side: "left" | "right";
}) {
  const thumbUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  return (
    <button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl border border-white/5 hover:border-ember/30 transition-all duration-300 aspect-[9/16] w-28 md:w-36 flex-none cursor-pointer opacity-60 hover:opacity-90 ${
        side === "left" ? "hover:translate-x-1" : "hover:-translate-x-1"
      }`}
      aria-label={`Show: ${video.title}`}
    >
      <img
        src={thumbUrl}
        alt={video.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-void/50 group-hover:bg-void/30 transition-colors duration-300" />
      {/* Arrow hint */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-ember/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            className={`w-4 h-4 text-void ${side === "right" ? "ml-0.5" : "mr-0.5"}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {side === "right" ? (
              <path d="M8 5v14l11-7z" />
            ) : (
              <path d="M16 5v14L5 12z" />
            )}
          </svg>
        </div>
      </div>
    </button>
  );
}

function ShortCenter({ video }: { video: VideoItem }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ember/20 shadow-2xl shadow-ember/10 aspect-[9/16] w-48 md:w-56 flex-none">
      <iframe
        key={video.id}
        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export default function ShortsWheel({ shorts }: { shorts: VideoItem[] }) {
  const [centerIndex, setCenterIndex] = useState(0);

  if (shorts.length === 0) return null;

  const n = shorts.length;
  const prevIdx = (centerIndex - 1 + n) % n;
  const nextIdx = (centerIndex + 1) % n;

  const goLeft = () => setCenterIndex(prevIdx);
  const goRight = () => setCenterIndex(nextIdx);

  const centerLabel = SLOT_LABELS[centerIndex] ?? null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Carousel row */}
      <div className="flex items-center justify-center gap-3 md:gap-5 w-full">
        {/* Left nav arrow */}
        <button
          onClick={goLeft}
          className="w-9 h-9 flex-none rounded-full bg-void border border-white/10 flex items-center justify-center text-stone hover:text-ember hover:border-ember/30 transition-all duration-200"
          aria-label="Previous short"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Left thumbnail */}
        <ShortThumbnail
          key={`left-${shorts[prevIdx].id}`}
          video={shorts[prevIdx]}
          onClick={goLeft}
          side="left"
        />

        {/* Center — large, autoplay */}
        <ShortCenter key={shorts[centerIndex].id} video={shorts[centerIndex]} />

        {/* Right thumbnail */}
        <ShortThumbnail
          key={`right-${shorts[nextIdx].id}`}
          video={shorts[nextIdx]}
          onClick={goRight}
          side="right"
        />

        {/* Right nav arrow */}
        <button
          onClick={goRight}
          className="w-9 h-9 flex-none rounded-full bg-void border border-white/10 flex items-center justify-center text-stone hover:text-ember hover:border-ember/30 transition-all duration-200"
          aria-label="Next short"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Label + title below center */}
      <div className="text-center">
        {centerLabel && (
          <p className="text-ember text-[10px] font-semibold uppercase tracking-widest mb-1">
            {centerLabel}
          </p>
        )}
        <p className="text-stone text-xs max-w-[240px] line-clamp-2 leading-snug">
          {shorts[centerIndex].title}
        </p>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {shorts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCenterIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === centerIndex
                ? "w-4 h-1.5 bg-ember"
                : "w-1.5 h-1.5 bg-stone/30 hover:bg-stone/60"
            }`}
            aria-label={`Go to short ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
