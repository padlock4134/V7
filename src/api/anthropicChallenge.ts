// Anthropic (Haiku) API integration for Weekly Challenge
// Requires VITE_ANTHROPIC_CHALLENGE_KEY in .env

export async function getWeeklyChallengeRecipe(prompt: string): Promise<{
  title: string;
  ingredients: string[];
  instructions: string;
  equipment?: string[];
}> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_CHALLENGE_KEY;
  if (!apiKey) throw new Error('Anthropic Challenge API key missing');

  // Example payload for Haiku/Anthropic API (adjust as needed for your endpoint)
  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'haiku',
      prompt,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });
  if (!response.ok) throw new Error('Anthropic API error');
  const data = await response.json();

  // Assume the API returns a JSON with the following fields:
  // { title, ingredients, instructions, equipment }
  // Parse and return in a standard format
  return {
    title: data.title || 'Weekly Challenge Recipe',
    ingredients: data.ingredients || [],
    instructions: data.instructions || '',
    equipment: data.equipment || [],
  };
}
