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
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}