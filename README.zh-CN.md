# shared-browser

A unified browser downloader for Puppeteer and Playwright.

## 简介 (Introduction)

`@karinjs/shared-browser` 是一个统一的浏览器下载和管理工具，集成了 Puppeteer 和 Playwright 的官方浏览器管理逻辑。

本项目直接使用官方的 `@puppeteer/browsers` 和 `playwright-core` 包，确保所有浏览器查找、下载路径计算和浏览器下载的逻辑都与官方完全一致。这样可以保证：

- ✅ 完全兼容官方的下载路径规则
- ✅ 使用官方的下载源和缓存机制
- ✅ 保持与官方包的同步更新
- ✅ 不会因为自定义实现导致路径错误

## Features

- 🚀 统一的浏览器管理接口，支持 Puppeteer 和 Playwright
- 📦 使用官方包的浏览器下载和缓存逻辑
- 🔍 浏览器发现和路径解析功能
- 💾 高效的浏览器缓存机制
- 🌐 支持多平台 (Windows, macOS, Linux)
- 📝 完整的 TypeScript 类型支持和 TSDoc 中文注释

## 技术栈 (Tech Stack)

- **Node.js**: >= 18.0.0
- **包管理器**: pnpm 9.x
- **模块系统**: ESM (ES Modules)
- **类型系统**: TypeScript 5.x
- **文档**: TSDoc + 中文注释

## Installation

```bash
npm install @karinjs/shared-browser
# or
pnpm add @karinjs/shared-browser
# or
yarn add @karinjs/shared-browser
```

## Requirements

- Node.js >= 18.0.0
- pnpm 9.x (推荐用于开发)

## Usage

### Puppeteer 环境

#### 查找浏览器 (Find Browser)

```typescript
import { puppeteer } from '@karinjs/shared-browser';

// 查找已安装的 Chrome 浏览器
// Find installed Chrome browser
const browserInfo = await puppeteer.findBrowser({
  browser: 'chrome',
  // 可选：指定缓存目录
  // Optional: specify cache directory
  cacheDir: '/path/to/cache',
});

if (browserInfo) {
  console.log('浏览器路径:', browserInfo.executablePath);
  console.log('构建ID:', browserInfo.buildId);
  console.log('平台:', browserInfo.platform);
}
```

#### 获取下载路径 (Get Download Path)

```typescript
import { puppeteer } from '@karinjs/shared-browser';

// 获取浏览器的下载路径
// Get browser download path
const downloadPath = puppeteer.getDownloadPath({
  browser: 'chrome',
  buildId: '121.0.6167.85', // 可选
  cacheDir: '/path/to/cache', // 可选
});

console.log('下载路径:', downloadPath);
```

#### 下载浏览器 (Download Browser)

```typescript
import { puppeteer } from '@karinjs/shared-browser';

// 下载 Chrome 浏览器
// Download Chrome browser
const browserInfo = await puppeteer.downloadBrowser({
  browser: 'chrome',
  // 可选：指定构建ID
  // Optional: specify build ID
  buildId: '121.0.6167.85',
  // 可选：指定缓存目录
  // Optional: specify cache directory
  cacheDir: '/path/to/cache',
  // 可选：下载进度回调
  // Optional: download progress callback
  progressCallback: (downloaded, total) => {
    const percent = (downloaded / total * 100).toFixed(2);
    console.log(`下载进度: ${percent}%`);
  },
});

console.log('浏览器已安装到:', browserInfo.executablePath);
```

### Playwright 环境

#### 查找浏览器 (Find Browser)

```typescript
import { playwright } from '@karinjs/shared-browser';

// 查找已安装的 Chromium 浏览器
// Find installed Chromium browser
const browserInfo = await playwright.findBrowser({
  browser: 'chromium', // 可选值: 'chromium', 'firefox', 'webkit'
  cacheDir: '/path/to/cache', // 可选
});

if (browserInfo) {
  console.log('浏览器路径:', browserInfo.executablePath);
  console.log('构建ID:', browserInfo.buildId);
}
```

#### 获取下载路径 (Get Download Path)

