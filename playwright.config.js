// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const EnvironmentConfig = require('./config/environment');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// Initialize environment configuration
const envConfig = new EnvironmentConfig();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: envConfig.getRetries(), // Use environment-specific retries
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list', { printSteps: true }] // Add list reporter to see retry attempts
  ],
  timeout: envConfig.getTimeout(), // Use environment-specific timeout
  //globalSetup: require.resolve('./global-setup'),

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Run tests in headless or headed mode */
    headless: false,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: envConfig.getBaseURL(), // Use environment-specific base URL
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure', // Changed to retain traces for failed tests
    screenshot: 'only-on-failure',
    video: 'retain-on-failure', // Changed to retain videos for failed tests
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: ['--no-sandbox', '--start-maximized'],
      slowMo: 500,  // Increased delay between actions to 500ms
    },
  //  storageState: 'state.json',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          args: ['--no-sandbox', '--start-maximized'],
          slowMo: 500,  // Increased delay between actions to 500ms
        },
      },
    },
    // Commented out other browsers to run only on Chromium
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     headless: false,
    //     launchOptions: {
    //       args: ['--no-sandbox', '--start-maximized'],
    //       slowMo: 500,  // Increased delay between actions to 500ms
    //     },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     headless: false,
    //     launchOptions: {
    //       args: ['--no-sandbox', '--start-maximized'],
    //       slowMo: 500,  // Increased delay between actions to 500ms
    //     },
    //   },
    // },
  ]
});

