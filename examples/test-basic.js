/**
 * 基础功能测试
 * Basic functionality tests
 */

import { puppeteer, playwright } from '../dist/index.js';

async function testPuppeteer() {
  console.log('\n=== Testing Puppeteer Module ===\n');

  try {
    // 测试获取下载路径
    // Test getting download path
    console.log('1. Testing getDownloadPath()...');
    const downloadPath = puppeteer.getDownloadPath({
      browser: 'chrome',
    });
    console.log(`✓ Download path: ${downloadPath}`);

    // 测试查找浏览器
    // Test finding browser
    console.log('\n2. Testing findBrowser()...');
    const browserInfo = await puppeteer.findBrowser({
      browser: 'chrome',
    });
    
    if (browserInfo) {
      console.log('✓ Found browser:');
      console.log(`  - Executable: ${browserInfo.executablePath}`);
      console.log(`  - Build ID: ${browserInfo.buildId}`);
      console.log(`  - Platform: ${browserInfo.platform}`);
    } else {
      console.log('ℹ No installed browser found (this is expected if no browser is installed)');
    }

    console.log('\n✓ Puppeteer module tests passed');
    return true;
  } catch (error) {
    console.error('✗ Puppeteer module tests failed:', error);
    return false;
  }
}

async function testPlaywright() {
  console.log('\n=== Testing Playwright Module ===\n');

  try {
    // 测试获取下载路径
    // Test getting download path
    console.log('1. Testing getDownloadPath()...');
    const downloadPath = playwright.getDownloadPath({
      browser: 'chromium',
    });
    console.log(`✓ Download path: ${downloadPath}`);

    // 测试查找浏览器
    // Test finding browser
    console.log('\n2. Testing findBrowser()...');
    const browserInfo = await playwright.findBrowser({
      browser: 'chromium',
    });
    
    if (browserInfo) {
      console.log('✓ Found browser:');
      console.log(`  - Executable: ${browserInfo.executablePath}`);
      console.log(`  - Build ID: ${browserInfo.buildId}`);
      console.log(`  - Platform: ${browserInfo.platform}`);
    } else {
      console.log('ℹ No installed browser found (this is expected if no browser is installed)');
    }

    console.log('\n✓ Playwright module tests passed');
    return true;
  } catch (error) {
    console.error('✗ Playwright module tests failed:', error);
    return false;
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  shared-browser Basic Tests          ║');
  console.log('╚═══════════════════════════════════════╝');

  const results = {
    puppeteer: await testPuppeteer(),
    playwright: await testPlaywright(),
  };

  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║  Test Results                         ║');
  console.log('╚═══════════════════════════════════════╝\n');

  console.log(`Puppeteer: ${results.puppeteer ? '✓ PASSED' : '✗ FAILED'}`);
  console.log(`Playwright: ${results.playwright ? '✓ PASSED' : '✗ FAILED'}`);

  const allPassed = results.puppeteer && results.playwright;
  console.log(`\n${allPassed ? '✓ All tests passed!' : '✗ Some tests failed'}`);

  process.exit(allPassed ? 0 : 1);
}

main();
