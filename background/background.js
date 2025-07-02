import { decryptData } from '../utils/crypto.js';
import { summarizeText, fetchModels } from '../utils/api.js';

function safeCall(fn, ...args) {
  if (typeof fn !== 'function') {
    throw new Error('Function not available. Please try again.');
  }
  return fn(...args);
}

const DEFAULT_SETTINGS = {
  model: 'llama-3.1-8b-instant',
  maxTokens: 1000
};

async function getSettings() {
  const data = await new Promise(resolve => 
    chrome.storage.sync.get(['apiKey', 'isEncrypted', 'model', 'maxTokens'], resolve)
  );

  if (!data.apiKey) return null;

  try {
    const settings = {
      ...DEFAULT_SETTINGS,
      ...data,
      apiKey: data.isEncrypted 
        ? await decryptData(data.apiKey)
        : data.apiKey
    };
    
    settings.maxTokens = Math.min(8192, Math.max(100, 
      parseInt(settings.maxTokens, 10) || DEFAULT_SETTINGS.maxTokens
    ));
    
    return settings;
  } catch (error) {
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getModels') {
    (async () => {
      try {
        const settings = await getSettings();
        if (!settings || !settings.apiKey) {
          throw new Error('API key not found or invalid.');
        }
        
        const models = await safeCall(fetchModels, settings.apiKey);
        sendResponse({ models });
      } catch (error) {
        console.error('Failed to fetch models:', error);
        sendResponse({ 
          error: error.message || 'Failed to fetch available models.',
          status: error.status || 500
        });
      }
    })();
    return true;
  }
  
  if (request.action === 'summarize') {
    (async () => {
      try {
        const settings = await getSettings();
        if (!settings || !settings.apiKey) {
          throw new Error('API key not found or invalid.');
        }
        
        const { apiKey, model, maxTokens } = settings;
        const summary = await safeCall(summarizeText, {
          apiKey,
          text: request.text,
          model,
          maxTokens
        });
        
        sendResponse({ summary });
      } catch (error) {
        console.error('Summarization error:', error);
        sendResponse({ 
          error: error.message || 'An error occurred while summarizing the content.',
          status: error.status || 500
        });
      }
    })();
    
    return true;
  }
});