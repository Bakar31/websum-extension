document.addEventListener('DOMContentLoaded', () => {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');
  const settingsToggle = document.getElementById('settings-toggle');
  const mainView = document.getElementById('main-view');
  const settingsView = document.getElementById('settings-view');
  const apiKeyInput = document.getElementById('api-key');
  const saveKeyButton = document.getElementById('save-key');
  const removeKeyButton = document.getElementById('remove-key');
  const cancelSettingsButton = document.getElementById('cancel-settings');
  
  let isLoading = false;
  let currentView = 'main';

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
    
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get('apiKey', resolve);
      });
      
      if (!data.apiKey) {
        showView('settings');
        apiKeyInput.focus();
        return;
      }
      
      setLoading(true);
      
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

  function showView(view) {
    if (view === 'main') {
      mainView.classList.remove('hidden');
      settingsView.classList.add('hidden');
      currentView = 'main';
    } else if (view === 'settings') {
      mainView.classList.add('hidden');
      settingsView.classList.remove('hidden');
      currentView = 'settings';
      loadApiKey();
    }
  }

  async function loadApiKey() {
    const data = await new Promise(resolve => chrome.storage.sync.get('apiKey', resolve));
    apiKeyInput.value = data.apiKey || '';
  }

  async function saveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    await new Promise(resolve => chrome.storage.sync.set({ apiKey }, resolve));
    showView('main');
  }

  async function removeApiKey() {
    await new Promise(resolve => chrome.storage.sync.remove('apiKey', resolve));
    apiKeyInput.value = '';
  }

  settingsToggle.addEventListener('click', () => showView('settings'));
  saveKeyButton.addEventListener('click', saveApiKey);
  removeKeyButton.addEventListener('click', removeApiKey);
  cancelSettingsButton.addEventListener('click', () => showView('main'));
  
  showView('main');
});