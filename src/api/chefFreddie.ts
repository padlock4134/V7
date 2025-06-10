// Anthropic Claude Haiku API integration for Chef Freddie
export async function askChefFreddie(prompt: string): Promise<string> {
  const systemPrompt = `You are Chef Freddie, a friendly and knowledgeable AI chef assistant for the PorkChop cooking app.
  You help users with recipe suggestions, cooking tips, and kitchen equipment advice.
  You know about common kitchen equipment like pots, pans, knives, cutting boards, mixers, blenders, etc.
  When discussing recipes, you always mention what equipment is needed.
  Keep responses friendly but concise.`;
  // Use Netlify proxy for Anthropic API (no direct key in frontend)
  const response = await fetch('/.netlify/functions/anthropic-proxy', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      apiKeyIdentifier: 'chef',
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${errorText}`);
  }

  const data = await response.json();
  // Claude API returns an array of content blocks
  return data.content?.[0]?.text || 'Sorry, I could not generate a response.';
}
