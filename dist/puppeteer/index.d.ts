/**
 * @license
 * MIT License
 */
import type { FindBrowserOptions, DownloadBrowserOptions, BrowserInfo, GetDownloadPathOptions } from '../types/index.js';
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
export declare function findBrowser(options?: FindBrowserOptions): Promise<BrowserInfo | null>;
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
export declare function getDownloadPath(options: GetDownloadPathOptions): string;
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
export declare function downloadBrowser(options: DownloadBrowserOptions): Promise<BrowserInfo>;
//# sourceMappingURL=index.d.ts.map