import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  platform: 'node',
  target: 'es2022',
  external: [
    '@puppeteer/browsers',
    'playwright-core',
    'debug',
    'node:fs',
    'node:path',
    'node:os',
  ],
});
