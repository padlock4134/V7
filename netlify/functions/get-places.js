const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { lat, lng, radius = 24140, type = 'supermarket|grocery_or_supermarket|bakery|store|food' } = event.queryStringParameters;
  const apiKey = process.env.VITE_PLACES_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch places.' })
    };
  }
};
