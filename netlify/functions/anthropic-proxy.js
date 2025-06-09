const fetch = require('node-fetch');

// Define API keys mapping
const API_KEYS = {
  recipe: process.env.ANTHROPIC_RECIPE_KEY,
  challenge: process.env.ANTHROPIC_CHALLENGE_KEY,
  chef: process.env.ANTHROPIC_CHEF_KEY,
  default: process.env.ANTHROPIC_API_KEY
};

exports.handler = async function(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const apiKeyIdentifier = requestBody.apiKeyIdentifier || 'default';
    
    // Remove the identifier from the body before forwarding to Anthropic
    delete requestBody.apiKeyIdentifier;

    // Get the appropriate API key
    const apiKey = API_KEYS[apiKeyIdentifier] || API_KEYS.default;

    // Check if we have a valid API key
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ 
          error: `Anthropic API key not configured`,
          details: `No key found for identifier: ${apiKeyIdentifier}`,
          availableKeys: Object.keys(API_KEYS).filter(k => API_KEYS[k])
        })
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'content-type': 'application/json',
        'anthropic-version': event.headers['anthropic-version'] || '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.text(); // Preserve raw Anthropic response
    return {
      statusCode: response.status,
      headers: { 'content-type': 'application/json' },
      body: data
    };
  } catch (err) {
    console.error('Error proxying to Anthropic:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
