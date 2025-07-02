function extractMainContent() {
  const selectorsToRemove = 'header, footer, nav, aside, .ad, .advertisement, .banner, .comments, .sidebar';
  document.querySelectorAll(selectorsToRemove).forEach(el => el.remove());

  let bestContainer = null;
  let maxScore = -1;

  document.querySelectorAll('article, main, div, section').forEach(element => {
    const textLength = element.innerText.trim().length;
    if (textLength === 0) return;

    let score = 0;
    switch (element.tagName.toLowerCase()) {
      case 'article':
        score += 10;
        break;
      case 'main':
        score += 8;
        break;
      case 'section':
        score += 5;
        break;
      case 'div':
        score += 3;
        break;
    }

    score += Math.log(textLength + 1); 

    if (score > maxScore) {
      maxScore = score;
      bestContainer = element;
    }
  });

  if (bestContainer) {
    const contentClone = bestContainer.cloneNode(true);
    contentClone.querySelectorAll('script, style, noscript, iframe, button, input, form').forEach(el => el.remove());
    return contentClone.innerText.trim();
  }

  const article = document.querySelector('article');
  if (article) {
    return article.innerText;
  }

  const main = document.querySelector('main');
  if (main) {
    return main.innerText;
  }

  return document.body.innerText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractContent') {
    const content = extractMainContent();
    sendResponse({ content });
  }
});