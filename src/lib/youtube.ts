export interface VideoItem {
  id: string;
  title: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const YT = "https://www.googleapis.com/youtube/v3";

export const CHANNEL_ID = "UCFGSz8DsBZFF5TWCQEmELUQ";
export const SAGE_TOUCHED_PLAYLIST = "PLoQqS6kdYti3BOL9CHTpTH8i3zowr4Zlt";
export const SHORTS_PLAYLIST = "PLoQqS6kdYti0oVPC5MSaztU80cgrZiLuK";

// Static fallbacks used when no API key is configured
export const FALLBACK_FEATURED: VideoItem[] = [
  { id: "zxPCnBOg_-8", title: "Sage Touched: The Motherboard — Daggerheart Breakdown" },
  { id: "aGegKuhWblQ", title: "Sage Touched: The Seraph — Daggerheart Class Deep Dive" },
  { id: "LHoghRxzSf4", title: "Campaign Frame Gauntlet: Age of Umbra" },
];

export const FALLBACK_SHORTS: VideoItem[] = [
  { id: "bC3wJqDQg8k", title: "GM Tip: Player Engagement" },
  { id: "JAO7da2RpV4", title: "The Golden Trio" },
];

async function ytFetch(path: string, params: Record<string, string>) {
  if (!API_KEY) throw new Error("YOUTUBE_API_KEY not set");
  const url = new URL(`${YT}/${path}`);
  url.searchParams.set("key", API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube API ${res.status}: ${await res.text()}`);
  return res.json();
}

function parseIsoDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return parseInt(m[1] || "0") * 3600 + parseInt(m[2] || "0") * 60 + parseInt(m[3] || "0");
}

async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const data = await ytFetch("channels", { part: "contentDetails", id: channelId });
  return data.items[0].contentDetails.relatedPlaylists.uploads as string;
}

async function getPlaylistVideoDetails(
  playlistId: string,
  maxResults = 50
): Promise<{ id: string; title: string; duration: number; views: number }[]> {
  const items = await ytFetch("playlistItems", {
    part: "contentDetails",
    playlistId,
    maxResults: String(maxResults),
  });
  const ids = (items.items as { contentDetails: { videoId: string } }[])
    .map((i) => i.contentDetails.videoId)
    .join(",");

  const details = await ytFetch("videos", {
    part: "snippet,statistics,contentDetails",
    id: ids,
  });

  return (details.items as {
    id: string;
    snippet: { title: string };
    statistics: { viewCount?: string };
    contentDetails: { duration: string };
  }[]).map((v) => ({
    id: v.id,
    title: v.snippet.title,
    duration: parseIsoDuration(v.contentDetails.duration),
    views: parseInt(v.statistics.viewCount || "0"),
  }));
}

export async function getFeaturedVideos(): Promise<VideoItem[]> {
  if (!API_KEY) return FALLBACK_FEATURED;
  try {
    // 1. Most viewed from Sage Touched playlist
    const playlistVideos = await getPlaylistVideoDetails(SAGE_TOUCHED_PLAYLIST);
    const mostViewed = [...playlistVideos].sort((a, b) => b.views - a.views)[0];

    // 2 & 3. Most recent + random from channel uploads (non-shorts only)
    const uploadsId = await getUploadsPlaylistId(CHANNEL_ID);
    const uploads = await getPlaylistVideoDetails(uploadsId, 50);
    const longForm = uploads.filter((v) => v.duration > 60);

    const mostRecent = longForm[0];
    const pool = longForm.filter((v) => v.id !== mostRecent?.id);
    const random = pool[Math.floor(Math.random() * pool.length)] || longForm[1];

    return [
      mostViewed ? { id: mostViewed.id, title: mostViewed.title } : FALLBACK_FEATURED[0],
      mostRecent ? { id: mostRecent.id, title: mostRecent.title } : FALLBACK_FEATURED[1],
      random ? { id: random.id, title: random.title } : FALLBACK_FEATURED[2],
    ];
  } catch {
    return FALLBACK_FEATURED;
  }
}

// Returns all shorts from the shorts playlist, ordered:
// [0] most viewed, [1] most recent, [2] random (≠ 0 and ≠ 1), then the rest in playlist order
export async function getShortsFromPlaylist(): Promise<VideoItem[]> {
  if (!API_KEY) return FALLBACK_SHORTS;
  try {
    const all = await getPlaylistVideoDetails(SHORTS_PLAYLIST, 50);
    if (all.length === 0) return FALLBACK_SHORTS;

    // Most viewed
    const mostViewed = [...all].sort((a, b) => b.views - a.views)[0];

    // Most recent (first in playlist, which is ordered newest first)
    const mostRecent = all[0];

    // Random — must differ from both
    const pool = all.filter((v) => v.id !== mostViewed.id && v.id !== mostRecent.id);
    const random = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : all.find((v) => v.id !== mostViewed.id) ?? all[0];

    // Remaining (everything not already in the top 3)
    const topIds = new Set([mostViewed.id, mostRecent.id, random.id]);
    const rest = all.filter((v) => !topIds.has(v.id));

    return [
      { id: mostViewed.id, title: mostViewed.title },
      { id: mostRecent.id, title: mostRecent.title },
      { id: random.id, title: random.title },
      ...rest.map((v) => ({ id: v.id, title: v.title })),
    ];
  } catch {
    return FALLBACK_SHORTS;
  }
}
