# UMS Test Automation - Page Object Model (POM) Structure

This project has been refactored to use the Page Object Model (POM) design pattern with support for multiple environments and dynamic test data.

## Quick Start - Running Widget Test

The **Widget Lead Form Test** is now the **first test case** in the suite and creates user credentials that are used by all subsequent tests.

### 🔄 Test Flow:
1. **Widget Test**: Creates a new user with temporary email and password
2. **Change Password Test**: Uses the temporary credentials to change the password
3. **All Other Tests**: Use the updated credentials from the widget test

### Run Widget Test Only
```bash
# QA Environment (default)
npm run test:widget

# Development Environment  
npm run test:widget:dev

# UAT Environment
npm run test:widget:uat

# With headed browser (to see the test running)
npx playwright test tests/ums-e2e-pom.spec.js -g "Widget Lead Form Test" --headed

# Debug mode
npx playwright test tests/ums-e2e-pom.spec.js -g "Widget Lead Form Test" --debug
```

### Run All Tests (Complete Flow)
```bash
# This will run:
# 1. Widget test (creates user)
# 2. Change password test (updates password)
# 3. All other tests (use updated credentials)
npm run test:pom
```

### Run Specific Test Sequence
```bash
# Run widget + change password only
npx playwright test tests/ums-e2e-pom.spec.js -g "Widget Lead Form Test|Change password"

# Run from change password onwards (requires widget test to have run first)
npx playwright test tests/ums-e2e-pom.spec.js -g "Change password|happy flow|KYC|Education|Upload"
```

⚠️ **Important**: 
- The widget test **must run first** to create user credentials
- All subsequent tests depend on the credentials created by the widget test
- The widget test uses placeholder selectors that need to be updated based on your actual widget implementation

## Project Structure

```
UMS/
├── config/
│   └── environment.js          # Environment configuration for dev, qa, uat
├── data/
│   └── testData.js            # Test data configuration with dynamic data support
├── pages/
│   ├── BasePage.js            # Base page with common functionality
│   ├── LoginPage.js           # Login page object
│   ├── PersonalDetailsPage.js # Personal details form page object
│   ├── PaymentPage.js         # Payment processing page object
│   ├── KYCPage.js             # KYC form page object
│   ├── EducationPage.js       # Education form page object
│   ├── UploadDocumentsPage.js # Document upload page object
│   └── WidgetPage.js          # Widget functionality page object
├── services/
│   ├── SessionService.js      # Session management service
│   └── EmailService.js        # Email handling service
├── tests/
│   ├── ums-e2e.spec.js        # Original test file
│   └── ums-e2e-pom.spec.js    # New POM-based test file
└── documents/                 # Test documents for upload
```

## Environment Support

The framework supports three environments:

### QA Environment (Default)
```bash
npm test
# or
TEST_ENV=qa npm test
```

### Development Environment
```bash
TEST_ENV=dev npm test
```

### UAT Environment
```bash
TEST_ENV=uat npm test
```

## Environment Configuration

Each environment has its own configuration in `config/environment.js`:

- **Base URL**: Environment-specific application URL
- **Timeout**: Environment-specific timeout values
- **Retries**: Environment-specific retry counts
- **Login Path**: Environment-specific login path

## Dynamic Test Data

The framework supports dynamic test data generation:

### Static Test Data
Located in `data/testData.js`, contains predefined test data for all forms.

### Dynamic Test Data
Use `getRandomTestData()` function to get randomized test data:

```javascript
const { getRandomTestData } = require('../data/testData');
const dynamicData = getRandomTestData();
```

This will randomly select from predefined variations for:
- Programs (MCOM, MBA, BBA)
- Electives (Public Accounting, Finance, Marketing)
- States and Cities
- Education levels
- Genders
- Blood groups

## Page Object Model Structure

### BasePage
Contains common functionality used across all pages:
- Element waiting and interaction methods
- Navigation utilities
- Screenshot and error handling
- Environment-aware configurations

