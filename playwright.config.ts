import { defineConfig } from '@playwright/test';
import { LaunchOptions } from '@playwright/test';
import { env } from './env';
// import Reporter from './.allure.config'

let browserOptions: LaunchOptions;

const browserOptionsLocal: LaunchOptions = {
  slowMo: 100,
  timeout: 60 * 2000,
  headless: env.playwright.isHeadlessModeEnabled,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--incognito',
    '--start-maximized',
  ],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
  logger: {

    isEnabled: () => {
      return env.playwright.isBrowserLogsEnabled;
    },
    log: (name, severity, message) => {
      console.log(`[${severity}] ${name} ${message}`);
    },
  },
  devtools: false,
  ...env.playwright.browserLaunchOptions
};

const browserOptionsCI: LaunchOptions = {
  headless: true,
  timeout: 100000,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--incognito',
    '--disable-dev-shm-usage',
  ],
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
  devtools: false,
  ...env.playwright.headlessLaunchOptions
}

export default defineConfig({
  fullyParallel: true,
  retries: env.playwright.executeType === 'CI' ? 2 : 0,
  workers: env.playwright.executeType === 'CI' ? 1 : env.playwright?.workers || 1,
  reporter: [
    ["line"],
    ['allure-playwright']//, ''],  // Pass your config here
  ],
});

if (env.playwright.executeType !== 'CI') {
  browserOptions = browserOptionsLocal;
} else {
  browserOptions = browserOptionsCI;
}

export const config = {
  browserOptions,
  defineConfig,
}