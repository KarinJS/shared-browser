# shared-browser

A unified browser downloader for Puppeteer and Playwright.

## Features

- 🚀 Unified browser management for both Puppeteer and Playwright
- 📦 Browser download and caching with official logic
- 🔍 Browser discovery and path resolution
- 💾 Efficient browser caching mechanism
- 🌐 Support for multiple platforms (Windows, macOS, Linux)
- 📝 Full TypeScript support with TSDoc comments

## Installation

```bash
npm install @karinjs/shared-browser
# or
pnpm add @karinjs/shared-browser
# or
yarn add @karinjs/shared-browser
```

## Requirements

- Node.js >= 18.0.0
- pnpm 9.x (recommended for development)

## Usage

### For Puppeteer

```typescript
import { puppeteer } from '@karinjs/shared-browser';

// Find installed browser
const browserPath = await puppeteer.findBrowser();

// Get download path
const downloadPath = puppeteer.getDownloadPath();

// Download browser
await puppeteer.downloadBrowser({
  revision: '123456',
  progressCallback: (progress) => {
    console.log(`Downloaded: ${progress}%`);
  }
});
```

### For Playwright

```typescript
import { playwright } from '@karinjs/shared-browser';

// Find installed browser
const browserPath = await playwright.findBrowser('chromium');

// Get download path
const downloadPath = playwright.getDownloadPath('chromium');

// Download browser
await playwright.downloadBrowser({
  browser: 'chromium',
  progressCallback: (progress) => {
    console.log(`Downloaded: ${progress}%`);
  }
});
```

## License

MIT
