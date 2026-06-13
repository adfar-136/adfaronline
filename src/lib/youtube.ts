export function getYouTubeVideoId(url: string): string | null {
  if (!url || url === "#") return null;
  
  // Regex to match standard/short/embed YouTube video URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  
  // Backup: query parameter search
  try {
    const urlObj = new URL(url);
    const v = urlObj.searchParams.get("v");
    if (v && v.length === 11) return v;
  } catch {
    // Ignore URL parse errors
  }
  
  return null;
}

export function getYouTubePlaylistId(url: string): string | null {
  if (!url || url === "#") return null;
  
  try {
    const urlObj = new URL(url);
    const list = urlObj.searchParams.get("list");
    if (list) return list;
  } catch {
    // Ignore URL parse errors
  }
  
  // Try regex in case of embed/playlist links
  const regExp = /[?&]list=([^#\&\?]+)/;
  const match = url.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

/**
 * Fetches the YouTube playlist page server-side and parses the first video ID.
 */
export async function getPlaylistFirstVideoId(playlistId: string): Promise<string | null> {
  if (!playlistId) return null;
  
  try {
    const url = `https://www.youtube.com/playlist?list=${playlistId}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 86400 } // Cache the response for 24 hours in Next.js
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch playlist ${playlistId}: ${response.statusText}`);
      return null;
    }
    
    const html = await response.text();
    
    // 1. Try to find inside the JSON structure: playlistVideoRenderer
    const playlistVideoMatch = html.match(/"playlistVideoRenderer"\s*:\s*\{\s*"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
    if (playlistVideoMatch && playlistVideoMatch[1]) {
      return playlistVideoMatch[1];
    }
    
    // 2. Try to find standard videoId key
    const videoIdMatch = html.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
    if (videoIdMatch && videoIdMatch[1]) {
      return videoIdMatch[1];
    }
    
    // 3. Try watch links in HTML
    const hrefMatch = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1];
    }
  } catch (error) {
    console.error("Error scraping first video ID of YouTube playlist:", error);
  }
  
  return null;
}

/**
 * Main helper to resolve YouTube thumbnail dynamically.
 * Returns null if not a YouTube URL or if it cannot be resolved.
 */
export async function resolveYouTubeThumbnail(url: string): Promise<string | null> {
  if (!url || url === "#") return null;
  
  // 1. Check if it's a video link first
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }
  
  // 2. If it's a playlist link, get first video ID
  const playlistId = getYouTubePlaylistId(url);
  if (playlistId) {
    const firstVid = await getPlaylistFirstVideoId(playlistId);
    if (firstVid) {
      return `https://i.ytimg.com/vi/${firstVid}/hqdefault.jpg`;
    }
  }
  
  return null;
}
