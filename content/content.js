function extractMainContent() {
  const selectorsToRemove = [
    'header', 'footer', 'nav', 'aside', 'menu', 'form', 'button', 'input', 'select', 'textarea',
    '.ad', '.advertisement', '.banner', '.comments', '.sidebar', '.social', '.share', '.related',
    '.newsletter', '.subscribe', '.cookie', '.privacy', '.disclaimer', '.modal', '.popup',
    'script', 'style', 'noscript', 'iframe', 'svg', 'img', 'video', 'audio', 'canvas', 'figure'
  ].join(',');
  
  document.querySelectorAll(selectorsToRemove).forEach(el => el.remove());

  const elements = Array.from(document.querySelectorAll('article, main, div[role="main"], section, [class*="content"], [id*="content"]'));
  
  const scoredElements = elements.map(element => {
    const text = element.innerText.trim();
    if (!text) return { element, score: -1 };
    
    const tagName = element.tagName.toLowerCase();
    const classList = element.className.toLowerCase();
    const id = element.id.toLowerCase();
    const textLength = text.length;
    const linkDensity = getLinkDensity(element);
    
    if (textLength < 100 || linkDensity > 0.3) {
      return { element, score: -1 };
    }
    
    let score = 0;
    
    const tagScores = {
      'article': 20,
      'main': 18,
      'section': 15,
      'div': 5,
      'p': 3
    };
    score += tagScores[tagName] || 1;
    
    if (classList.includes('content') || id.includes('content')) score += 10;
    if (classList.includes('article') || id.includes('article')) score += 8;
    if (classList.includes('post') || id.includes('post')) score += 6;
    
    score += Math.log2(textLength);
    
    score -= linkDensity * 10;
    
    return { element, score };
  }).filter(item => item.score > 0);
  
  scoredElements.sort((a, b) => b.score - a.score);
  const bestMatch = scoredElements[0];
  
  if (bestMatch) {
    const content = bestMatch.element.cloneNode(true);
    
    content.querySelectorAll('a, button, form, input, select, textarea, [onclick], [role="button"]')
      .forEach(el => el.remove());
    
    let text = content.innerText
      .replace(/\s+/g, ' ')          
      .replace(/\n{3,}/g, '\n\n')    
      .trim();
    
    const MAX_LENGTH = 15000;  
    if (text.length > MAX_LENGTH) {
      const lastPeriod = text.lastIndexOf('.', MAX_LENGTH);
      const lastSpace = text.lastIndexOf(' ', MAX_LENGTH);
      
      if (lastPeriod > MAX_LENGTH * 0.8) {
        text = text.substring(0, lastPeriod + 1);
      } else if (lastSpace > MAX_LENGTH * 0.8) {
        text = text.substring(0, lastSpace) + '...';
      } else {
        text = text.substring(0, MAX_LENGTH) + '...';
      }
    }
    
    return text;
  }
  
  const bodyText = document.body.innerText
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
    
  return bodyText.length > 500 ? bodyText : '';
}

function getLinkDensity(element) {
  const textLength = element.innerText.length;
  if (textLength === 0) return 0;
  
  const linkLength = Array.from(element.getElementsByTagName('a'))
    .map(link => link.innerText.length)
    .reduce((total, length) => total + length, 0);
    
  return linkLength / textLength;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractMainContent();
    sendResponse({ content });
  }
});