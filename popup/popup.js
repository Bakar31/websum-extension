document.addEventListener('DOMContentLoaded', () => {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');

  summarizeButton.addEventListener('click', () => {
    summaryDiv.innerText = 'Loading...';
    chrome.storage.sync.get('apiKey', (data) => {
      if (!data.apiKey) {
        const optionsUrl = chrome.runtime.getURL('options/options.html');
        summaryDiv.innerHTML = `API key not set. <a href="${optionsUrl}" target="_blank">Set it here</a>`;
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ['content/content.js'],
          },
          () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'extractContent' }, (response) => {
              if (response && response.content) {
                chrome.runtime.sendMessage({ action: 'summarize', text: response.content }, (summaryResponse) => {
                  if (summaryResponse.summary) {
                    summaryDiv.innerText = summaryResponse.summary;
                  } else if (summaryResponse.error) {
                    summaryDiv.innerText = `Error: ${summaryResponse.error}`;
                  }
                });
              } else {
                summaryDiv.innerText = 'Could not extract content from the page.';
              }
            });
          }
        );
      });
    });
  });
});