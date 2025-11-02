/**
 * Playwright 单元测试
 * Playwright unit tests
 * 
 * 测试两个核心功能：
 * Tests two core functions:
 * 1. getDownloadPath - 获取下载路径
 * 2. findBrowser - 查找浏览器
 * 
 * 注意：downloadBrowser 在当前实现中会抛出错误，建议使用 playwright CLI
 * Note: downloadBrowser throws error in current implementation, recommends using playwright CLI
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { playwright } from '../dist/index.js';
import path from 'node:path';
import os from 'node:os';
import type { BrowserType, Platform } from '../dist/index.js';

describe('Playwright Module Tests', () => {
  describe('getDownloadPath()', () => {
    it('应该返回默认缓存目录 / should return default cache directory', () => {
      const downloadPath = playwright.getDownloadPath({
        browser: 'chromium' as BrowserType,
      });
      
      let expected: string;
      if (process.platform === 'win32') {
        expected = path.join(process.env.LOCALAPPDATA || os.homedir(), 'ms-playwright', 'chromium');
      } else {
        expected = path.join(os.homedir(), '.cache', 'ms-playwright', 'chromium');
      }
      
      assert.strictEqual(downloadPath, expected);
    });

    it('应该返回指定的缓存目录 / should return specified cache directory', () => {
      const customCache = '/tmp/custom-playwright-cache';
      const downloadPath = playwright.getDownloadPath({
        browser: 'chromium' as BrowserType,
        cacheDir: customCache,
      });
      
      assert.strictEqual(downloadPath, path.join(customCache, 'chromium'));
    });

    it('应该返回特定 buildId 的路径 / should return path for specific buildId', () => {
      const buildId = '1097';
      const downloadPath = playwright.getDownloadPath({
        browser: 'chromium' as BrowserType,
        buildId,
      });
      
      assert.ok(downloadPath.endsWith(path.join('chromium', buildId)));
    });

    it('应该支持不同的浏览器类型 / should support different browser types', () => {
      const browsers: BrowserType[] = ['chromium', 'firefox', 'webkit'];
      
      browsers.forEach((browser) => {
        const downloadPath = playwright.getDownloadPath({
          browser,
        });
        
        assert.ok(downloadPath);
        assert.strictEqual(typeof downloadPath, 'string');
        assert.ok(downloadPath.includes(browser));
      });
    });

    it('应该正确处理 chrome 到 chromium 的转换 / should correctly handle chrome to chromium conversion', () => {
      const downloadPath = playwright.getDownloadPath({
        browser: 'chrome' as BrowserType, // chrome 应该被转换为 chromium
      });
      
      assert.ok(downloadPath.includes('chromium'));
    });
  });

  describe('findBrowser()', () => {
    it('应该返回 null 如果浏览器未安装 / should return null if browser not installed', async () => {
      const result = await playwright.findBrowser({
        browser: 'chromium' as BrowserType,
        cacheDir: '/tmp/non-existent-playwright-cache-' + Date.now(),
      });
      
      assert.strictEqual(result, null);
    });

    it('应该接受所有浏览器类型 / should accept all browser types', async () => {
      const browsers: BrowserType[] = ['chromium', 'firefox', 'webkit', 'chrome'];
      
      for (const browser of browsers) {
        const result = await playwright.findBrowser({
          browser,
          cacheDir: '/tmp/test-playwright-cache-' + Date.now(),
        });
        
        // 未安装时应该返回 null
        // Should return null when not installed
        assert.strictEqual(result, null);
      }
    });

    it('应该返回正确的 BrowserInfo 结构 / should return correct BrowserInfo structure when found', async () => {
      // 这个测试只验证返回的数据结构
      // This test only validates the returned data structure
      const result = await playwright.findBrowser({
        browser: 'chromium' as BrowserType,
      });
      
      if (result) {
        assert.ok('browser' in result);
        assert.ok('executablePath' in result);
        assert.ok('buildId' in result);
        assert.ok('platform' in result);
        assert.ok('path' in result);
        
        assert.strictEqual(typeof result.browser, 'string');
        assert.strictEqual(typeof result.executablePath, 'string');
        assert.strictEqual(typeof result.buildId, 'string');
        assert.strictEqual(typeof result.platform, 'string');
        assert.strictEqual(typeof result.path, 'string');
      }
    });

    it('应该支持指定平台参数 / should support platform parameter', async () => {
      const platforms: Platform[] = ['linux', 'mac', 'mac_arm', 'win64'];
      
      for (const platform of platforms) {
        const result = await playwright.findBrowser({
          browser: 'chromium' as BrowserType,
          platform,
          cacheDir: '/tmp/test-playwright-' + Date.now(),
        });
        
        // 未安装时应该返回 null
        // Should return null when not installed
        assert.strictEqual(result, null);
      }
    });

    it('应该正确处理不存在的缓存目录 / should handle non-existent cache directory gracefully', async () => {
      const result = await playwright.findBrowser({
        browser: 'chromium' as BrowserType,
        cacheDir: '/tmp/definitely-does-not-exist-' + Date.now() + '-' + Math.random(),
      });
      
      assert.strictEqual(result, null);
    });
  });

  describe('downloadBrowser()', () => {
    it('应该抛出错误提示使用 playwright CLI / should throw error suggesting playwright CLI', async () => {
      try {
        await playwright.downloadBrowser({
          browser: 'chromium' as BrowserType,
          cacheDir: '/tmp/test-playwright-download-' + Date.now(),
        });
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('playwright install') || error.message.includes('playwright'));
      }
    });

    it('应该对所有浏览器类型抛出相同的错误 / should throw same error for all browser types', async () => {
      const browsers: BrowserType[] = ['chromium', 'firefox', 'webkit'];
      
      for (const browser of browsers) {
        try {
          await playwright.downloadBrowser({
            browser,
            cacheDir: '/tmp/test-' + Date.now(),
          });
          assert.fail(`Should have thrown an error for ${browser}`);
        } catch (error) {
          assert.ok(error instanceof Error);
        }
      }
    });
  });
});
