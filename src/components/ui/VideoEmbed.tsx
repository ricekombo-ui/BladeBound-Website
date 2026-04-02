"use client";

import { useState } from "react";

interface VideoEmbedProps {
  videoId: string;
  title: string;
  thumbnail?: string;
  isShort?: boolean;
}

function extractYouTubeId(url: string): string {
  // Handle youtu.be/ID, youtube.com/watch?v=ID, youtube.com/shorts/ID
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url;
}

export default function VideoEmbed({
  videoId,
  title,
  thumbnail,
  isShort = false,
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const id = extractYouTubeId(videoId);
  const thumbUrl = thumbnail || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div className={`relative group overflow-hidden rounded-lg bg-void border border-white/5 hover:border-ember/20 transition-all duration-300 ${isShort ? "aspect-[9/16] max-w-[240px]" : "aspect-video"}`}>
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full h-full cursor-pointer"
          aria-label={`Play ${title}`}
        >
          <img
            src={thumbUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-void/40 group-hover:bg-void/20 transition-colors duration-300" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-ember/90 flex items-center justify-center shadow-xl shadow-ember/30 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-void ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void/90 to-transparent">
            <p className="text-bone text-sm font-medium">{title}</p>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
