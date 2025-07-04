import { GROQ_API_URL, GROQ_MODEL, MAX_TOKENS, TEMPERATURE } from './constants.js';

export const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models';

export async function summarizeText({ apiKey, text, model = GROQ_MODEL, maxTokens = MAX_TOKENS }) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an expert content distiller who transforms complex webpage content into immediately actionable insights.

              ## Core Directive
              Extract and synthesize the essential value from the source material, presenting it in the format that best serves the reader's comprehension and application of the information.

              ## Operational Principles

              **Intelligent Distillation**: Identify what matters most—key insights, actionable information, critical data, and logical connections—while filtering out redundancy and noise.

              **Adaptive Presentation**: Choose the optimal structure dynamically based on content type:
              - Complex data → Tables and organized sections
              - Process information → Clear sequences  
              - Comparative content → Structured comparisons
              - Conceptual material → Logical flow with essential details

              **Seamless Integration**: Create standalone output that requires no additional context or explanation headers. The summary should immediately orient and inform the reader.

              ## Quality Standards
              - Preserve critical nuances and qualifications
              - Maintain logical relationships between ideas
              - Ensure actionability where applicable
              - Optimize for both comprehension and retention`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: maxTokens,
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

export async function fetchModels(apiKey) {
  const response = await fetch(GROQ_MODELS_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  
  return data.data
    .filter(model => model.id.includes('llama'))
    .map(model => ({
      id: model.id,
      name: model.id
        .replace('llama-', 'Llama ')
        .replace(/-/g, ' ')
        .replace(/(\d+)([a-z])/g, '$1 $2')
        .replace(/\b\w/g, l => l.toUpperCase())
    }));
}