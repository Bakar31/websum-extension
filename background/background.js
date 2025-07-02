import { summarizeText } from '../utils/api.js';
import { decryptData } from '../utils/crypto.js';

async function getApiKey() {
  const data = await new Promise(resolve => 
    chrome.storage.sync.get(['apiKey', 'isEncrypted'], resolve)
  );

  if (!data.apiKey) return null;

  try {
    return data.isEncrypted 
      ? await decryptData(data.apiKey)
      : data.apiKey;
  } catch (error) {
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    (async () => {
      try {
        const apiKey = await getApiKey();
        if (!apiKey) {
          throw new Error('API key not found or invalid.');
        }
        
        const summary = await summarizeText(apiKey, request.text);
        sendResponse({ summary });
      } catch (error) {
        sendResponse({ 
          error: error.message || 'An error occurred while summarizing the content.'
        });
      }
    })();
    
    return true;
  }
});