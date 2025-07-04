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

## 🎥 Demo

[![WebSummarizer Demo](https://www.youtube.com/watch?v=dk1IWDE6AUs)](https://www.youtube.com/watch?v=dk1IWDE6AUs)

*Click the image above to watch the demo video*

## 🚀 Getting Started

### Prerequisites

- Google Chrome (latest version recommended)
- A valid [Groq API key](https://console.groq.com/)
- Basic knowledge of installing Chrome extensions

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/bakar31/websum-extension.git
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
5. Click "Save"

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

MIT License

Copyright (c) 2025 Abu Bakar Siddik

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```
