import { t as __export } from "./chunk-Bp6m_JJh.js";
import { Browser, Cache, canDownload, computeExecutablePath, detectBrowserPlatform, install, resolveBuildId } from "@puppeteer/browsers";
import debug from "debug";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

//#region src/puppeteer/index.ts
var puppeteer_exports = /* @__PURE__ */ __export({
	downloadBrowser: () => downloadBrowser$1,
	findBrowser: () => findBrowser$1,
	getDownloadPath: () => getDownloadPath$1
});
const debugPuppeteer = debug("shared-browser:puppeteer");
/**
* 将内部浏览器类型转换为 Puppeteer 浏览器类型
* Convert internal browser type to Puppeteer browser type
* 
* @param browser - 浏览器类型 / Browser type
* @returns Puppeteer 浏览器类型 / Puppeteer browser type
*/
function toPuppeteerBrowser(browser) {
	switch (browser) {
		case "chrome": return Browser.CHROME;
		case "chrome-headless-shell": return Browser.CHROMEHEADLESSSHELL;
		case "chromium": return Browser.CHROMIUM;
		case "firefox": return Browser.FIREFOX;
		default: return Browser.CHROME;
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
	if (!platform) return void 0;
	return platform;
}
/**
* 获取默认缓存目录
* Get default cache directory
* 
* @returns 缓存目录路径 / Cache directory path
*/
function getDefaultCacheDir$1() {
	return path.join(os.homedir(), ".cache", "shared-browser", "puppeteer");
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
async function findBrowser$1(options = {}) {
	const browser = options.browser || "chrome";
	const cacheDir = options.cacheDir || getDefaultCacheDir$1();
	const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
	if (!platform) {
		debugPuppeteer("Could not detect platform");
		return null;
	}
	const puppeteerBrowser = toPuppeteerBrowser(browser);
	const cache = new Cache(cacheDir);
	try {
		const found = cache.getInstalledBrowsers().find((b) => b.browser === puppeteerBrowser && b.platform === platform);
		if (!found) {
			debugPuppeteer("Browser not found:", browser);
			return null;
		}
		debugPuppeteer("Found browser:", found);
		return {
			browser,
			executablePath: found.executablePath,
			buildId: found.buildId,
			platform,
			path: found.path
		};
	} catch (error) {
		debugPuppeteer("Error finding browser:", error);
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
function getDownloadPath$1(options) {
	const browser = options.browser || "chrome";
	const cacheDir = options.cacheDir || getDefaultCacheDir$1();
	const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
	if (!platform) throw new Error("Could not detect platform");
	const puppeteerBrowser = toPuppeteerBrowser(browser);
	const cache = new Cache(cacheDir);
	if (options.buildId) return cache.installationDir(puppeteerBrowser, platform, options.buildId);
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
async function downloadBrowser$1(options) {
	const browser = options.browser;
	const cacheDir = options.cacheDir || getDefaultCacheDir$1();
	const platform = toPuppeteerPlatform(options.platform) || detectBrowserPlatform();
	if (!platform) throw new Error("Could not detect platform");
	const puppeteerBrowser = toPuppeteerBrowser(browser);
	let buildId = options.buildId;
	if (!buildId) {
		debugPuppeteer("Resolving build ID for latest version");
		buildId = await resolveBuildId(puppeteerBrowser, platform, "latest");
	}
	debugPuppeteer("Downloading browser:", {
		browser,
		buildId,
		platform
	});
	if (!await canDownload({
		browser: puppeteerBrowser,
		buildId,
		platform,
		cacheDir
	})) throw new Error(`Cannot download ${browser} ${buildId} for ${platform}`);
	const installedBrowser = await install({
		browser: puppeteerBrowser,
		buildId,
		platform,
		cacheDir,
		downloadProgressCallback: options.progressCallback ? (downloadedBytes, totalBytes) => {
			options.progressCallback(downloadedBytes, totalBytes);
		} : void 0
	});
	debugPuppeteer("Browser downloaded successfully:", installedBrowser);
	return {
		browser,
		executablePath: computeExecutablePath({
			browser: puppeteerBrowser,
			buildId,
			platform,
			cacheDir
		}),
		buildId,
		platform,
		path: installedBrowser.path
	};
}

//#endregion
//#region src/playwright/index.ts
var playwright_exports = /* @__PURE__ */ __export({
	downloadBrowser: () => downloadBrowser,
	findBrowser: () => findBrowser,
	getDownloadPath: () => getDownloadPath
});
const debugPlaywright = debug("shared-browser:playwright");
let registryModule = null;
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
	if (registryModule) return registryModule;
	try {
		const playwrightPath = (await import("playwright-core")).__filename || new URL(import.meta.url).pathname.replace(/\/[^/]+$/, "");
		const registryPath = path.resolve(path.dirname(playwrightPath), "node_modules", "playwright-core", "lib", "server", "registry", "index.js");
		if (fs.existsSync(registryPath)) {
			registryModule = await import(registryPath);
			debugPlaywright("Loaded registry module from:", registryPath);
		} else debugPlaywright("Registry module not found at expected path:", registryPath);
	} catch (error) {
		debugPlaywright("Error loading registry module:", error);
	}
	return registryModule;
}
/**
* 检测当前平台
* Detect current platform
* 
* @returns 平台类型 / Platform type
*/
function detectPlatform() {
	const platform = os.platform();
	const arch = os.arch();
	if (platform === "darwin") return arch === "arm64" ? "mac_arm" : "mac";
	else if (platform === "linux") return "linux";
	else if (platform === "win32") return "win64";
	return "linux";
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
function getDefaultCacheDir() {
	if (process.platform === "win32") return path.join(process.env.LOCALAPPDATA || os.homedir(), "ms-playwright");
	return path.join(os.homedir(), ".cache", "ms-playwright");
}
/**
* 将内部浏览器类型转换为 Playwright 浏览器名称
* Convert internal browser type to Playwright browser name
* 
* @param browser - 浏览器类型 / Browser type
* @returns Playwright 浏览器名称 / Playwright browser name
*/
function toPlaywrightBrowserName(browser) {
	switch (browser) {
		case "chrome":
		case "chromium": return "chromium";
		case "firefox": return "firefox";
		case "webkit": return "webkit";
		default: return "chromium";
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
async function findBrowser(options = {}) {
	const browser = options.browser || "chromium";
	const cacheDir = options.cacheDir || getDefaultCacheDir();
	const platform = options.platform || detectPlatform();
	const browserName = toPlaywrightBrowserName(browser);
	try {
		const registry = await getRegistryModule();
		if (!registry) {
			debugPlaywright("Registry module not available, using basic search");
			return findBrowserFallback(browserName, cacheDir, platform);
		}
		const registryInstance = registry.registry || registry.default && registry.default.registry;
		if (!registryInstance) return findBrowserFallback(browserName, cacheDir, platform);
		const executable = registryInstance.findExecutable(browserName);
		if (!executable || !executable.executablePath) {
			debugPlaywright("Browser not found:", browserName);
			return null;
		}
		debugPlaywright("Found browser:", executable);
		return {
			browser,
			executablePath: executable.executablePath,
			buildId: executable.browserVersion || "unknown",
			platform,
			path: path.dirname(executable.executablePath)
		};
	} catch (error) {
		debugPlaywright("Error finding browser:", error);
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
function findBrowserFallback(browserName, cacheDir, platform) {
	try {
		const browserType = [
			"chromium",
			"firefox",
			"webkit",
			"chrome",
			"chrome-headless-shell"
		].includes(browserName) ? browserName : "chromium";
		const browserDir = path.join(cacheDir, browserName);
		if (!fs.existsSync(browserDir)) {
			debugPlaywright("Browser directory does not exist:", browserDir);
			return null;
		}
		const dirs = fs.readdirSync(browserDir);
		for (const dir of dirs) {
			const fullPath = path.join(browserDir, dir);
			if (!fs.statSync(fullPath).isDirectory()) continue;
			let executableName;
			let executablePath;
			if (platform === "win64" || platform === "win32") {
				executableName = browserName === "firefox" ? "firefox.exe" : "chrome.exe";
				executablePath = path.join(fullPath, executableName);
			} else if (platform.startsWith("mac")) if (browserName === "chromium") executablePath = path.join(fullPath, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium");
			else if (browserName === "firefox") executablePath = path.join(fullPath, "firefox", "Nightly.app", "Contents", "MacOS", "firefox");
			else executablePath = path.join(fullPath, "pw_run.sh");
			else executablePath = path.join(fullPath, browserName);
			if (fs.existsSync(executablePath)) return {
				browser: browserType,
				executablePath,
				buildId: dir,
				platform,
				path: fullPath
			};
		}
		return null;
	} catch (error) {
		debugPlaywright("Error in fallback browser search:", error);
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
function getDownloadPath(options) {
	const browser = options.browser || "chromium";
	const cacheDir = options.cacheDir || getDefaultCacheDir();
	const browserName = toPlaywrightBrowserName(browser);
	if (options.buildId) return path.join(cacheDir, browserName, options.buildId);
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
async function downloadBrowser(options) {
	const browser = options.browser;
	const cacheDir = options.cacheDir || getDefaultCacheDir();
	const platform = options.platform || detectPlatform();
	const browserName = toPlaywrightBrowserName(browser);
	debugPlaywright("Downloading browser:", {
		browser: browserName,
		cacheDir,
		platform
	});
	try {
		const registry = await getRegistryModule();
		if (!registry) throw new Error("Unable to load Playwright registry module. Please ensure playwright-core is installed correctly.");
		const registryInstance = registry.registry || registry.default && registry.default.registry;
		if (!registryInstance) throw new Error("Unable to access Playwright registry instance.");
		const descriptor = registryInstance.findExecutable(browserName);
		if (!descriptor) throw new Error(`Browser descriptor not found for: ${browserName}`);
		await registryInstance.install([descriptor], { progressCallback: options.progressCallback });
		debugPlaywright("Browser downloaded successfully");
		const installed = await findBrowser({
			browser,
			cacheDir,
			platform
		});
		if (!installed) throw new Error("Browser was downloaded but could not be found");
		return installed;
	} catch (error) {
		debugPlaywright("Error downloading browser:", error);
		throw new Error(`Failed to download ${browser}: ${error instanceof Error ? error.message : String(error)}`);
	}
}

//#endregion
//#region src/index.ts
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
var src_default = {
	puppeteer: puppeteer_exports,
	playwright: playwright_exports
};

//#endregion
export { src_default as default, playwright_exports as playwright, puppeteer_exports as puppeteer };
//# sourceMappingURL=index.js.map