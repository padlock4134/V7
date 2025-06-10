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

  const { lat, lng, radius = 24140, type = 'supermarket,grocery_store,bakery,butcher_shop,fish_store,food_store' } = event.queryStringParameters;
  const apiKey = process.env.VITE_PLACES_API_KEY;

  if (!apiKey) {
    console.error('Missing Places API Key');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error - Missing API Key' })
    };
  }

  // Using the new Places API endpoint
  const url = 'https://places.googleapis.com/v1/places:searchNearby';
  const body = {
    locationRestriction: {
      circle: {
        center: {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        },
        radius: parseFloat(radius)
      }
    },
    includedTypes: type.split('|')
  };

  try {
    console.log(`Fetching places near ${lat},${lng} within ${radius}m`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.id'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    // Debug logging
    console.log('Google API Response:', {
      status: response.status,
      hasResults: !!data.places,
      resultCount: data.places ? data.places.length : 0,
      error: data.error
    });

    if (!response.ok) {
      console.error('Places API error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Places API error', details: data })
      };
    }

    // Transform the response to match the old format our frontend expects
    const transformedData = {
      status: 'OK',
      results: (data.places || []).map(place => ({
        place_id: place.id,
        name: place.displayName?.text || '',
        vicinity: place.formattedAddress || '',
        types: place.types || []
      }))
    };

    return {
      statusCode: 200,
      body: JSON.stringify(transformedData),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    };
  } catch (error) {
    console.error('Places fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch places', details: error.message })
    };
  }
};
