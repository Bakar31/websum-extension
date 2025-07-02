document.addEventListener('DOMContentLoaded', () => {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');
  let isLoading = false;

  const setLoading = (loading) => {
    isLoading = loading;
    summarizeButton.disabled = loading;
    if (loading) {
      summarizeButton.classList.add('loading');
    } else {
      summarizeButton.classList.remove('loading');
    }
    
    if (loading) {
      summaryDiv.style.display = 'none';
      summaryDiv.innerHTML = '';
    }
  };

  const showSummary = (content) => {
    if (!content) {
      summaryDiv.style.display = 'none';
      return;
    }
    summaryDiv.style.display = 'block';
    summaryDiv.innerHTML = content;
  };

  summarizeButton.addEventListener('click', async () => {
    if (isLoading) return;
    setLoading(true);
    
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get('apiKey', resolve);
      });
      
      if (!data.apiKey) {
        const optionsUrl = chrome.runtime.getURL('options/options.html');
        showSummary(`API key not set. <a href="${optionsUrl}" target="_blank">Set it here</a>`);
        return;
      }

      const tabs = await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, resolve);
      });

      await new Promise((resolve) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            files: ['content/content.js'],
          },
          resolve
        );
      });

      const response = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'extractContent' }, resolve);
      });

      if (response && response.content) {
        const summaryResponse = await new Promise((resolve) => {
          chrome.runtime.sendMessage(
            { action: 'summarize', text: response.content },
            resolve
          );
        });

        if (summaryResponse?.summary) {
          showSummary(summaryResponse.summary);
        } else if (summaryResponse?.error) {
          showSummary(`Error: ${summaryResponse.error}`);
        } else {
          showSummary('No summary was returned from the API.');
        }
      } else {
        showSummary('Could not extract content from the page.');
      }
    } catch (error) {
      console.error('Error:', error);
      showSummary(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  });
});