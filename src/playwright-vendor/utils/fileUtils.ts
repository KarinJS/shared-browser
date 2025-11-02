/**
 * @license
 * MIT License
 * 
 * Playwright 文件工具
 * Playwright file utilities
 */

import fs from 'node:fs';
import { access, rm } from 'node:fs/promises';

export async function existsAsync(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function removeFolders(dirs: string[]): Promise<void> {
  await Promise.all(
    dirs.map(async (dir) => {
      try {
        await rm(dir, { recursive: true, force: true });
      } catch (error) {
        // Ignore errors
      }
    })
  );
}

export function canAccessFile(file: string): boolean {
  try {
    fs.accessSync(file);
    return true;
  } catch {
    return false;
  }
}
