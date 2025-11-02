/**
 * @license
 * MIT License
 * 
 * Playwright 平台检测工具
 * Playwright platform detection utilities
 */

import os from 'node:os';

export type HostPlatform = 'linux' | 'mac' | 'mac-arm64' | 'win64';

export function hostPlatform(): HostPlatform {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'mac-arm64' : 'mac';
  }
  if (platform === 'linux') {
    return 'linux';
  }
  if (platform === 'win32') {
    return 'win64';
  }
  throw new Error(`Unsupported platform: ${platform}`);
}

export function shortPlatform(): string {
  return hostPlatform();
}
