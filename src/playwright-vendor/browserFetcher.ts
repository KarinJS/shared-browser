/**
 * @license
 * MIT License
 * 
 * Playwright 浏览器下载器
 * Playwright browser fetcher
 * 
 * 简化的 Playwright 浏览器下载实现
 * Simplified Playwright browser download implementation
 */

import fs from 'node:fs';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import extractZip from 'extract-zip';
import tarFs from 'tar-fs';
import { createGunzip } from 'node:zlib';
import { ProxyAgent } from 'proxy-agent';
import ProgressBar from 'progress';
import { debugLogger } from './utils/debugLogger.js';
import { existsAsync, removeFolders } from './utils/fileUtils.js';
import type { HostPlatform } from './utils/hostPlatform.js';

export interface BrowserDescriptor {
  name: string;
  revision: string;
  installByDefault: boolean;
  browserVersion?: string;
}

export interface DownloadOptions {
  browser: BrowserDescriptor;
  buildNumber: string;
  downloadPath: string;
  downloadURL: string;
  platform: HostPlatform;
  progressCallback?: (downloadedBytes: number, totalBytes: number) => void;
}

/**
 * 下载文件
 * Download file
 */
async function downloadFile(
  url: string,
  dest: string,
  progressCallback?: (downloaded: number, total: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const agent = process.env.HTTP_PROXY || process.env.HTTPS_PROXY ? new ProxyAgent() : undefined;

    const request = protocol.get(url, { agent }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        downloadFile(response.headers.location!, dest, progressCallback)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
      let downloadedBytes = 0;

      const file = createWriteStream(dest);
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (progressCallback) {
          progressCallback(downloadedBytes, totalBytes);
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
    });

    request.on('error', reject);
  });
}

/**
 * 解压文件
 * Extract archive
 */
async function extractArchive(archivePath: string, destPath: string): Promise<void> {
  await mkdir(destPath, { recursive: true });

  if (archivePath.endsWith('.zip')) {
    await extractZip(archivePath, { dir: destPath });
  } else if (archivePath.endsWith('.tar.gz')) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(archivePath)
        .pipe(createGunzip())
        .pipe(tarFs.extract(destPath))
        .on('finish', resolve)
        .on('error', reject);
    });
  } else {
    throw new Error(`Unsupported archive format: ${archivePath}`);
  }
}

/**
 * 下载并安装浏览器
 * Download and install browser
 */
export async function downloadBrowser(options: DownloadOptions): Promise<string> {
  const { browser, buildNumber, downloadPath, downloadURL, progressCallback } = options;

  debugLogger.log(`Downloading ${browser.name} ${buildNumber} from ${downloadURL}`);

  // 创建下载目录
  // Create download directory
  await mkdir(downloadPath, { recursive: true });

  const archiveName = path.basename(downloadURL);
  const archivePath = path.join(downloadPath, archiveName);

  // 下载文件
  // Download file
  try {
    await downloadFile(downloadURL, archivePath, progressCallback);
    debugLogger.log(`Downloaded to ${archivePath}`);
  } catch (error) {
    await removeFolders([archivePath]);
    throw error;
  }

  // 解压文件
  // Extract archive
  try {
    await extractArchive(archivePath, downloadPath);
    debugLogger.log(`Extracted to ${downloadPath}`);
  } catch (error) {
    await removeFolders([downloadPath]);
    throw error;
  }

  // 删除压缩包
  // Remove archive
  try {
    await removeFolders([archivePath]);
  } catch (error) {
    // Ignore cleanup errors
  }

  return downloadPath;
}

/**
 * 构建下载 URL
 * Build download URL
 */
export function getDownloadURL(browser: string, revision: string, platform: HostPlatform): string {
  const host = 'https://playwright.azureedge.net';
  
  let archivePrefix: string;
  let archiveSuffix: string;

  if (browser === 'chromium') {
    archivePrefix = 'chromium';
    archiveSuffix = platform === 'win64' ? 'zip' : 'zip';
    if (platform === 'linux') archiveSuffix = 'zip';
    if (platform.startsWith('mac')) archiveSuffix = 'zip';
  } else if (browser === 'firefox') {
    archivePrefix = 'firefox';
    archiveSuffix = platform === 'win64' ? 'zip' : 'tar.gz';
    if (platform.startsWith('mac')) archiveSuffix = 'zip';
  } else if (browser === 'webkit') {
    archivePrefix = 'webkit';
    archiveSuffix = platform === 'win64' ? 'zip' : 'zip';
    if (platform === 'linux') archiveSuffix = 'zip';
    if (platform.startsWith('mac')) archiveSuffix = 'zip';
  } else {
    throw new Error(`Unsupported browser: ${browser}`);
  }

  const platformStr = platform === 'mac-arm64' ? 'mac-arm64' : platform === 'mac' ? 'mac' : platform === 'win64' ? 'win64' : 'linux';
  
  return `${host}/builds/${archivePrefix}/${revision}/${archivePrefix}-${platformStr}.${archiveSuffix}`;
}
