import { RecipeCard } from '../components/RecipeMatcherModal';

const ANTHROPIC_API_URL = '/.netlify/functions/anthropic-proxy';
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// No API key in frontend; handled by Netlify function
// const anthropicKey = (import.meta as any).env.VITE_ANTHROPIC_RECIPE_KEY;
const unsplashKey = (import.meta as any).env.VITE_UNSPLASH_ACCESS_KEY;

export async function fetchRecipesWithImages(ingredients: string[], numRecipes = 5): Promise<RecipeCard[]> {
  // 1. Build the Anthropic prompt
  const prompt = `You are an expert chef. Create ${numRecipes} unique recipes using ingredients from this list: ${ingredients.join(", ")}. 

IMPORTANT RULES:
1. Each recipe MUST use at least 3-4 ingredients from the provided list
2. Recipes must be practical and delicious
3. Instructions should be clear and detailed
4. You may assume basic pantry items like salt, pepper, and water are available

Format your response as a JSON array of recipe objects. Each recipe object MUST have these exact fields:
{
  "title": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...]
}

Return ONLY the JSON array, no other text.`;

  // 2. Call Anthropic (Claude)
  const anthropicRes = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      apiKeyIdentifier: 'recipe',
      model: 'claude-3-opus-20240229',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    }),
  });
  if (!anthropicRes.ok) {
    console.error('Anthropic API error:', {
      status: anthropicRes.status,
      statusText: anthropicRes.statusText,
      body: await anthropicRes.text()
    });
    throw new Error(`Anthropic API error: ${anthropicRes.status} ${anthropicRes.statusText}`);
  }

  const anthropicData = await anthropicRes.json();
  
  // Try to extract JSON from Claude's response
  let recipes: any[] = [];
  try {
    if (!anthropicData.content?.[0]?.text) {
      console.error('Invalid Anthropic response format:', anthropicData);
      throw new Error('Invalid response format from Anthropic API');
    }
    const responseText = anthropicData.content[0].text;
    console.log('Raw Anthropic response:', responseText);
    
    const match = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!match) {
      console.error('No JSON array found in response:', responseText);
      throw new Error('No recipe data found in API response');
    }
    
    recipes = JSON.parse(match[0]);
    console.log('Parsed recipes:', recipes);
  } catch (error) {
    console.error('Error parsing recipe data:', error);
    throw new Error('Failed to parse recipe data from API response');
  }

  // Validate recipe format
  recipes = Array.isArray(recipes) ? recipes : [];
  const validRecipes = recipes.filter(r => {
    const isValid = r && r.title && Array.isArray(r.ingredients) && Array.isArray(r.instructions);
    if (!isValid) {
      console.warn('Invalid recipe format:', r);
    }
    return isValid;
  });

  if (validRecipes.length === 0) {
    console.error('No valid recipes found in response');
    throw new Error('No valid recipes found in API response');
  }

  // 3. For each recipe, call Unsplash in parallel
  const imagePromises = validRecipes.map(async (r) => {
    const q = encodeURIComponent(r.title || r.ingredients?.[0] || 'meal');
    const res = await fetch(`${UNSPLASH_API_URL}?query=${q}&client_id=${unsplashKey}&orientation=landscape&per_page=1`);
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
  });
  const images = await Promise.all(imagePromises);

  // 4. Return RecipeCards
  return validRecipes.slice(0, numRecipes).map((r, i) => ({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
    title: r.title,
    image: images[i],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions.join('\n') : ''
  }));
}
