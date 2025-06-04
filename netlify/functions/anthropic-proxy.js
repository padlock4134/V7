const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const apiKeyIdentifier = requestBody.apiKeyIdentifier;

    // Remove the identifier from the body before forwarding to Anthropic
    if (requestBody.apiKeyIdentifier) {
      delete requestBody.apiKeyIdentifier;
    }

    // Select the appropriate API key based on the identifier
    let apiKey;
    switch (apiKeyIdentifier) {
      case 'recipe':
        apiKey = process.env.ANTHROPIC_RECIPE_KEY;
        break;
      case 'challenge':
        apiKey = process.env.ANTHROPIC_CHALLENGE_KEY;
        break;
      case 'chef':
        apiKey = process.env.ANTHROPIC_CHEF_KEY;
        break;
      default:
        // Fallback to a general API key if no identifier or unknown
        apiKey = process.env.ANTHROPIC_API_KEY;
    }

    // Check if we have a valid API key
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: `Anthropic API key not set for identifier: ${apiKeyIdentifier || 'default'}` })
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
