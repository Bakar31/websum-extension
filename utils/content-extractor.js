export function extractMainContent() {
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