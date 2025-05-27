// @ts-check
const { defineConfig, devices } = require('@playwright/test');
<<<<<<< HEAD
const EnvironmentConfig = require('./config/environment');
=======
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14

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
<<<<<<< HEAD
  retries: envConfig.getRetries(), // Use environment-specific retries
=======
  retries: 1, // Set retries to 1 for all tests
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list', { printSteps: true }] // Add list reporter to see retry attempts
  ],
<<<<<<< HEAD
  timeout: envConfig.getTimeout(), // Use environment-specific timeout
=======
  timeout: 60000,
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
  //globalSetup: require.resolve('./global-setup'),

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Run tests in headless or headed mode */
    headless: false,
    /* Base URL to use in actions like `await page.goto('/')`. */
<<<<<<< HEAD
    baseURL: envConfig.getBaseURL(), // Use environment-specific base URL
=======
    baseURL: 'https://ui.qa.umsglobal.net',
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
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
<<<<<<< HEAD
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
=======
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        headless: false,
        launchOptions: {
          args: ['--no-sandbox', '--start-maximized'],
          slowMo: 500,  // Increased delay between actions to 500ms
        },
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        headless: false,
        launchOptions: {
          args: ['--no-sandbox', '--start-maximized'],
          slowMo: 500,  // Increased delay between actions to 500ms
        },
      },
    },
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
  ]
});

