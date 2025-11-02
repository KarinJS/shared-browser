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

import * as puppeteer from './puppeteer.js';
import * as playwright from './playwright.js';

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
 */
export default {
  puppeteer,
  playwright,
};
