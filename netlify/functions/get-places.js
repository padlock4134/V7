const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Debug logging
  console.log('Environment variables:', {
    hasApiKey: !!process.env.VITE_PLACES_API_KEY,
    keyLength: process.env.VITE_PLACES_API_KEY ? process.env.VITE_PLACES_API_KEY.length : 0
  });
  // Validate required parameters
  if (!event.queryStringParameters?.lat || !event.queryStringParameters?.lng) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required coordinates' })
    };
  }

  const { lat, lng, radius = 24140, type = 'supermarket|grocery_or_supermarket|bakery|store|food' } = event.queryStringParameters;
  const apiKey = process.env.PLACES_API_KEY;

  if (!apiKey) {
    console.error('Missing Places API Key');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;
  
  // Debug logging
  console.log('Request URL (without key):', url.replace(apiKey, 'REDACTED'));

  try {
    console.log(`Fetching places near ${lat},${lng} within ${radius}m`);
    const response = await fetch(url);
    const data = await response.json();
    
    // Debug logging
    console.log('Google API Response:', {
      status: data.status,
      hasResults: !!data.results,
      resultCount: data.results ? data.results.length : 0,
      error_message: data.error_message
    });

    if (!response.ok) {
      console.error('Places API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Places API error', details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache results for 5 minutes
      }
    };
  } catch (error) {
    console.error('Places fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch places' })
    };
  }
};
