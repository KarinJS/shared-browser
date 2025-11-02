/**
 * @license
 * MIT License
 * 
 * Playwright 调试日志
 * Playwright debug logger
 */

import debug from 'debug';

export const debugLogger = {
  log: debug('pw:browser'),
  error: debug('pw:browser:error'),
};