```typescript
import { playwright } from '@karinjs/shared-browser';

// 获取浏览器的下载路径
// Get browser download path
const downloadPath = playwright.getDownloadPath({
  browser: 'chromium',
  cacheDir: '/path/to/cache', // 可选
});

console.log('下载路径:', downloadPath);
```

#### 下载浏览器 (Download Browser)

```typescript
import { playwright } from '@karinjs/shared-browser';

// 下载 Chromium 浏览器
// Download Chromium browser
const browserInfo = await playwright.downloadBrowser({
  browser: 'chromium',
  cacheDir: '/path/to/cache', // 可选
  progressCallback: (downloaded, total) => {
    const percent = (downloaded / total * 100).toFixed(2);
    console.log(`下载进度: ${percent}%`);
  },
});

console.log('浏览器已安装到:', browserInfo.executablePath);
```

## API 文档 (API Documentation)

### Types

#### `BrowserType`

支持的浏览器类型 (Supported browser types):

- `'chromium'` - Chromium 浏览器
- `'firefox'` - Firefox 浏览器
- `'webkit'` - WebKit 浏览器 (仅 Playwright)
- `'chrome'` - Chrome 浏览器 (仅 Puppeteer)
- `'chrome-headless-shell'` - Chrome Headless Shell (仅 Puppeteer)

#### `Platform`

支持的平台 (Supported platforms):

- `'linux'` - Linux
- `'mac'` - macOS (Intel)
- `'mac_arm'` - macOS (Apple Silicon)
- `'win32'` - Windows 32-bit
- `'win64'` - Windows 64-bit

#### `FindBrowserOptions`

```typescript
interface FindBrowserOptions {
  browser?: BrowserType;    // 浏览器类型
  cacheDir?: string;         // 缓存目录
  platform?: Platform;       // 平台
}
```

#### `DownloadBrowserOptions`

```typescript
interface DownloadBrowserOptions {
  browser: BrowserType;      // 浏览器类型 (必需)
  buildId?: string;          // 构建版本ID或版本号
  cacheDir?: string;         // 缓存目录
  platform?: Platform;       // 平台
  progressCallback?: (downloadedBytes: number, totalBytes: number) => void; // 进度回调
}
```

#### `BrowserInfo`

```typescript
interface BrowserInfo {
  browser: BrowserType;      // 浏览器类型
  executablePath: string;    // 可执行文件路径
  buildId: string;           // 构建ID
  platform: Platform;        // 平台
  path: string;              // 浏览器安装路径
}
```

## Examples

查看 `examples/` 目录获取更多示例代码。

运行示例：

```bash
# Puppeteer 示例
node examples/puppeteer-example.js

# Playwright 示例
node examples/playwright-example.js
```

## 开发 (Development)

### 安装依赖 (Install Dependencies)

```bash
pnpm install
```

### 构建项目 (Build Project)

```bash
pnpm run build
```

### 代码检查 (Lint)

```bash
pnpm run lint
```

### 代码格式化 (Format)

```bash
pnpm run format
```

## 实现说明 (Implementation Notes)

本项目采用**包装器模式**而非复制代码的方式实现：

### 为什么采用包装器模式？

1. **保证一致性**: 直接使用官方包的逻辑，确保下载路径、URL、解压等行为与官方完全一致
2. **易于维护**: 当官方包更新时，只需更新依赖版本即可，无需手动同步代码
3. **减少错误**: 避免因手动复制代码而引入的潜在错误
4. **完整功能**: 获得官方包的所有功能和 bug 修复

### Puppeteer 实现

- 使用 `@puppeteer/browsers` 包
- 直接调用官方的 `install()`, `resolveBuildId()`, `Cache` 等 API
- 完全保留官方的下载逻辑和路径计算

### Playwright 实现

- 使用 `playwright-core` 包
- 通过动态导入访问内部注册表模块
- 提供降级方案以支持基本的文件系统搜索

## 注意事项 (Notes)

1. **路径一致性**: 本项目确保使用与官方包完全相同的路径规则
2. **缓存目录**: 默认缓存目录与官方包保持一致
3. **版本兼容**: 建议使用最新版本的 Node.js (>= 18)
4. **平台支持**: 完全支持 Linux、macOS 和 Windows

## License

MIT

## Contributing

欢迎提交 Issue 和 Pull Request!

Welcome to submit Issues and Pull Requests!
