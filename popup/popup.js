import { encryptData, decryptData } from '../utils/crypto.js';

document.addEventListener('DOMContentLoaded', async () => {
  const summarizeButton = document.getElementById('summarize');
  const summaryDiv = document.getElementById('summary');
  const settingsToggle = document.getElementById('settings-toggle');
  const mainView = document.getElementById('main-view');
  const settingsView = document.getElementById('settings-view');
  const apiKeyInput = document.getElementById('api-key');
  const modelSelect = document.getElementById('model');
  const maxTokensInput = document.getElementById('max-tokens');
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

  async function populateModels(apiKey) {
    const loadingSpinner = document.getElementById('model-loading');
    const defaultOption = modelSelect.options[0];
    
    try {
      loadingSpinner.style.display = 'block';
      modelSelect.disabled = true;
      defaultOption.textContent = 'Loading models...';
      
      const response = await new Promise(resolve => 
        chrome.runtime.sendMessage({ action: 'getModels' }, resolve)
      );
      
      if (response.error) {
        console.error('Error fetching models:', response.error);
        defaultOption.textContent = 'Failed to load models. Try refreshing.';
        return;
      }
      
      while (modelSelect.options.length > 0) {
        modelSelect.remove(0);
      }
      
      if (response.models && response.models.length > 0) {
        response.models.forEach(model => {
          const option = document.createElement('option');
          option.value = model.id;
          option.textContent = model.name;
          modelSelect.appendChild(option);
        });
      } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No models available';
        modelSelect.appendChild(option);
      }
      
    } catch (error) {
      console.error('Failed to fetch models:', error);
      defaultOption.textContent = 'Error loading models';
    } finally {
      loadingSpinner.style.display = 'none';
      modelSelect.disabled = false;
    }
  }

  async function loadSettings() {
    const data = await new Promise(resolve => chrome.storage.sync.get(
      ['apiKey', 'isEncrypted', 'model', 'maxTokens'], 
      resolve
    ));
  
    if (data.apiKey) {
      try {
        const decryptedKey = data.isEncrypted 
          ? await decryptData(data.apiKey)
          : data.apiKey;
        
        apiKeyInput.value = decryptedKey;
        if (decryptedKey) {
          populateModels(decryptedKey);
        }
      } catch (error) {
        apiKeyInput.value = '';
      }
    }
    
    if (data.model) {
      modelSelect.value = data.model;
    }
    
    if (data.maxTokens) {
      maxTokensInput.value = data.maxTokens;
    }
    
    if (data.model) {
      setTimeout(() => {
        modelSelect.value = data.model;
      }, 500);
    }
  }

  async function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    const maxTokens = parseInt(maxTokensInput.value, 10);
    
    if (!apiKey) return;
    
    const settings = {
      model,
      maxTokens: isNaN(maxTokens) ? 1000 : Math.min(8192, Math.max(100, maxTokens))
    };
    
    try {
      const encryptedKey = await encryptData(apiKey);
      await new Promise(resolve => chrome.storage.sync.set({ 
        ...settings,
        apiKey: encryptedKey,
        isEncrypted: true
      }, resolve));
      showView('main');
    } catch (error) {
      await new Promise(resolve => chrome.storage.sync.set({ 
        ...settings,
        apiKey,
        isEncrypted: false
      }, resolve));
      showView('main');
    }
  }

  async function removeApiKey() {
    await new Promise(resolve => chrome.storage.sync.remove('apiKey', resolve));
    apiKeyInput.value = '';
  }

  summarizeButton.addEventListener('click', summarize);
  
  settingsToggle.addEventListener('click', () => {
    showView('settings');
    if (apiKeyInput.value) {
      populateModels(apiKeyInput.value);
    }
  });
  
  saveKeyButton.addEventListener('click', saveSettings);
  removeKeyButton.addEventListener('click', removeApiKey);
  cancelSettingsButton.addEventListener('click', () => showView('main'));
  
  apiKeyInput.addEventListener('change', (e) => {
    if (e.target.value) {
      populateModels(e.target.value);
    }
  });
  
  loadSettings();
  showView('main');
});