export interface VideoItem {
  id: string;
  title: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const YT = "https://www.googleapis.com/youtube/v3";

export const CHANNEL_ID = "UCFGSz8DsBZFF5TWCQEmELUQ";
export const SAGE_TOUCHED_PLAYLIST = "PLoQqS6kdYti3BOL9CHTpTH8i3zowr4Zlt";

// Static fallbacks used when no API key is configured
export const FALLBACK_FEATURED: VideoItem[] = [
  { id: "zxPCnBOg_-8", title: "Sage Touched: The Motherboard — Daggerheart Breakdown" },
  { id: "aGegKuhWblQ", title: "Sage Touched: The Seraph — Daggerheart Class Deep Dive" },
  { id: "LHoghRxzSf4", title: "Campaign Frame Gauntlet: Age of Umbra" },
];

export const FALLBACK_SHORTS: [VideoItem, VideoItem, VideoItem] = [
  { id: "bC3wJqDQg8k", title: "GM Tip: Player Engagement" },
  { id: "JAO7da2RpV4", title: "The Golden Trio" },
  { id: "bC3wJqDQg8k", title: "GM Tip: Player Engagement" },
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

export async function getShortsVideos(): Promise<[VideoItem, VideoItem, VideoItem]> {
  if (!API_KEY) return FALLBACK_SHORTS;
  try {
    const uploadsId = await getUploadsPlaylistId(CHANNEL_ID);
    const uploads = await getPlaylistVideoDetails(uploadsId, 50);
    const shorts = uploads.filter((v) => v.duration <= 60);

    if (shorts.length === 0) return FALLBACK_SHORTS;

    const mostViewed = [...shorts].sort((a, b) => b.views - a.views)[0];
    const mostRecent = shorts[0];
    const pool = shorts.filter((v) => v.id !== mostViewed.id && v.id !== mostRecent.id);
    const random = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : shorts[Math.min(2, shorts.length - 1)];

    return [
      { id: mostViewed.id, title: mostViewed.title },
      { id: mostRecent.id, title: mostRecent.title },
      { id: random.id, title: random.title },
    ];
  } catch {
    return FALLBACK_SHORTS;
  }
}
