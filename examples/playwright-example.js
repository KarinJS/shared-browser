/**
 * Playwright 浏览器下载示例
 * Playwright browser download example
 */

import { playwright } from '../dist/index.js';

async function main() {
  console.log('=== Playwright Browser Download Example ===\n');

  try {
    // 1. 查找已安装的 Chromium 浏览器
    // 1. Find installed Chromium browser
    console.log('1. Searching for installed Chromium browser...');
    const existingBrowser = await playwright.findBrowser({
      browser: 'chromium',
    });

    if (existingBrowser) {
      console.log('✓ Found installed browser:');
      console.log(`  - Path: ${existingBrowser.executablePath}`);
      console.log(`  - Build ID: ${existingBrowser.buildId}`);
      console.log(`  - Platform: ${existingBrowser.platform}`);
      console.log('');
    } else {
      console.log('✗ No installed browser found\n');
    }

    // 2. 获取下载路径
    // 2. Get download path
    console.log('2. Getting download path...');
    const downloadPath = playwright.getDownloadPath({
      browser: 'chromium',
    });
    console.log(`✓ Download path: ${downloadPath}\n`);

    // 3. 下载浏览器（如果需要）
    // 3. Download browser (if needed)
    if (!existingBrowser) {
      console.log('3. Downloading Chromium browser...');
      console.log('   (This may take several minutes)\n');

      const downloadedBrowser = await playwright.downloadBrowser({
        browser: 'chromium',
        progressCallback: (downloaded, total) => {
          const percent = ((downloaded / total) * 100).toFixed(2);
          process.stdout.write(`   Progress: ${percent}%\r`);
        },
      });

      console.log('\n✓ Browser downloaded successfully:');
      console.log(`  - Path: ${downloadedBrowser.executablePath}`);
      console.log(`  - Build ID: ${downloadedBrowser.buildId}`);
      console.log(`  - Platform: ${downloadedBrowser.platform}`);
    } else {
      console.log('3. Browser already installed, skipping download\n');
    }

    console.log('\n=== Example completed successfully ===');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
