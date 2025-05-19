// Anthropic Claude Haiku API integration for Chef Freddie
export async function askChefFreddie(prompt: string): Promise<string> {
  const apiKey = (import.meta as any).env.VITE_ANTHROPIC_CHEF_KEY;
  if (!apiKey) throw new Error('Anthropic Chef Key missing');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
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
