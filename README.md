# WebSum Chrome Extension

This is a Chrome extension that allows users to summarize any webpage using their own Groq API key.

## Features

- Summarize any webpage with a single click.
- Uses the Groq API for high-quality summarization.
- Securely stores your API key in Chrome storage.
- Simple and easy-to-use interface.

## Getting Started

### Prerequisites

- Google Chrome
- A Groq API key

### Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the `websum-extension` directory.

### Configuration

1. After installing the extension, right-click on the extension icon and select "Options".
2. Enter your Groq API key in the input field and click "Save".

## Usage

1. Navigate to any webpage you want to summarize.
2. Click on the WebSum extension icon in the Chrome toolbar.
3. Click the "Summarize" button.
4. The summary will be displayed in the extension popup.

## Project Structure

```
websum-extension/
├── manifest.json                 # Extension configuration
├── popup/
│   ├── popup.html               # Main UI interface
│   ├── popup.js                 # Popup logic and API calls
│   └── popup.css                # Styling for popup
├── content/
│   └── content.js               # Page content extraction
├── background/
│   └── background.js            # Service worker for API calls
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
