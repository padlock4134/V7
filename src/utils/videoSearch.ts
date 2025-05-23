// Utility to search for a tutorial video using YouTube API as primary, Vimeo as backup
// Add your API keys to .env and import them here

export interface TutorialVideoResult {
  title: string;
  url: string; // embed URL
  source: 'youtube' | 'vimeo' | 'manual' | 'none';
  thumbnail?: string;
}

// YouTube Search
export async function searchYouTube(query: string): Promise<TutorialVideoResult | null> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(query)}&key=${apiKey}`;
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    if (!data.items || !data.items.length) return null;
    // Optionally: filter by view count, channel, etc.
    // TODO: Implement production video search logic.
    const video = data.items[0];
    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/embed/${video.id.videoId}`,
      source: 'youtube',
      thumbnail: video.snippet.thumbnails?.high?.url
    };
  } catch (e) {
    return null;
  }
}

// Vimeo Search
export async function searchVimeo(query: string): Promise<TutorialVideoResult | null> {
  const accessToken = import.meta.env.VITE_VIMEO_ACCESS_TOKEN;
  const endpoint = `https://api.vimeo.com/videos?query=${encodeURIComponent(query)}&per_page=3&sort=relevant`;
  try {
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json();
    if (!data.data || !data.data.length) return null;
    const video = data.data[0];
    // Vimeo embed URL: https://player.vimeo.com/video/{id}
    return {
      title: video.name,
      url: `https://player.vimeo.com/video/${video.uri.split('/').pop()}`,
      source: 'vimeo',
      thumbnail: video.pictures?.sizes?.[3]?.link
    };
  } catch (e) {
    return null;
  }
}

// Main function: Try YouTube, then Vimeo, then fallback
export async function getTutorialVideo(query: string): Promise<TutorialVideoResult> {
  let result = await searchYouTube(query);
  if (result) return result;
  result = await searchVimeo(query);
  if (result) return result;
  return {
    title: 'Video Coming Soon',
    url: '',
    source: 'none'
  };
}
