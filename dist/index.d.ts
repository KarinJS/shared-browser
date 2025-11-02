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
declare namespace puppeteer_d_exports {
  export { downloadBrowser$1 as downloadBrowser, findBrowser$1 as findBrowser, getDownloadPath$1 as getDownloadPath };
}
/**
 * 查找已安装的浏览器
 * Find installed browser
 */
declare function findBrowser$1(options?: FindBrowserOptions): Promise<BrowserInfo | null>;
/**
 * 获取浏览器下载路径
 * Get browser download path
 */
declare function getDownloadPath$1(options: GetDownloadPathOptions): string;
/**
 * 下载浏览器
 * Download browser
 */
declare function downloadBrowser$1(options: DownloadBrowserOptions): Promise<BrowserInfo>;
declare namespace playwright_d_exports {
  export { downloadBrowser, findBrowser, getDownloadPath };
}
/**
 * 查找已安装的浏览器
 * Find installed browser
 */
declare function findBrowser(options?: FindBrowserOptions): Promise<BrowserInfo | null>;
/**
 * 获取浏览器下载路径
 * Get browser download path
 */
declare function getDownloadPath(options: GetDownloadPathOptions): string;
/**
 * 下载浏览器
 * Download browser
 *
 * 注意：Playwright 的下载逻辑非常复杂，涉及多个内部模块。
 * 建议使用 playwright CLI 或直接安装 playwright 包来下载浏览器。
 *
 * Note: Playwright's download logic is very complex and involves multiple internal modules.
 * It's recommended to use the playwright CLI or install the playwright package directly to download browsers.
 */
declare function downloadBrowser(options: DownloadBrowserOptions): Promise<BrowserInfo>;
//#endregion
//#region src/index.d.ts
/**
 * 默认导出，提供 Puppeteer 和 Playwright 的浏览器管理功能
 * Default export providing browser management for both Puppeteer and Playwright
 */
declare const _default: {
  puppeteer: typeof puppeteer_d_exports;
  playwright: typeof playwright_d_exports;
};
//#endregion
export { type BrowserInfo, type BrowserType, type DownloadBrowserOptions, type FindBrowserOptions, type GetDownloadPathOptions, type Platform, _default as default, playwright_d_exports as playwright, puppeteer_d_exports as puppeteer };
//# sourceMappingURL=index.d.ts.map