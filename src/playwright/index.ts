/**
 * @license
 * MIT License
 */

/**
 * Playwright 浏览器管理模块
 * 
 * 本模块使用 playwright-core 官方包来管理浏览器的下载和缓存。
 * 所有浏览器查找、下载路径获取和浏览器下载逻辑均直接来自 Playwright 官方实现。
 * 
 * Playwright browser management module
 * 
 * This module uses the official playwright-core package to manage browser downloads and caching.
 * All browser finding, download path retrieval, and browser download logic comes directly from the official Playwright implementation.
 */

import { _electron as electron } from 'playwright-core';
import debug from 'debug';
import type {
  FindBrowserOptions,
  DownloadBrowserOptions,
  BrowserInfo,
  GetDownloadPathOptions,
  BrowserType,
  Platform,
} from '../types/index.js';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const debugPlaywright = debug('shared-browser:playwright');

// Playwright 官方浏览器注册表模块
// Playwright official browser registry module
// 我们通过动态导入访问内部 API
// We access internal APIs through dynamic imports
let registryModule: any = null;

/**
 * 获取 Playwright 注册表模块
 * Get Playwright registry module
 * 
 * 此函数动态加载 Playwright 的内部注册表模块，该模块包含所有浏览器下载和管理逻辑。
 * This function dynamically loads Playwright's internal registry module, which contains all browser download and management logic.
 * 
 * @returns 注册表模块 / Registry module
 */
async function getRegistryModule() {
  if (registryModule) {
    return registryModule;
  }

  try {
    // 尝试导入 Playwright 的内部注册表模块
    // Try to import Playwright's internal registry module
    const playwrightPath = require.resolve('playwright-core');
    const basePath = path.dirname(playwrightPath);
    
    // 注册表通常位于 lib/server/registry
    // Registry is usually located at lib/server/registry
    const registryPath = path.join(basePath, 'lib', 'server', 'registry', 'index.js');
    
    if (fs.existsSync(registryPath)) {
      registryModule = await import(registryPath);
      debugPlaywright('Loaded registry module from:', registryPath);
    } else {
      debugPlaywright('Registry module not found at expected path:', registryPath);
    }
  } catch (error) {
    debugPlaywright('Error loading registry module:', error);
  }

  return registryModule;
}

/**
 * 将内部平台类型转换为 Playwright 平台类型
 * Convert internal platform type to Playwright platform type
 * 
 * @param platform - 平台类型 / Platform type
 * @returns Playwright 平台类型 / Playwright platform type
 */
function toPlaywrightPlatform(platform?: Platform): string | undefined {
  if (!platform) return undefined;
  
  switch (platform) {
    case 'linux':
      return 'linux';
    case 'mac':
      return 'mac';
    case 'mac_arm':
      return 'mac-arm64';
    case 'win32':
    case 'win64':
      return 'win64';
    default:
      return platform;
  }
}

/**
 * 检测当前平台
 * Detect current platform
 * 
 * @returns 平台类型 / Platform type
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
 * 获取默认缓存目录
 * Get default cache directory
 * 
 * Playwright 使用特定的缓存目录结构
 * Playwright uses a specific cache directory structure
 * 
 * @returns 缓存目录路径 / Cache directory path
 */
function getDefaultCacheDir(): string {
  // Playwright 默认使用 ~/.cache/ms-playwright (Linux/Mac) 或 %LOCALAPPDATA%\ms-playwright (Windows)
  // Playwright defaults to ~/.cache/ms-playwright (Linux/Mac) or %LOCALAPPDATA%\ms-playwright (Windows)
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA || os.homedir(), 'ms-playwright');
  }
  return path.join(os.homedir(), '.cache', 'ms-playwright');
}

/**
 * 将内部浏览器类型转换为 Playwright 浏览器名称
 * Convert internal browser type to Playwright browser name
 * 
 * @param browser - 浏览器类型 / Browser type
 * @returns Playwright 浏览器名称 / Playwright browser name
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
 * 
 * 此函数使用 Playwright 官方的注册表模块来查找已安装的浏览器。
 * This function uses Playwright's official registry module to find installed browsers.
 * 
 * @param options - 查找选项 / Find options
 * @returns 浏览器信息或 null / Browser info or null
 * 
 * @example
 * ```typescript
 * const browser = await findBrowser({ browser: 'chromium' });
 * if (browser) {
 *   console.log('Found browser at:', browser.executablePath);
 * }
 * ```
 */
export async function findBrowser(
  options: FindBrowserOptions = {}
): Promise<BrowserInfo | null> {
  const browser = options.browser || 'chromium';
  const cacheDir = options.cacheDir || getDefaultCacheDir();
  const platform = options.platform || detectPlatform();

  const browserName = toPlaywrightBrowserName(browser);

  try {
    const registry = await getRegistryModule();
    
    if (!registry) {
      debugPlaywright('Registry module not available, using basic search');
      // 降级到基本文件系统搜索
      // Fallback to basic filesystem search
      return findBrowserFallback(browserName, cacheDir, platform);
    }

    // 使用 Playwright 的注册表查找浏览器
    // Use Playwright's registry to find browser
    const registryInstance = registry.registry || (registry.default && registry.default.registry);
    
    if (!registryInstance) {
      return findBrowserFallback(browserName, cacheDir, platform);
    }

    // 查找已安装的浏览器
    // Find installed browsers
    const executable = registryInstance.findExecutable(browserName);
    
    if (!executable || !executable.executablePath) {
      debugPlaywright('Browser not found:', browserName);
      return null;
    }

    debugPlaywright('Found browser:', executable);

    return {
      browser,
      executablePath: executable.executablePath,
      buildId: executable.browserVersion || 'unknown',
      platform,
      path: path.dirname(executable.executablePath),
    };
  } catch (error) {
    debugPlaywright('Error finding browser:', error);
    return findBrowserFallback(browserName, cacheDir, platform);
  }
}

