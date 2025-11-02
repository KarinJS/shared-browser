//#region src/types/index.d.ts
/**
 * @license
 * MIT License
 */
/**
 * 浏览器类型枚举
 * Browser type enumeration
 */
type BrowserType = 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'chrome-headless-shell';
/**
 * 平台类型
 * Platform type
 */
type Platform = 'linux' | 'mac' | 'win32' | 'win64' | 'mac_arm';
/**
 * 浏览器查找选项
 * Browser find options
 */
interface FindBrowserOptions {
  /**
   * 浏览器类型
   * Browser type
   */
  browser?: BrowserType;
  /**
   * 缓存目录
   * Cache directory
   */
  cacheDir?: string;
  /**
   * 平台
   * Platform
   */
  platform?: Platform;
}
/**
 * 浏览器下载选项
 * Browser download options
 */
interface DownloadBrowserOptions {
  /**
   * 浏览器类型
   * Browser type
   */
  browser: BrowserType;
  /**
   * 构建版本ID或版本号
   * Build ID or version number
   */
  buildId?: string;
  /**
   * 缓存目录
   * Cache directory
   */
  cacheDir?: string;
  /**
   * 平台
   * Platform
   */
  platform?: Platform;
  /**
   * 进度回调函数
   * Progress callback function
   */
  progressCallback?: (downloadedBytes: number, totalBytes: number) => void;
}
/**
 * 浏览器信息
 * Browser info
 */
interface BrowserInfo {
  /**
   * 浏览器类型
   * Browser type
   */
  browser: BrowserType;
  /**
   * 可执行文件路径
   * Executable path
   */
  executablePath: string;
  /**
   * 构建ID
   * Build ID
   */
  buildId: string;
  /**
   * 平台
   * Platform
   */
  platform: Platform;
  /**
   * 浏览器安装路径
   * Browser installation path
   */
  path: string;
}
/**
 * 下载路径选项
 * Download path options
 */
interface GetDownloadPathOptions {
  /**
   * 浏览器类型
   * Browser type
   */
  browser: BrowserType;
  /**
   * 构建版本ID
   * Build ID
   */
  buildId?: string;
  /**
   * 缓存目录
   * Cache directory
   */
  cacheDir?: string;
  /**
   * 平台
   * Platform
   */
  platform?: Platform;
}
declare namespace index_d_exports$1 {
  export { downloadBrowser$1 as downloadBrowser, findBrowser$1 as findBrowser, getDownloadPath$1 as getDownloadPath };
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
declare function findBrowser$1(options?: FindBrowserOptions): Promise<BrowserInfo | null>;
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
declare function getDownloadPath$1(options: GetDownloadPathOptions): string;
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
declare function downloadBrowser$1(options: DownloadBrowserOptions): Promise<BrowserInfo>;
declare namespace index_d_exports {
  export { downloadBrowser, findBrowser, getDownloadPath };
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
declare function findBrowser(options?: FindBrowserOptions): Promise<BrowserInfo | null>;
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
declare function getDownloadPath(options: GetDownloadPathOptions): string;
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
declare function downloadBrowser(options: DownloadBrowserOptions): Promise<BrowserInfo>;
//#endregion
//#region src/index.d.ts
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
declare const _default: {
  puppeteer: typeof index_d_exports$1;
  playwright: typeof index_d_exports;
};
//#endregion
export { type BrowserInfo, type BrowserType, type DownloadBrowserOptions, type FindBrowserOptions, type GetDownloadPathOptions, type Platform, _default as default, index_d_exports as playwright, index_d_exports$1 as puppeteer };
//# sourceMappingURL=index.d.ts.map