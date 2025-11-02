/**
 * @license
 * MIT License
 */
/**
 * 浏览器类型枚举
 * Browser type enumeration
 */
export type BrowserType = 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'chrome-headless-shell';
/**
 * 平台类型
 * Platform type
 */
export type Platform = 'linux' | 'mac' | 'win32' | 'win64' | 'mac_arm';
/**
 * 浏览器查找选项
 * Browser find options
 */
export interface FindBrowserOptions {
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
export interface DownloadBrowserOptions {
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
export interface BrowserInfo {
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
export interface GetDownloadPathOptions {
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
//# sourceMappingURL=index.d.ts.map