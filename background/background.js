import { summarizeText } from '../utils/api.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    chrome.storage.sync.get('apiKey', async (data) => {
      if (data.apiKey) {
        try {
          const summary = await summarizeText(data.apiKey, request.text);
          sendResponse({ summary });
        } catch (error) {
          sendResponse({ error: error.message });
        }
      } else {
        sendResponse({ error: 'API key not found.' });
      }
    });
    return true; // Indicates that the response is sent asynchronously
  }
});