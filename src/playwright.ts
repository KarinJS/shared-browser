/**
 * @license
 * MIT License
 * 
 * Playwright 浏览器管理模块
 * 
 * 本模块使用从 Playwright 官方仓库提取的浏览器配置和下载逻辑。
 * 
 * Playwright browser management module
 * 
 * This module uses browser configuration and download logic extracted from the official Playwright repository.
 */

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
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import { hostPlatform, type HostPlatform } from './playwright-vendor/utils/hostPlatform.js';
import { downloadBrowser as fetchBrowser, getDownloadURL, type BrowserDescriptor } from './playwright-vendor/browserFetcher.js';

const debugPlaywright = debug('shared-browser:playwright');

let browsersConfig: { browsers: BrowserDescriptor[] } | null = null;

/**
 * 加载浏览器配置
 * Load browser configuration
 */
async function loadBrowsersConfig(): Promise<{ browsers: BrowserDescriptor[] }> {
  if (browsersConfig) {
    return browsersConfig;
  }

  try {
    const configPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      'playwright-vendor',
      'browsers.json'
    );
    const content = await readFile(configPath, 'utf-8');
    browsersConfig = JSON.parse(content);
    return browsersConfig!;
  } catch (error) {
    debugPlaywright('Error loading browsers config:', error);
    // 降级配置
    // Fallback configuration
    return {
      browsers: [
        { name: 'chromium', revision: '1097', installByDefault: true },
        { name: 'firefox', revision: '1442', installByDefault: true },
        { name: 'webkit', revision: '2068', installByDefault: true },
      ],
    };
  }
}

/**
 * 检测当前平台
 * Detect current platform
 */
function detectPlatform(): Platform {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'mac_arm' : 'mac';
  } else if (platform === 'linux') {
    return 'linux';
  } else if (platform === 'win32') {
    return 'win64';
  }

  return 'linux';
}

/**
 * 转换平台类型
 * Convert platform type
 */
function toHostPlatform(platform: Platform): HostPlatform {
  if (platform === 'mac_arm') return 'mac-arm64';
  if (platform === 'mac') return 'mac';
  if (platform === 'win64' || platform === 'win32') return 'win64';
  return 'linux';
}

/**
 * 获取默认缓存目录
 * Get default cache directory
 */
function getDefaultCacheDir(): string {
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA || os.homedir(), 'ms-playwright');
  }
  return path.join(os.homedir(), '.cache', 'ms-playwright');
}

/**
 * 将内部浏览器类型转换为 Playwright 浏览器名称
 * Convert internal browser type to Playwright browser name
 */
function toPlaywrightBrowserName(browser: BrowserType): string {
  switch (browser) {
    case 'chrome':
    case 'chromium':
      return 'chromium';
    case 'firefox':
      return 'firefox';
    case 'webkit':
      return 'webkit';
    default:
      return 'chromium';
  }
}

/**
 * 查找已安装的浏览器
 * Find installed browser
 */
export async function findBrowser(
  options: FindBrowserOptions = {}
): Promise<BrowserInfo | null> {
  const browser = options.browser || 'chromium';
  const cacheDir = options.cacheDir || getDefaultCacheDir();
  const platform = options.platform || detectPlatform();

  const browserName = toPlaywrightBrowserName(browser);

  try {
    const browserDir = path.join(cacheDir, browserName);

    if (!fs.existsSync(browserDir)) {
      debugPlaywright('Browser directory does not exist:', browserDir);
      return null;
    }

    const dirs = fs.readdirSync(browserDir);

    for (const dir of dirs) {
      const fullPath = path.join(browserDir, dir);

      if (!fs.statSync(fullPath).isDirectory()) {
        continue;
      }

      // 根据平台查找可执行文件
      // Find executable file based on platform
      let executablePath: string;

      if (platform === 'win64' || platform === 'win32') {
        const exeName = browserName === 'firefox' ? 'firefox.exe' : 'chrome.exe';
        executablePath = path.join(fullPath, exeName);
      } else if (platform.startsWith('mac')) {
        if (browserName === 'chromium') {
          executablePath = path.join(
            fullPath,
            'chrome-mac',
            'Chromium.app',
            'Contents',
            'MacOS',
            'Chromium'
          );
        } else if (browserName === 'firefox') {
          executablePath = path.join(
            fullPath,
            'firefox',
            'Nightly.app',
            'Contents',
            'MacOS',
            'firefox'
          );
        } else {
          executablePath = path.join(fullPath, 'pw_run.sh');
        }
      } else {
        // Linux
        executablePath = path.join(fullPath, browserName);
      }

      if (fs.existsSync(executablePath)) {
        const validBrowserTypes: BrowserType[] = [
          'chromium',
          'firefox',
          'webkit',
          'chrome',
          'chrome-headless-shell',
        ];
        const browserType = validBrowserTypes.includes(browserName as BrowserType)
          ? (browserName as BrowserType)
          : 'chromium';

        return {
          browser: browserType,
          executablePath,
          buildId: dir,
          platform,
          path: fullPath,
        };
      }
    }

    return null;
  } catch (error) {
    debugPlaywright('Error finding browser:', error);
    return null;
  }
}

/**
 * 获取浏览器下载路径
 * Get browser download path
 */
export function getDownloadPath(options: GetDownloadPathOptions): string {
  const browser = options.browser || 'chromium';
  const cacheDir = options.cacheDir || getDefaultCacheDir();

  const browserName = toPlaywrightBrowserName(browser);

  if (options.buildId) {
    return path.join(cacheDir, browserName, options.buildId);
  }

  return path.join(cacheDir, browserName);
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
  const platform = options.platform || detectPlatform();

  const browserName = toPlaywrightBrowserName(browser);
  const hostPlat = toHostPlatform(platform);

  debugPlaywright('Downloading browser:', { browser: browserName, cacheDir, platform });

  // 加载浏览器配置
  // Load browser configuration
  const config = await loadBrowsersConfig();
  const browserDesc = config.browsers.find((b) => b.name === browserName);

  if (!browserDesc) {
    throw new Error(`Unknown browser: ${browserName}`);
  }

  // 使用指定的 buildId 或配置中的 revision
  // Use specified buildId or revision from config
  const buildNumber = options.buildId || browserDesc.revision;

  // 构建下载 URL
  // Build download URL
  const downloadURL = getDownloadURL(browserName, buildNumber, hostPlat);
  const downloadPath = path.join(cacheDir, browserName, buildNumber);

  debugPlaywright('Download URL:', downloadURL);
  debugPlaywright('Download path:', downloadPath);

  // 检查是否已安装
  // Check if already installed
  const existing = await findBrowser({
    browser,
    cacheDir,
    platform,
  });

  if (existing && existing.buildId === buildNumber) {
    debugPlaywright('Browser already installed');
    return existing;
  }

  // 下载浏览器
  // Download browser
  try {
    await fetchBrowser({
      browser: browserDesc,
      buildNumber,
      downloadPath,
      downloadURL,
      platform: hostPlat,
      progressCallback: options.progressCallback,
    });

    debugPlaywright('Browser downloaded successfully');
  } catch (error) {
    debugPlaywright('Error downloading browser:', error);
    throw new Error(`Failed to download ${browserName}: ${error instanceof Error ? error.message : String(error)}`);
  }

  // 查找已下载的浏览器
  // Find downloaded browser
  const installed = await findBrowser({
    browser,
    cacheDir,
    platform,
  });

  if (!installed) {
    throw new Error('Browser was downloaded but could not be found');
  }

  return installed;
}
