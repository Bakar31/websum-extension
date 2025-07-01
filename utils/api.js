import { GROQ_API_URL } from './constants.js';

export async function summarizeText(apiKey, text) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Summarize the following text concisely...',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}