### Page Objects
Each page object extends BasePage and contains:
- Page-specific locators (keeping exact same locators as original)
- Page-specific actions and workflows
- Data-driven form filling methods

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test tests/ums-e2e-pom.spec.js
```

### Run Tests in Different Environments
```bash
# Development
TEST_ENV=dev npx playwright test

# QA (default)
TEST_ENV=qa npx playwright test

# UAT
TEST_ENV=uat npx playwright test
```

### Run Tests in Headless Mode
```bash
npx playwright test --headed=false
```

### Run Specific Test
```bash
npx playwright test -g "Change password"
```

## Test Features

### 1. Login and Authentication
- Password change functionality
- Session management
- Multi-environment login URLs

### 2. Personal Details Form
- Dynamic form filling with randomized data
- Program and elective selection
- Address and personal information
- Radio button and checkbox handling

### 3. Payment Processing
- Payment iframe handling
- OTP generation and verification
- Error handling for server issues
- Multiple payment methods support

### 4. KYC Form
- Personal information collection
- Parent/Guardian details
- Address management (correspondence and permanent)
- Dynamic data population

### 5. Education Form
- Class 10 and 12 details
- Undergraduate information
- Work experience selection
- Board and marking scheme selection

### 6. Document Upload
- Multiple document types support
- File upload functionality
- Agreement checkbox handling
- Application submission

### 7. Widget Integration
- Widget iframe handling
- Email verification with OTP
- Lead form submission
- Credential extraction from emails

## Key Features

### 1. Exact Locator Preservation
All locators from the original test file are preserved exactly as they were, ensuring compatibility.

### 2. Dynamic Data Support
Test data can be randomized for better test coverage and to avoid data conflicts.

### 3. Environment Flexibility
Easy switching between dev, qa, and uat environments without code changes.

### 4. Error Handling
Comprehensive error handling with screenshots and detailed error messages.

### 5. Reusable Components
Page objects can be reused across different test scenarios.

### 6. Maintainable Structure
Clear separation of concerns makes the codebase easy to maintain and extend.

## Customization

### Adding New Test Data
Edit `data/testData.js` to add new test data variations:

```javascript
const variations = {
  newField: ['Option1', 'Option2', 'Option3']
};
```

### Adding New Environments
Edit `config/environment.js` to add new environment configurations:

```javascript
const environments = {
  staging: {
    baseURL: 'https://ui.staging.umsglobal.net',
    loginPath: '/#/login',
    timeout: 45000,
    retries: 1
  }
};
```

### Creating New Page Objects
1. Create a new file in the `pages/` directory
2. Extend the `BasePage` class
3. Define page-specific locators and methods
4. Import and use in test files

## Widget Implementation Notes

The `WidgetPage.js` contains placeholder selectors that need to be updated based on the actual widget implementation:

```javascript
// Update these selectors based on actual widget
this.widgetButton = this.page.locator('[data-testid="widget-button"]');
this.widgetIframe = this.page.locator('iframe[name="widget-frame"]');
```

## Best Practices

1. **Keep locators unchanged**: Don't modify existing locators to maintain compatibility
2. **Use dynamic data**: Prefer `getRandomTestData()` over static data for better test coverage
3. **Environment variables**: Always use environment-specific configurations
4. **Error handling**: Implement proper error handling in page objects
5. **Documentation**: Document any new page objects or test data additions

## Troubleshooting

### Common Issues

1. **Environment not found**: Ensure TEST_ENV is set to a valid environment (dev, qa, uat)
2. **Locator not found**: Verify that the application UI hasn't changed
3. **Timeout issues**: Adjust timeout values in environment configuration
4. **Payment failures**: Check if payment gateway is accessible in the test environment

### Debug Mode
Run tests with debug information:
```bash
DEBUG=pw:api npx playwright test
```

### Screenshots and Videos
Failed tests automatically capture screenshots and videos in the `test-results/` directory.

## Migration from Original Tests

The original test file (`ums-e2e.spec.js`) remains unchanged. The new POM-based tests are in `ums-e2e-pom.spec.js`. You can run both versions to compare functionality.

To migrate existing tests:
1. Import required page objects
2. Replace direct page interactions with page object methods
3. Use dynamic test data where appropriate
4. Update environment configurations as needed 