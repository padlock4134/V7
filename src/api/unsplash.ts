// Unsplash API integration for PorkChop
// Requires VITE_UNSPLASH_ACCESS_KEY in .env

export async function getRecipeImage(query: string): Promise<string> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey) throw new Error('Unsplash API key missing');
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&orientation=landscape&per_page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Unsplash API error');
  const data = await res.json();
  return data.results?.[0]?.urls?.regular || '/placeholder.jpg';
}