/**
 * 降级浏览器查找方法（使用文件系统）
 * Fallback browser finding method (using filesystem)
 * 
 * @param browserName - 浏览器名称 / Browser name
 * @param cacheDir - 缓存目录 / Cache directory
 * @param platform - 平台 / Platform
 * @returns 浏览器信息或 null / Browser info or null
 */
function findBrowserFallback(
  browserName: string,
  cacheDir: string,
  platform: Platform
): BrowserInfo | null {
  try {
    // 构建预期的浏览器路径
    // Build expected browser path
    const browserDir = path.join(cacheDir, browserName);
    
    if (!fs.existsSync(browserDir)) {
      debugPlaywright('Browser directory does not exist:', browserDir);
      return null;
    }

    // 查找可执行文件
    // Find executable file
    const dirs = fs.readdirSync(browserDir);
    
    for (const dir of dirs) {
      const fullPath = path.join(browserDir, dir);
      
      if (!fs.statSync(fullPath).isDirectory()) {
        continue;
      }

      // 根据平台查找可执行文件
      // Find executable file based on platform
      let executableName: string;
      let executablePath: string;

      if (platform === 'win64' || platform === 'win32') {
        executableName = browserName === 'firefox' ? 'firefox.exe' : 'chrome.exe';
        executablePath = path.join(fullPath, executableName);
      } else if (platform.startsWith('mac')) {
        if (browserName === 'chromium') {
          executablePath = path.join(fullPath, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
        } else if (browserName === 'firefox') {
          executablePath = path.join(fullPath, 'firefox', 'Nightly.app', 'Contents', 'MacOS', 'firefox');
        } else {
          executablePath = path.join(fullPath, 'pw_run.sh');
        }
      } else {
        // Linux
        executablePath = path.join(fullPath, browserName);
      }

      if (fs.existsSync(executablePath)) {
        return {
          browser: browserName as BrowserType,
          executablePath,
          buildId: dir,
          platform,
          path: fullPath,
        };
      }
    }

    return null;
  } catch (error) {
    debugPlaywright('Error in fallback browser search:', error);
    return null;
  }
}

/**
 * 获取浏览器下载路径
 * Get browser download path
 * 
 * 此函数返回 Playwright 浏览器的安装路径。
 * This function returns the installation path for Playwright browsers.
 * 
 * @param options - 下载路径选项 / Download path options
 * @returns 下载路径 / Download path
 * 
 * @example
 * ```typescript
 * const downloadPath = getDownloadPath({ 
 *   browser: 'chromium',
 *   buildId: '1097'
 * });
 * console.log('Browser will be installed to:', downloadPath);
 * ```
 */
export function getDownloadPath(options: GetDownloadPathOptions): string {
  const browser = options.browser || 'chromium';
  const cacheDir = options.cacheDir || getDefaultCacheDir();

  const browserName = toPlaywrightBrowserName(browser);

  // 如果提供了 buildId，返回特定版本的路径
  // If buildId is provided, return path for specific version
  if (options.buildId) {
    return path.join(cacheDir, browserName, options.buildId);
  }

  // 否则返回浏览器的根目录
  // Otherwise return browser's root directory
  return path.join(cacheDir, browserName);
}

/**
 * 下载浏览器
 * Download browser
 * 
 * 此函数使用 Playwright 官方的下载机制来下载浏览器。
 * 由于 Playwright 的下载逻辑深度集成在其 CLI 中，我们需要调用其内部 API。
 * 
 * This function uses Playwright's official download mechanism to download browsers.
 * Since Playwright's download logic is deeply integrated in its CLI, we need to call its internal APIs.
 * 
 * @param options - 下载选项 / Download options
 * @returns 浏览器信息 / Browser info
 * 
 * @throws {Error} 如果下载失败 / If download fails
 * 
 * @example
 * ```typescript
 * const browser = await downloadBrowser({
 *   browser: 'chromium',
 *   progressCallback: (downloaded, total) => {
 *     const percent = (downloaded / total * 100).toFixed(2);
 *     console.log(`Downloaded: ${percent}%`);
 *   }
 * });
 * console.log('Browser installed at:', browser.executablePath);
 * ```
 */
export async function downloadBrowser(
  options: DownloadBrowserOptions
): Promise<BrowserInfo> {
  const browser = options.browser;
  const cacheDir = options.cacheDir || getDefaultCacheDir();
  const platform = options.platform || detectPlatform();

  const browserName = toPlaywrightBrowserName(browser);

  debugPlaywright('Downloading browser:', { browser: browserName, cacheDir, platform });

  try {
    const registry = await getRegistryModule();
    
    if (!registry) {
      throw new Error('Unable to load Playwright registry module. Please ensure playwright-core is installed correctly.');
    }

    const registryInstance = registry.registry || (registry.default && registry.default.registry);
    
    if (!registryInstance) {
      throw new Error('Unable to access Playwright registry instance.');
    }

    // 使用 Playwright 的官方下载方法
    // Use Playwright's official download method
    const descriptor = registryInstance.findExecutable(browserName);
    
    if (!descriptor) {
      throw new Error(`Browser descriptor not found for: ${browserName}`);
    }

    // 下载浏览器
    // Download browser
    await registryInstance.install([descriptor], {
      progressCallback: options.progressCallback,
    });

    debugPlaywright('Browser downloaded successfully');

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
  } catch (error) {
    debugPlaywright('Error downloading browser:', error);
    throw new Error(`Failed to download ${browser}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
