# Shared Browser - 项目总结

## 概述

本项目实现了一个统一的浏览器下载和管理库，集成了 Puppeteer 和 Playwright 的官方浏览器管理逻辑。

## 核心设计理念

### 包装器模式而非代码复制

本项目采用**包装器模式**（Wrapper Pattern）而非直接复制 Puppeteer 和 Playwright 的源代码。这种设计有以下优势：

1. **保证一致性**: 直接使用官方包的 API，确保下载路径、URL 构建、浏览器缓存等行为与官方完全一致
2. **自动同步更新**: 当官方包更新时，只需更新依赖版本即可自动获得新功能和 bug 修复
3. **降低维护成本**: 无需手动同步官方代码的变更
4. **减少错误风险**: 避免因手动复制代码而引入的潜在错误

## 技术实现

### Puppeteer 集成

使用官方 `@puppeteer/browsers` 包：

- **查找浏览器**: 使用 `Cache` 类的 `getInstalledBrowsers()` 方法
- **路径计算**: 使用 `Cache` 类的 `installationDir()` 和 `computeExecutablePath()` 方法
- **浏览器下载**: 使用官方的 `install()` 函数
- **构建ID解析**: 使用 `resolveBuildId()` 函数

所有这些都是 Puppeteer 官方提供的公开 API，保证了与官方逻辑的完全一致性。

### Playwright 集成

使用官方 `playwright-core` 包：

- **注册表访问**: 动态导入 Playwright 的内部注册表模块
- **浏览器查找**: 使用注册表的 `findExecutable()` 方法
- **下载机制**: 使用注册表的 `install()` 方法
- **降级方案**: 提供基于文件系统的查找降级方案

## 项目结构

```
shared-browser/
├── src/
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── puppeteer/      # Puppeteer 包装器
│   │   └── index.ts
│   ├── playwright/     # Playwright 包装器
│   │   └── index.ts
│   └── index.ts        # 主入口文件
├── examples/           # 示例和测试
│   ├── puppeteer-example.js
│   ├── playwright-example.js
│   └── test-basic.js
├── dist/               # 编译输出
├── README.md           # 英文文档
├── README.zh-CN.md     # 中文文档
├── LICENSE             # MIT 许可证
├── package.json        # 项目配置
└── tsconfig.json       # TypeScript 配置
```

## 核心功能

### 1. 浏览器查找 (findBrowser)

查找本地已安装的浏览器：

```typescript
const browser = await puppeteer.findBrowser({ browser: 'chrome' });
// 或
const browser = await playwright.findBrowser({ browser: 'chromium' });
```

### 2. 获取下载路径 (getDownloadPath)

获取浏览器的安装路径：

```typescript
const path = puppeteer.getDownloadPath({ browser: 'chrome' });
// 或
const path = playwright.getDownloadPath({ browser: 'chromium' });
```

### 3. 下载浏览器 (downloadBrowser)

下载并安装浏览器：

```typescript
const browser = await puppeteer.downloadBrowser({
  browser: 'chrome',
  progressCallback: (downloaded, total) => {
    console.log(`Progress: ${(downloaded / total * 100).toFixed(2)}%`);
  }
});
```

## 技术栈

- **Node.js**: >= 18.0.0
- **包管理器**: pnpm 9.x
- **模块系统**: ESM (ES Modules)
- **类型系统**: TypeScript 5.x
- **文档**: TSDoc + 中文注释
- **依赖**:
  - `@puppeteer/browsers`: ^2.4.2
  - `playwright-core`: ^1.56.1
  - `debug`: ^4.3.4

## 代码质量保证

### 类型安全

- 完整的 TypeScript 类型定义
- TSDoc 文档注释
- 中英文双语注释

### 代码审查

所有代码通过：
- ✅ TypeScript 编译检查
- ✅ 代码审查（已解决所有反馈）
- ✅ CodeQL 安全扫描（无安全问题）

### 测试覆盖

- ✅ 基础功能测试
- ✅ Puppeteer 集成测试
- ✅ Playwright 集成测试

## 与官方包的关系

本项目**不是**对官方包的替代，而是对官方包的**封装和统一接口**：

1. **Puppeteer**: 完全使用 `@puppeteer/browsers` 的公开 API
2. **Playwright**: 完全使用 `playwright-core` 的功能
3. **统一接口**: 为两个官方包提供一致的 API 设计

## 使用场景

适合以下场景：

1. 需要同时支持 Puppeteer 和 Playwright 的项目
2. 需要统一浏览器管理接口的自动化测试框架
3. 需要可靠的浏览器下载和缓存机制的工具
4. 希望避免手动管理浏览器安装的开发者

## 未来计划

- [ ] 添加更多浏览器类型支持
- [ ] 提供浏览器版本管理功能
- [ ] 添加浏览器清理和更新功能
- [ ] 支持自定义下载源
- [ ] 提供更详细的进度报告

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
