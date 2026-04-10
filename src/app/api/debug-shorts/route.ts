import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const YT = "https://www.googleapis.com/youtube/v3";
const CHANNEL_ID = "UCFGSz8DsBZFF5TWCQEmELUQ";
const SHORTS_PLAYLIST = "PLoQqS6kdYti0oVPC5MSaztU80cgrZiLuK";

async function ytFetch(path: string, params: Record<string, string>) {
  const url = new URL(`${YT}/${path}`);
  url.searchParams.set("key", API_KEY!);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { cache: "no-store" });
  const json = await res.json();
  return { status: res.status, data: json };
}

function parseIsoDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return parseInt(m[1] || "0") * 3600 + parseInt(m[2] || "0") * 60 + parseInt(m[3] || "0");
}

export async function GET() {
  if (!API_KEY) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const results: Record<string, unknown> = {};

  // 1. Shorts playlist items
  const playlistRes = await ytFetch("playlistItems", {
    part: "contentDetails",
    playlistId: SHORTS_PLAYLIST,
    maxResults: "50",
  });
  results.shortsPlaylist = {
    status: playlistRes.status,
    totalResults: playlistRes.data?.pageInfo?.totalResults,
    count: playlistRes.data?.items?.length,
    ids: playlistRes.data?.items?.map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId),
  };

  // 2. Get video details for playlist items
  if (playlistRes.data?.items?.length > 0) {
    const ids = playlistRes.data.items
      .map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId)
      .join(",");
    const vidRes = await ytFetch("videos", {
      part: "snippet,statistics,contentDetails",
      id: ids,
    });
    results.playlistVideoDetails = vidRes.data?.items?.map((v: {
      id: string;
      snippet: { title: string; publishedAt: string };
      statistics: { viewCount?: string };
      contentDetails: { duration: string };
    }) => ({
      id: v.id,
      title: v.snippet.title,
      publishedAt: v.snippet.publishedAt,
      duration: v.contentDetails.duration,
      durationSeconds: parseIsoDuration(v.contentDetails.duration),
      views: v.statistics.viewCount,
    }));
  }

  // 3. Channel uploads playlist ID
  const channelRes = await ytFetch("channels", {
    part: "contentDetails",
    id: CHANNEL_ID,
  });
  const uploadsId = channelRes.data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  results.uploadsPlaylistId = uploadsId;

  // 4. Recent uploads (check for shorts)
  if (uploadsId) {
    const uploadsRes = await ytFetch("playlistItems", {
      part: "contentDetails",
      playlistId: uploadsId,
      maxResults: "50",
    });
    const uploadIds = uploadsRes.data?.items
      ?.map((i: { contentDetails: { videoId: string } }) => i.contentDetails.videoId)
      .join(",");

    if (uploadIds) {
      const uploadVidRes = await ytFetch("videos", {
        part: "snippet,statistics,contentDetails",
        id: uploadIds,
      });
      const allVideos = uploadVidRes.data?.items?.map((v: {
        id: string;
        snippet: { title: string; publishedAt: string };
        statistics: { viewCount?: string };
        contentDetails: { duration: string };
      }) => ({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        duration: v.contentDetails.duration,
        durationSeconds: parseIsoDuration(v.contentDetails.duration),
        views: v.statistics.viewCount,
        isShort: parseIsoDuration(v.contentDetails.duration) <= 60,
        isShort90: parseIsoDuration(v.contentDetails.duration) <= 90,
      }));
      results.recentUploadsTotal = allVideos?.length;
      results.shortVideos60s = allVideos?.filter((v: { isShort: boolean }) => v.isShort);
      results.shortVideos90s = allVideos?.filter((v: { isShort90: boolean }) => v.isShort90);
    }
  }

  // 5. Search API for shorts
  const searchRes = await ytFetch("search", {
    part: "id,snippet",
    channelId: CHANNEL_ID,
    type: "video",
    videoDuration: "short",
    maxResults: "25",
    order: "viewCount",
  });
  results.searchShorts = {
    status: searchRes.status,
    count: searchRes.data?.items?.length,
    items: searchRes.data?.items?.map((i: {
      id: { videoId: string };
      snippet: { title: string; publishedAt: string };
    }) => ({
      id: i.id.videoId,
      title: i.snippet.title,
      publishedAt: i.snippet.publishedAt,
    })),
  };

  return NextResponse.json(results, { status: 200 });
}
