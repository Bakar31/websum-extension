import { GROQ_API_URL, GROQ_MODEL, MAX_TOKENS, TEMPERATURE } from './constants.js';

export async function summarizeText(apiKey, text) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a text summarization assistant. 
          Your task is to summarize the given text concisely. The given text is the content from a webpage.
          DO not add text like "Here is the summary:" or "Summary:"`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    }),
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred while summarizing the content.';
    
    switch (response.status) {
      case 400:
        errorMessage = 'Invalid request. The content might be too short or in an unexpected format.';
        break;
      case 401:
        errorMessage = 'Invalid API key. Please check your Groq API key in settings.';
        break;
      case 403:
        errorMessage = 'Access denied. Your API key might be invalid or expired.';
        break;
      case 404:
        errorMessage = 'API endpoint not found. Please check if the service is available.';
        break;
      case 413:
        errorMessage = 'The content is too long to process.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = 'The service is currently unavailable. Please try again later.';
        break;
      default:
        errorMessage = `Unable to summarize the content. (Status: ${response.status})`;
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}