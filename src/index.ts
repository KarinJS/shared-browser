/**
 * @license
 * MIT License
 */

/**
 * 统一浏览器下载器
 * Unified browser downloader for Puppeteer and Playwright
 * 
 * @packageDocumentation
 */

import * as puppeteer from './puppeteer/index.js';
import * as playwright from './playwright/index.js';

export { puppeteer, playwright };

export type {
  BrowserType,
  Platform,
  FindBrowserOptions,
  DownloadBrowserOptions,
  BrowserInfo,
  GetDownloadPathOptions,
} from './types/index.js';

/**
 * 默认导出，提供 Puppeteer 和 Playwright 的浏览器管理功能
 * Default export providing browser management for both Puppeteer and Playwright
 * 
 * @example
 * ```typescript
 * import { puppeteer, playwright } from '@karinjs/shared-browser';
 * 
 * // 使用 Puppeteer 下载 Chrome
 * // Download Chrome using Puppeteer
 * const chromeInfo = await puppeteer.downloadBrowser({
 *   browser: 'chrome',
 *   progressCallback: (downloaded, total) => {
 *     console.log(`Progress: ${(downloaded / total * 100).toFixed(2)}%`);
 *   }
 * });
 * 
 * // 使用 Playwright 下载 Chromium
 * // Download Chromium using Playwright
 * const chromiumInfo = await playwright.downloadBrowser({
 *   browser: 'chromium',
 *   progressCallback: (downloaded, total) => {
 *     console.log(`Progress: ${(downloaded / total * 100).toFixed(2)}%`);
 *   }
 * });
 * ```
 */
export default {
  puppeteer,
  playwright,
};
