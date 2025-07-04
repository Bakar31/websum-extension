# WebSummarizer Chrome Extension

A powerful Chrome extension that provides AI-powered webpage summarization using Groq's API. Get concise summaries of any webpage with just one click, with full control over the summarization process.

## ✨ Features

- **One-Click Summarization** - Get instant summaries of any webpage
- **Multiple AI Models** - Choose from various Llama models for different summarization needs
- **Customizable Output** - Control summary length with token limits (100-8192 tokens)
- **Secure API Key Storage** - Your Groq API key is encrypted before storage
- **Real-time Model Loading** - Automatically fetches available models from Groq API
- **Responsive Design** - Works on all screen sizes with a clean, modern interface
- **Error Handling** - Helpful error messages for common issues
- **No Data Collection** - All processing happens locally in your browser

## 🚀 Getting Started

### Prerequisites

- Google Chrome (latest version recommended)
- A valid [Groq API key](https://console.groq.com/)
- Basic knowledge of installing Chrome extensions

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/websum-extension.git
   cd websum-extension
   ```

2. Open Google Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click on "Load unpacked" and select the `websum-extension` directory

### Configuration

1. Click the WebSummarizer extension icon in your toolbar
2. Click the gear icon (⚙️) to open settings
3. Enter your Groq API key
4. (Optional) Adjust model and token settings as needed
5. Click "Save Settings"

## 🎯 Usage

1. Navigate to any webpage you want to summarize
2. Click the WebSummarizer extension icon in your toolbar
3. Click the "Summarize" button
4. View the generated summary in the popup
5. Use the settings to customize your summarization preferences

## 🔧 Customization

- **Model Selection**: Choose from available Groq models (automatically loaded)
- **Token Limit**: Set how long you want the summary to be (100-8192 tokens)
- **API Key Management**: Easily update or remove your API key

## 🔒 Security

- Your API key is encrypted before being stored in Chrome's sync storage
- All API calls are made directly from your browser to Groq's servers
- No data is stored or logged by the extension

## 🏗️ Project Structure

```
websum-extension/
├── manifest.json                 # Extension configuration
├── popup/
│   ├── popup.html               # Main UI interface
│   ├── popup.js                 # Popup logic and event handlers
│   └── popup.css                # Styling for the popup UI
├── background/
│   └── background.js            # Service worker for API calls
├── utils/
│   ├── api.js                  # Groq API integration
│   ├── crypto.js               # Encryption utilities
│   └── constants.js            # App-wide constants
└── assets/                     # Icons and other static files
```

## 🛠️ Development

1. Make your changes to the source code
2. Test your changes in Chrome by reloading the extension
3. Ensure all features work as expected
4. Commit your changes with descriptive messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
├── options/
│   ├── options.html             # Settings page
│   ├── options.js               # Settings logic
│   └── options.css              # Settings styling
├── assets/
│   ├── icons/                   # Extension icons (16x16, 32x32, 48x48, 128x128)
│   └── images/                  # UI assets
└── utils/
    ├── api.js                   # Groq API integration
    ├── storage.js               # Chrome storage wrapper
    ├── content-extractor.js     # Text extraction utilities
    └── constants.js             # Configuration constants
```
