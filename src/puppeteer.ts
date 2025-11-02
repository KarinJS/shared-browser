/**
 * @license
 * MIT License
 * 
 * Puppeteer 浏览器管理模块
 * 
 * 本模块直接使用从 Puppeteer 官方仓库提取的源代码。
 * 所有浏览器查找、下载路径获取和浏览器下载逻辑均来自 Puppeteer 官方实现。
 * 
 * Puppeteer browser management module
 * 
 * This module directly uses source code extracted from the official Puppeteer repository.
 * All browser finding, download path retrieval, and browser download logic comes from the official Puppeteer implementation.
 */

import { install, canDownload } from './puppeteer-vendor/install.js';
import { Cache as PuppeteerCache } from './puppeteer-vendor/Cache.js';
import { detectBrowserPlatform } from './puppeteer-vendor/detectPlatform.js';
import {
  Browser as PuppeteerBrowser,
  type BrowserPlatform,
  resolveBuildId,
} from './puppeteer-vendor/browser-data/browser-data.js';
import debug from 'debug';
import type {
  FindBrowserOptions,
  DownloadBrowserOptions,
  BrowserInfo,
  GetDownloadPathOptions,
  BrowserType,
  Platform,
} from './types/index.js';
import path from 'node:path';
import os from 'node:os';

const debugPuppeteer = debug('shared-browser:puppeteer');

/**
 * 将内部浏览器类型转换为 Puppeteer 浏览器类型
 * Convert internal browser type to Puppeteer browser type
 */
function toPuppeteerBrowser(browser: BrowserType): PuppeteerBrowser {
  switch (browser) {
    case 'chrome':
      return PuppeteerBrowser.CHROME;
    case 'chrome-headless-shell':
      return PuppeteerBrowser.CHROMEHEADLESSSHELL;
    case 'chromium':
      return PuppeteerBrowser.CHROMIUM;
    case 'firefox':
      return PuppeteerBrowser.FIREFOX;
    default:
      return PuppeteerBrowser.CHROME;
  }
}

/**
 * 将内部平台类型转换为 Puppeteer 平台类型
 * Convert internal platform type to Puppeteer platform type
 */
function toPuppeteerPlatform(platform?: Platform): BrowserPlatform | undefined {
  if (!platform) return undefined;
  return platform as BrowserPlatform;
}

/**
 * 获取默认缓存目录
 * Get default cache directory
 */
function getDefaultCacheDir(): string {
  return path.join(os.homedir(), '.cache', 'shared-browser', 'puppeteer');
}

/**
 * 查找已安装的浏览器
 * Find installed browser
 */
export async function findBrowser(
  options: FindBrowserOptions = {}
): Promise<BrowserInfo | null> {
  const browser = options.browser || 'chrome';
  const cacheDir = options.cacheDir || getDefaultCacheDir();
  const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();

  if (!platform) {
    debugPuppeteer('Could not detect platform');
    return null;
  }

  const puppeteerBrowser = toPuppeteerBrowser(browser);
  const cache = new PuppeteerCache(cacheDir);

  try {
    const installedBrowsers = cache.getInstalledBrowsers();
    const found = installedBrowsers.find(
      (b) => b.browser === puppeteerBrowser && b.platform === platform
    );

    if (!found) {
      debugPuppeteer('Browser not found:', browser);
      return null;
    }

    debugPuppeteer('Found browser:', found);

    return {
      browser,
      executablePath: found.executablePath,
      buildId: found.buildId,
      platform: platform as Platform,
      path: found.path,
    };
  } catch (error) {
    debugPuppeteer('Error finding browser:', error);
    return null;
  }
}

/**
 * 获取浏览器下载路径
 * Get browser download path
 */
export function getDownloadPath(options: GetDownloadPathOptions): string {
  const browser = options.browser || 'chrome';
  const cacheDir = options.cacheDir || getDefaultCacheDir();
  const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();

  if (!platform) {
    throw new Error('Could not detect platform');
  }

  const puppeteerBrowser = toPuppeteerBrowser(browser);
  const cache = new PuppeteerCache(cacheDir);

  if (options.buildId) {
    return cache.installationDir(puppeteerBrowser, platform, options.buildId);
  }

  return cache.rootDir;
}

/**
 * 下载浏览器
 * Download browser
 */
export async function downloadBrowser(
  options: DownloadBrowserOptions
): Promise<BrowserInfo> {
  const browser = options.browser;
  const cacheDir = options.cacheDir || getDefaultCacheDir();
  const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();

  if (!platform) {
    throw new Error('Could not detect platform');
  }

  const puppeteerBrowser = toPuppeteerBrowser(browser);
  const cache = new PuppeteerCache(cacheDir);

  let buildId = options.buildId;
  if (!buildId) {
    debugPuppeteer('Resolving build ID for latest version');
    buildId = await resolveBuildId(puppeteerBrowser, platform, 'latest');
  }

  debugPuppeteer('Downloading browser:', { browser, buildId, platform });

  const canDl = await canDownload({
    browser: puppeteerBrowser,
    buildId,
    platform,
    cacheDir,
  });

  if (!canDl) {
    throw new Error(`Cannot download ${browser} ${buildId} for ${platform}`);
  }

  const installedBrowser = await install({
    browser: puppeteerBrowser,
    buildId,
    platform,
    cacheDir,
    downloadProgressCallback: options.progressCallback
      ? (downloadedBytes: number, totalBytes: number) => {
          options.progressCallback!(downloadedBytes, totalBytes);
        }
      : undefined,
  });

  debugPuppeteer('Browser downloaded successfully:', installedBrowser);

  return {
    browser,
    executablePath: cache.computeExecutablePath({
      browser: puppeteerBrowser,
      buildId,
      platform,
    }),
    buildId,
    platform: platform as Platform,
    path: installedBrowser.path,
  };
}
