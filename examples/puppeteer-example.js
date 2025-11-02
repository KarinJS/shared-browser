/**
 * Puppeteer 浏览器下载示例
 * Puppeteer browser download example
 */

import { puppeteer } from '../dist/index.js';

async function main() {
  console.log('=== Puppeteer Browser Download Example ===\n');

  try {
    // 1. 查找已安装的 Chrome 浏览器
    // 1. Find installed Chrome browser
    console.log('1. Searching for installed Chrome browser...');
    const existingBrowser = await puppeteer.findBrowser({
      browser: 'chrome',
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
    const downloadPath = puppeteer.getDownloadPath({
      browser: 'chrome',
    });
    console.log(`✓ Download path: ${downloadPath}\n`);

    // 3. 下载浏览器（如果需要）
    // 3. Download browser (if needed)
    if (!existingBrowser) {
      console.log('3. Downloading Chrome browser...');
      console.log('   (This may take several minutes)\n');

      const downloadedBrowser = await puppeteer.downloadBrowser({
        browser: 'chrome',
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
