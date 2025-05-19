/// <reference types="vite/client" />
// Google Vision API integration for PorkChop
// Requires VITE_GOOGLE_VISION_API_KEY in .env

export async function scanImage(base64Image: string): Promise<string[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
  if (!apiKey) throw new Error('Google Vision API key missing');

  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [
      { type: 'TEXT_DETECTION', maxResults: 1 },
      { type: 'LABEL_DETECTION', maxResults: 10 }
    ],
      },
    ],
  };

  const res = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Vision API error: ${errorText}`);
  }
  const data = await res.json();
  // Text detection
  const text = data?.responses?.[0]?.fullTextAnnotation?.text || '';
  const textLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  // Label detection
  const labels = data?.responses?.[0]?.labelAnnotations?.map(l => l.description) || [];
  // Combine and deduplicate
  return Array.from(new Set([...textLines, ...labels]));
}
