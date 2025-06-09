import { RecipeCard } from '../components/RecipeMatcherModal';

const ANTHROPIC_API_URL = '/.netlify/functions/anthropic-proxy';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// No API key in frontend; handled by Netlify function
// const anthropicKey = (import.meta as any).env.VITE_ANTHROPIC_RECIPE_KEY;
const unsplashKey = (import.meta as any).env.VITE_UNSPLASH_ACCESS_KEY;

export async function fetchRecipesWithImages(ingredients: string[], numRecipes = 5): Promise<RecipeCard[]> {
  // 1. Build the Anthropic prompt
  const prompt = `You are an expert chef. Create ${numRecipes} unique recipes using ONLY these ingredients: ${ingredients.join(", ")}. 

Each recipe MUST be realistic and use at least 2-3 of the provided ingredients. Format your response as a JSON array of recipe objects. Each recipe object MUST have these exact fields:
{
  "title": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...]
}

Return ONLY the JSON array, no other text. Example format:
[
  {
    "title": "Recipe 1",
    "ingredients": ["ingredient", "ingredient"],
    "instructions": ["step", "step"]
  },
  ...
]`;

  // 2. Call Anthropic (Claude)
  const anthropicRes = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      apiKeyIdentifier: 'recipe',
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
    if (!anthropicData.content?.[0]?.text) {
      console.error('Unexpected response format:', anthropicData);
      return [];
    }
    const responseText = anthropicData.content[0].text;
    const match = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (match) {
      recipes = JSON.parse(match[0]);
    }
  } catch (error) {
    console.error('Error parsing recipes:', error);
    return [];
  }

  // Ensure we have an array of valid recipes
  recipes = Array.isArray(recipes) ? recipes : [];
  recipes = recipes.filter(r => r && r.title && Array.isArray(r.ingredients) && Array.isArray(r.instructions));

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
