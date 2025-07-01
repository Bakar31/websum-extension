document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save');
  const apiKeyInput = document.getElementById('apiKey');

  // Load the saved API key
  chrome.storage.sync.get('apiKey', (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  });

  // Save the API key
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    chrome.storage.sync.set({ apiKey }, () => {
      console.log('API key saved');
    });
  });
});