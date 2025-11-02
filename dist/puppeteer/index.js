/**
 * @license
 * MIT License
 */
/**
 * Puppeteer 浏览器管理模块
 *
 * 本模块使用 @puppeteer/browsers 官方包来管理浏览器的下载和缓存。
 * 所有浏览器查找、下载路径获取和浏览器下载逻辑均直接来自 Puppeteer 官方实现。
 *
 * Puppeteer browser management module
 *
 * This module uses the official @puppeteer/browsers package to manage browser downloads and caching.
 * All browser finding, download path retrieval, and browser download logic comes directly from the official Puppeteer implementation.
 */
import { install, resolveBuildId, canDownload, Browser as PuppeteerBrowser, Cache as PuppeteerCache, detectBrowserPlatform, computeExecutablePath, } from '@puppeteer/browsers';
import debug from 'debug';
import path from 'node:path';
import os from 'node:os';
const debugPuppeteer = debug('shared-browser:puppeteer');
/**
 * 将内部浏览器类型转换为 Puppeteer 浏览器类型
 * Convert internal browser type to Puppeteer browser type
 *
 * @param browser - 浏览器类型 / Browser type
 * @returns Puppeteer 浏览器类型 / Puppeteer browser type
 */
function toPuppeteerBrowser(browser) {
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
 *
 * @param platform - 平台类型 / Platform type
 * @returns Puppeteer 平台类型 / Puppeteer platform type
 */
function toPuppeteerPlatform(platform) {
    if (!platform)
        return undefined;
    return platform;
}
/**
 * 获取默认缓存目录
 * Get default cache directory
 *
 * @returns 缓存目录路径 / Cache directory path
 */
function getDefaultCacheDir() {
    return path.join(os.homedir(), '.cache', 'shared-browser', 'puppeteer');
}
/**
 * 查找已安装的浏览器
 * Find installed browser
 *
 * 此函数使用 Puppeteer 官方的 Cache 类来查找已安装的浏览器。
 * This function uses Puppeteer's official Cache class to find installed browsers.
 *
 * @param options - 查找选项 / Find options
 * @returns 浏览器信息或 null / Browser info or null
 *
 * @example
 * ```typescript
 * const browser = await findBrowser({ browser: 'chrome' });
 * if (browser) {
 *   console.log('Found browser at:', browser.executablePath);
 * }
 * ```
 */
export async function findBrowser(options = {}) {
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
        // 获取已安装的浏览器列表
        // Get list of installed browsers
        const installedBrowsers = cache.getInstalledBrowsers();
        // 查找匹配的浏览器
        // Find matching browser
        const found = installedBrowsers.find((b) => b.browser === puppeteerBrowser && b.platform === platform);
        if (!found) {
            debugPuppeteer('Browser not found:', browser);
            return null;
        }
        debugPuppeteer('Found browser:', found);
        return {
            browser,
            executablePath: found.executablePath,
            buildId: found.buildId,
            platform: platform,
            path: found.path,
        };
    }
    catch (error) {
        debugPuppeteer('Error finding browser:', error);
        return null;
    }
}
/**
 * 获取浏览器下载路径
 * Get browser download path
 *
 * 此函数使用 Puppeteer 官方的路径计算逻辑来确定浏览器的安装路径。
 * This function uses Puppeteer's official path computation logic to determine the browser installation path.
 *
 * @param options - 下载路径选项 / Download path options
 * @returns 下载路径 / Download path
 *
 * @example
 * ```typescript
 * const downloadPath = getDownloadPath({
 *   browser: 'chrome',
 *   buildId: '121.0.6167.85'
 * });
 * console.log('Browser will be installed to:', downloadPath);
 * ```
 */
export function getDownloadPath(options) {
    const browser = options.browser || 'chrome';
    const cacheDir = options.cacheDir || getDefaultCacheDir();
    const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
    if (!platform) {
        throw new Error('Could not detect platform');
    }
    const puppeteerBrowser = toPuppeteerBrowser(browser);
    const cache = new PuppeteerCache(cacheDir);
    // 如果提供了 buildId，返回特定版本的路径
    // If buildId is provided, return path for specific version
    if (options.buildId) {
        return cache.installationDir(puppeteerBrowser, platform, options.buildId);
    }
    // 否则返回浏览器的根缓存目录
    // Otherwise return browser's root cache directory
    return cache.rootDir;
}
/**
 * 下载浏览器
 * Download browser
 *
 * 此函数使用 Puppeteer 官方的 install 函数来下载浏览器。
 * 所有下载逻辑、URL 构建、解压等操作均由官方包处理。
 *
 * This function uses Puppeteer's official install function to download browsers.
 * All download logic, URL construction, extraction, etc. are handled by the official package.
 *
 * @param options - 下载选项 / Download options
 * @returns 浏览器信息 / Browser info
 *
 * @throws {Error} 如果下载失败 / If download fails
 *
 * @example
 * ```typescript
 * const browser = await downloadBrowser({
 *   browser: 'chrome',
 *   buildId: '121.0.6167.85',
 *   progressCallback: (downloaded, total) => {
 *     const percent = (downloaded / total * 100).toFixed(2);
 *     console.log(`Downloaded: ${percent}%`);
 *   }
 * });
 * console.log('Browser installed at:', browser.executablePath);
 * ```
 */
export async function downloadBrowser(options) {
    const browser = options.browser;
    const cacheDir = options.cacheDir || getDefaultCacheDir();
    const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
    if (!platform) {
        throw new Error('Could not detect platform');
    }
    const puppeteerBrowser = toPuppeteerBrowser(browser);
    // 解析构建 ID
    // Resolve build ID
    let buildId = options.buildId;
    if (!buildId) {
        debugPuppeteer('Resolving build ID for latest version');
        buildId = await resolveBuildId(puppeteerBrowser, platform, 'latest');
    }
    debugPuppeteer('Downloading browser:', { browser, buildId, platform });
    // 检查是否可以下载
    // Check if can download
    const canDl = await canDownload({
        browser: puppeteerBrowser,
        buildId,
        platform,
        cacheDir,
    });
    if (!canDl) {
        throw new Error(`Cannot download ${browser} ${buildId} for ${platform}`);
    }
    // 使用官方的 install 函数下载浏览器
    // Use official install function to download browser
    const installedBrowser = await install({
        browser: puppeteerBrowser,
        buildId,
        platform,
        cacheDir,
        downloadProgressCallback: options.progressCallback
            ? (downloadedBytes, totalBytes) => {
                options.progressCallback(downloadedBytes, totalBytes);
            }
            : undefined,
    });
    debugPuppeteer('Browser downloaded successfully:', installedBrowser);
    return {
        browser,
        executablePath: computeExecutablePath({
            browser: puppeteerBrowser,
            buildId,
            platform,
            cacheDir,
        }),
        buildId,
        platform: platform,
        path: installedBrowser.path,
    };
}
//# sourceMappingURL=index.js.map