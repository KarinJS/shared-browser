/**
 * @license
 * MIT License
 * 
 * Playwright 网络工具
 * Playwright network utilities
 */

import https from 'node:https';
import http from 'node:http';
import { ProxyAgent } from 'proxy-agent';

export interface FetchOptions {
  headers?: Record<string, string>;
  method?: string;
  timeout?: number;
}

export async function fetchData(url: string, options: FetchOptions = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const agent = process.env.HTTP_PROXY || process.env.HTTPS_PROXY ? new ProxyAgent() : undefined;
    
    const req = protocol.get(url, {
      headers: options.headers,
      agent,
      timeout: options.timeout || 30000,
    }, (res) => {
      if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

export const NET_DEFAULT_TIMEOUT = 30000;
