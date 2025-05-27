# Running UMS Tests in Cursor IDE

This guide explains how to run Playwright tests directly from Cursor IDE.

## Prerequisites

1. **Install Playwright Extension:**
   - Open Cursor IDE
   - Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
   - Search for "Playwright Test for VSCode"
   - Install the official Microsoft Playwright extension

2. **Ensure Dependencies are Installed:**
   ```bash
   cd UMS
   npm install
   npx playwright install
   ```

## Method 1: Using VS Code Tasks (Recommended)

1. **Open Command Palette:** `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. **Type:** `Tasks: Run Task`
3. **Select one of the available tasks:**
   - `Run Widget Test (Chromium QA)` - Runs only the widget test
   - `Run All POM Tests (Chromium QA)` - Runs all POM tests
   - `Run Widget + Change Password Setup` - Runs widget and password change tests
   - `Run Tests in Debug Mode` - Runs tests with debugging enabled
   - `Open Playwright UI Mode` - Opens Playwright's interactive UI
   - `Show Test Report` - Opens the test report

## Method 2: Using Debug Configuration

1. **Open the test file:** `tests/ums-e2e-pom.spec.js`
2. **Go to Run and Debug:** `Ctrl+Shift+D` (or `Cmd+Shift+D` on Mac)
3. **Select a debug configuration:**
   - `Debug Widget Test` - Debug only the widget test
   - `Debug All POM Tests` - Debug all POM tests
   - `Debug Specific Test` - Debug the currently open test file
4. **Click the green play button** or press `F5`

## Method 3: Using Playwright Extension

1. **Install the Playwright extension** (see Prerequisites)
2. **Open the test file:** `tests/ums-e2e-pom.spec.js`
3. **You'll see play buttons** next to each test
4. **Click the play button** next to any test to run it
5. **Right-click for more options** like debug, run in UI mode, etc.

## Method 4: Using Integrated Terminal

1. **Open Terminal:** `Ctrl+`` (backtick) or `View > Terminal`
2. **Navigate to UMS directory:** `cd UMS`
3. **Run tests using npm scripts:**
   ```bash
   # Run widget test only
   npm run test:widget:chromium
   
   # Run all POM tests
   npm run test:pom:chromium:qa
   
   # Run in UI mode
   npm run test:ui
   
   # Run in debug mode
   npm run test:debug
   ```

## Environment Configuration

The tests are configured to run in QA environment by default. You can change this by:

1. **Modifying the `.vscode/settings.json`** file
2. **Setting environment variable** in terminal:
   ```bash
   export TEST_ENV=dev    # for development
   export TEST_ENV=qa     # for QA (default)
   export TEST_ENV=uat    # for UAT
   ```

## Test Execution Order

The tests are designed to run in a specific order:
1. **Widget Lead Form Test** - Creates user credentials
2. **Change password** - Updates the password
3. **All other tests** - Use the updated credentials

## Troubleshooting

### Common Issues:

1. **"Cannot read properties of undefined (reading 'match')"**
   - This is handled in the WidgetPage with error handling
   - If it persists, check that @faker-js/faker is installed

2. **"Test timeout exceeded"**
   - Increase timeout in `playwright.config.js`
   - Check if the application is accessible

3. **"Widget button not found"**
   - The widget test looks for "APPLY NOW" button
   - Ensure the landing page is loading correctly

4. **Browser not opening**
   - Check that browsers are installed: `npx playwright install`
   - Verify headless mode settings in config

### Debug Tips:

1. **Use UI Mode** for interactive debugging: `npm run test:ui`
2. **Use Debug Mode** to step through tests: `npm run test:debug`
3. **Check test reports** after failures: `npm run report`
4. **Use screenshots and videos** - automatically captured on failure

## File Structure

```
UMS/
├── .vscode/
│   ├── tasks.json          # VS Code tasks for easy test execution
│   ├── launch.json         # Debug configurations
│   └── settings.json       # Playwright extension settings
├── tests/
│   └── ums-e2e-pom.spec.js # Main POM test file (complete test suite)
├── pages/                  # Page Object Model classes
│   ├── BasePage.js         # Base page with common functionality
│   ├── LoginPage.js        # Login and authentication
│   ├── PersonalDetailsPage.js # Personal details form
│   ├── PaymentPage.js      # Payment processing
│   ├── KYCPage.js          # KYC form handling
│   ├── EducationPage.js    # Education details
│   ├── UploadDocumentsPage.js # Document uploads
│   └── WidgetPage.js       # Widget form handling
├── data/                   # Test data
│   └── testData.js         # Static and dynamic test data
├── config/                 # Environment configurations
│   └── environment.js      # Multi-environment support (dev/qa/uat)
├── services/               # External services
│   ├── EmailService.js     # Email handling for widget tests
│   └── SessionService.js   # Session management
├── documents/              # Test documents for uploads
└── playwright.config.js    # Playwright configuration
```

## Quick Start

1. Open Cursor IDE
2. Open the UMS folder
3. Press `Ctrl+Shift+P` and type "Tasks: Run Task"
4. Select "Run Widget Test (Chromium QA)"
5. Watch the test execute in the terminal panel

The test will open a browser, navigate to the widget, fill the form, and create user credentials for subsequent tests. 