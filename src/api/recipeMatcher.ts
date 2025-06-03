import { RecipeCard } from '../components/RecipeMatcherModal';

const ANTHROPIC_API_URL = '/.netlify/functions/anthropic-proxy';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// No API key in frontend; handled by Netlify function
// const anthropicKey = (import.meta as any).env.VITE_ANTHROPIC_RECIPE_KEY;
const unsplashKey = (import.meta as any).env.VITE_UNSPLASH_ACCESS_KEY;

export async function fetchRecipesWithImages(ingredients: string[], numRecipes = 5): Promise<RecipeCard[]> {
  // 1. Build the Anthropic prompt
  const prompt = `You are an expert chef. Given these ingredients: ${ingredients.join(", ")}, create ${numRecipes} creative, realistic, and delicious meal recipes. For each recipe, return a JSON object with fields: title, ingredients (array), and instructions.`;

  // 2. Call Anthropic (Claude)
  const anthropicRes = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  const anthropicData = await anthropicRes.json();
  // Try to extract JSON from Claude's response
  let recipes: any[] = [];
  try {
    const match = anthropicData.content[0].text.match(/\[.*\]/s);
    recipes = match ? JSON.parse(match[0]) : [];
  } catch {
    recipes = [];
  }
  if (!Array.isArray(recipes)) recipes = [];
  // Fallback: if Claude returns a single recipe object
  if (recipes && !Array.isArray(recipes) && typeof recipes === 'object' && 'title' in recipes) recipes = [recipes];

  // 3. For each recipe, call Unsplash in parallel
  const imagePromises = recipes.map(async (r) => {
    const q = encodeURIComponent(r.title || r.ingredients?.[0] || 'meal');
    const res = await fetch(`${UNSPLASH_API_URL}?query=${q}&client_id=${unsplashKey}&orientation=landscape&per_page=1`);
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
  });
  const images = await Promise.all(imagePromises);

  // 4. Return RecipeCards
  return recipes.slice(0, numRecipes).map((r, i) => ({
    id: `${r.title}-${i}`,
    title: r.title,
    image: images[i],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: r.instructions || '',
  }));
}
