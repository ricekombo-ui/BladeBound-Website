export interface VideoItem {
  id: string;
  title: string;
}

const API_KEY = process.env.YOUTUBE_API_KEY;
const YT = "https://www.googleapis.com/youtube/v3";

export const CHANNEL_ID = "UCFGSz8DsBZFF5TWCQEmELUQ";
export const SAGE_TOUCHED_PLAYLIST = "PLoQqS6kdYti3BOL9CHTpTH8i3zowr4Zlt";
export const SHORTS_PLAYLIST = "PLoQqS6kdYti0oVPC5MSaztU80cgrZiLuK";

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

interface VideoDetail {
  id: string;
  title: string;
  duration: number;
  views: number;
  publishedAt: string;
}

async function getUploadsPlaylistId(channelId: string): Promise<string> {
  const data = await ytFetch("channels", { part: "contentDetails", id: channelId });
  return data.items[0].contentDetails.relatedPlaylists.uploads as string;
}

// Returns videos in playlist order (uploads playlist = newest first).
// Re-maps video details back onto the original playlist order so [0] is always newest.
async function getPlaylistVideoDetails(
  playlistId: string,
  maxResults = 50
): Promise<VideoDetail[]> {
  const items = await ytFetch("playlistItems", {
    part: "contentDetails",
    playlistId,
    maxResults: String(maxResults),
  });

  const orderedIds: string[] = (
    items.items as { contentDetails: { videoId: string } }[]
  ).map((i) => i.contentDetails.videoId);

  if (orderedIds.length === 0) return [];

  const details = await ytFetch("videos", {
    part: "snippet,statistics,contentDetails",
    id: orderedIds.join(","),
  });

  type RawVideo = {
    id: string;
    snippet: { title: string; publishedAt: string };
    statistics: { viewCount?: string };
    contentDetails: { duration: string };
  };

  const detailMap = new Map<string, RawVideo>(
    (details.items as RawVideo[]).map((v) => [v.id, v])
  );

  // Restore playlist order — critical for "most recent" to be correct
  return orderedIds
    .map((id) => detailMap.get(id))
    .filter((v): v is RawVideo => v != null)
    .map((v) => ({
      id: v.id,
      title: v.snippet.title,
      duration: parseIsoDuration(v.contentDetails.duration),
      views: parseInt(v.statistics.viewCount || "0"),
      publishedAt: v.snippet.publishedAt,
    }));
}

export async function getFeaturedVideos(): Promise<VideoItem[]> {
  if (!API_KEY) return FALLBACK_FEATURED;
  try {
    // 1. Most viewed from Sage Touched playlist
    const playlistVideos = await getPlaylistVideoDetails(SAGE_TOUCHED_PLAYLIST);
    const mostViewed = [...playlistVideos].sort((a, b) => b.views - a.views)[0];

    // 2. Most recent from channel (long-form only, sorted by publishedAt desc)
    const uploadsId = await getUploadsPlaylistId(CHANNEL_ID);
    const uploads = await getPlaylistVideoDetails(uploadsId, 50);
    const longForm = uploads
      .filter((v) => v.duration > 60)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)); // newest first

    const mostRecent = longForm[0];

    // 3. Random long-form — different from most viewed and most recent
    const pool = longForm.filter(
      (v) => v.id !== mostViewed?.id && v.id !== mostRecent?.id
    );
    const random =
      pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : longForm.find((v) => v.id !== mostRecent?.id) ?? longForm[1];

    return [
      mostViewed ? { id: mostViewed.id, title: mostViewed.title } : FALLBACK_FEATURED[0],
      mostRecent ? { id: mostRecent.id, title: mostRecent.title } : FALLBACK_FEATURED[1],
      random ? { id: random.id, title: random.title } : FALLBACK_FEATURED[2],
    ];
  } catch {
    return FALLBACK_FEATURED;
  }
}

// Returns all shorts from the dedicated shorts playlist, ordered:
// [0] most viewed  [1] most recent (by publishedAt)  [2] random (≠ 0 and ≠ 1)  [3+] rest
export async function getShortsFromPlaylist(): Promise<VideoItem[]> {
  if (!API_KEY) return FALLBACK_SHORTS;
  try {
    const all = await getPlaylistVideoDetails(SHORTS_PLAYLIST, 50);
    if (all.length === 0) return FALLBACK_SHORTS;

    // Most viewed
    const byViews = [...all].sort((a, b) => b.views - a.views);
    const mostViewed = byViews[0];

    // Most recent by publish date
    const byDate = [...all].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    const mostRecent = byDate[0];

    // Random — must differ from both
    const pool = all.filter(
      (v) => v.id !== mostViewed.id && v.id !== mostRecent.id
    );

    let random: VideoDetail;
    if (pool.length > 0) {
      random = pool[Math.floor(Math.random() * pool.length)];
    } else if (all.length >= 3) {
      // If all[0] and all[1] are the top 2, pick all[2]
      random = all.find((v) => v.id !== mostViewed.id && v.id !== mostRecent.id) ?? byViews[1];
    } else {
      // Only 1 or 2 unique videos — use a duplicate as last resort
      random = all[all.length - 1];
    }

    // Remaining shorts (not already in top 3 positions)
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
