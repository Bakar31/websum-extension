import { extractMainContent } from './utils/content-extractor.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractMainContent();
    sendResponse({ content });
  }
});