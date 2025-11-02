/**
 * @license
 * MIT License
 */
import type { FindBrowserOptions, DownloadBrowserOptions, BrowserInfo, GetDownloadPathOptions } from '../types/index.js';
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
export declare function findBrowser(options?: FindBrowserOptions): Promise<BrowserInfo | null>;
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
export declare function getDownloadPath(options: GetDownloadPathOptions): string;
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
export declare function downloadBrowser(options: DownloadBrowserOptions): Promise<BrowserInfo>;
//# sourceMappingURL=index.d.ts.map