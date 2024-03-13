import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // All requests we send go to this API endpoint.
        baseURL: 'https://api.storyprotocol.net',
        extraHTTPHeaders: {
          // We set this header per GitHub guidelines.
          'accept': 'application/json',
          'content-type': 'application/json',
          // Add authorization token to all requests.
          // Assuming personal access token available in the environment.
          'X-API-Key': 'U3RvcnlQcm90b2NvbFRlc3RBUElLRVk=',
        },
      }
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
