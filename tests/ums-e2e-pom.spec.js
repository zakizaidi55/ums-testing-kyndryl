const { test, expect } = require('@playwright/test');
const SessionService = require('../services/SessionService');
const EmailService = require('../services/EmailService');
const { testData, getRandomTestData } = require('../data/testData');

// Import Page Objects
const LoginPage = require('../pages/LoginPage');
const PersonalDetailsPage = require('../pages/PersonalDetailsPage');
const PaymentPage = require('../pages/PaymentPage');
const KYCPage = require('../pages/KYCPage');
const EducationPage = require('../pages/EducationPage');
const UploadDocumentsPage = require('../pages/UploadDocumentsPage');
const WidgetPage = require('../pages/WidgetPage');

test.describe("UMS End to end application Tests - POM Structure", () => {
  test.describe.configure({ retries: 1 });
  
  let loginPage, personalDetailsPage, paymentPage, kycPage, educationPage, uploadDocumentsPage, widgetPage;

  test.beforeEach(async ({ page, context }, testInfo) => {
    // Start tracing before each test (only if not already started)
    try {
      await context.tracing.start({ screenshots: true, snapshots: true });
    } catch (error) {
      if (!error.message.includes('already started')) {
        throw error;
      }
    }
    
    // Initialize Page Objects
    loginPage = new LoginPage(page);
    personalDetailsPage = new PersonalDetailsPage(page);
    paymentPage = new PaymentPage(page);
    kycPage = new KYCPage(page);
    educationPage = new EducationPage(page);
    uploadDocumentsPage = new UploadDocumentsPage(page);
    widgetPage = new WidgetPage(page);
    
    // Navigate to the login page for non-widget tests
    if (testInfo.title !== 'Widget Lead Form Test - Complete Flow') {
      await loginPage.navigateToLogin();
    }
  });

  test('Widget Lead Form Test - Complete Flow', async ({ page }) => {
    // Initialize services for email operations and session management
    const emailService = new EmailService();
    const sessionService = new SessionService();

    console.log('🚀 Starting Widget Lead Form Test...');

    // Step 1: Use EmailService to get temporary email
    const { email, token } = await emailService.getEmail();
    console.log('📧 Generated temporary email for widget:', email);

    // Step 2: Navigate to widget and fill form
    await widgetPage.navigateToWidget();
    await widgetPage.openWidget();
    const frame = await widgetPage.getWidgetFrame();

    // Step 3: Fill email and request OTP using EmailService
    await widgetPage.fillEmailAndGetOTP(frame, email);

    // Step 4: Use EmailService to get OTP from email
    const otp = await emailService.getOTP(token);
    console.log('🔐 OTP received via EmailService:', otp);
    await widgetPage.handleOTP(frame, otp);

    // Step 5: Complete widget form submission
    await widgetPage.fillRemainingDetails(frame);
    await widgetPage.submitApplication(frame);
    await page.waitForTimeout(10000);

    // Step 6: Use EmailService to get credentials from email
    const emailCredentials = await emailService.getCredentials(token);
    console.log('🔑 Credentials received via EmailService:', emailCredentials);
    
    // Step 7: Use SessionService to write temp credentials to session.json
    const sessionData = {
      UserID: emailCredentials.UserID,
      Password: emailCredentials.Password,
      isPasswordChanged: false,
      createdAt: new Date().toISOString()
    };
    
    await sessionService.setSession(sessionData);
    console.log('💾 Temp credentials written to session.json via SessionService');
    console.log('   UserID:', emailCredentials.UserID);
    console.log('   Temp Password:', emailCredentials.Password);
    
    // Step 8: Verify widget submission success
    const isSuccess = await widgetPage.verifySubmissionSuccess(frame);
    expect(isSuccess).toBeTruthy();
    console.log('✅ Widget Lead Form Test completed successfully');
  });

  test.skip('Change password', async ({ page }) => {
    // Initialize SessionService for reading/writing session data
    const sessionService = new SessionService();
    
    console.log('🔄 Starting Change Password Test...');
    
    // Step 1: Use SessionService to read credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.Password) {
      throw new Error('❌ No credentials found in session.json');
    }

    const userID = sessionData.UserID;
    const currentPassword = sessionData.Password;
    const newPassword = testData.credentials.newPassword;

    console.log('📖 Reading credentials from session.json via SessionService:');
    console.log('   UserID:', userID);
    console.log('   Current Password:', currentPassword);
    console.log('   New Password:', newPassword);

    // Step 2: Login with current credentials and change password
    await loginPage.login(userID, currentPassword);
    await loginPage.changePassword(newPassword);
    
    // Step 3: Use SessionService to update session.json with new password
    const updatedSessionData = {
      UserID: userID,
      Password: newPassword,
      isPasswordChanged: true,
      passwordChangedAt: new Date().toISOString(),
      createdAt: sessionData.createdAt || new Date().toISOString()
    };
    
    await sessionService.setSession(updatedSessionData);
    console.log('💾 Password changed and session.json updated via SessionService');
    console.log('✅ Change Password Test completed successfully');
  });

  test('happy flow: fill details, pay registration, and proceed to KYC', async ({ page }) => {
    // Initialize SessionService for reading session data
    const sessionService = new SessionService();
    
    console.log('🎯 Starting Happy Flow Test...');
    
    // Step 1: Use SessionService to read updated credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.isPasswordChanged) {
      throw new Error('❌ Widget test and change password test must run first');
    }

    let paymentPopupPage;
    
    // Get dynamic test data
    const dynamicData = getRandomTestData();
    
    const userID = sessionData.UserID;
    const password = sessionData.Password;

    console.log('📖 Reading updated credentials from session.json via SessionService:', userID);

    // Login
    await loginPage.login(userID, password);

    // Fill personal details form
    await personalDetailsPage.fillCompletePersonalDetails(dynamicData.personalDetails);

    // Handle payment
    await personalDetailsPage.clickPayNow();
    
    // Process payment through iframe
    const visibleIframe = page.locator('iframe[name="Easebuzz-Checkout"]').first();
    await expect(visibleIframe).toBeVisible({ timeout: 10000 });
    const frameElement = await visibleIframe.elementHandle();
    if (!frameElement) throw new Error('Could not get element handle for iframe!');
    const frame = await frameElement.contentFrame();
    if (!frame) throw new Error('Could not get content frame from iframe!');

    // Payment steps
    await frame.getByText('CancelPowered By').click();
    await frame.getByText('Wallets').click();
    await frame.locator('.sc-1fr5ab1-0 > .d-flex').click();

    // Handle OTP
    const page2Promise = page.waitForEvent('popup');
    await frame.getByRole('button', { name: /Pay ₹/ }).click();
    paymentPopupPage = await page2Promise;

    await paymentPopupPage.getByRole('button', { name: 'Generate OTP' }).click();
    const otp = await paymentPopupPage.locator('#random-number').textContent();
    if (!otp || !/^[0-9]{4}$/.test(otp.trim())) throw new Error('OTP not found or not 4 digits!');
    
    await paymentPopupPage.locator('#digit1').fill(otp[0]);
    await paymentPopupPage.locator('#digit2').fill(otp[1]);
    await paymentPopupPage.locator('#digit3').fill(otp[2]);
    await paymentPopupPage.locator('#digit4').fill(otp[3]);

    await paymentPopupPage.getByRole('button', { name: 'Success', exact: true }).click();

    // Save the form
    await personalDetailsPage.saveForm();
    console.log('✅ Happy Flow Test completed successfully');
  });

  test('should select fee preference and complete payment via wallet', async ({ page }) => {
    // Initialize SessionService for reading session data
    const sessionService = new SessionService();
    
    // Use SessionService to read credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.isPasswordChanged) {
      throw new Error('❌ Widget test and change password test must run first');
    }

    const userID = sessionData.UserID;
    const password = sessionData.Password;
    
    console.log('📖 Reading credentials from session.json via SessionService for payment test');
    
    await loginPage.login(userID, password);

    // Wait for payment page and process payment
    await paymentPage.waitForPaymentPage();
    const paymentSuccess = await paymentPage.processPaymentWithErrorHandling();
    
    if (paymentSuccess) {
      console.log('✅ Payment completed successfully');
    } else {
      console.log('⚠️ Payment failed or server error occurred');
    }
  });

  test('Positive KYC flow', async ({ page }) => {
    // Initialize SessionService for reading session data
    const sessionService = new SessionService();
    
    // Use SessionService to read credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.isPasswordChanged) {
      throw new Error('❌ Widget test and change password test must run first');
    }

    const userID = sessionData.UserID;
    const password = sessionData.Password;
    
    console.log('📖 Reading credentials from session.json via SessionService for KYC test');
    
    // Get dynamic test data
    const dynamicData = getRandomTestData();
    
    await loginPage.login(userID, password);
    await kycPage.completeKYCFlow(dynamicData.kycDetails);
    console.log('✅ KYC Flow Test completed successfully');
  });

  test('Validate Happy flow on Education page', async ({ page }) => {
    // Initialize SessionService for reading session data
    const sessionService = new SessionService();
    
    // Use SessionService to read credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.isPasswordChanged) {
      throw new Error('❌ Widget test and change password test must run first');
    }

    const userID = sessionData.UserID;
    const password = sessionData.Password;
    
    console.log('📖 Reading credentials from session.json via SessionService for Education test');
    
    // Get dynamic test data
    const dynamicData = getRandomTestData();
    
    await loginPage.login(userID, password);
    await educationPage.completeEducationFlow(dynamicData.educationDetails);
    console.log('✅ Education Flow Test completed successfully');
  });

  test('Positive flow submission on Upload document page', async ({ page }) => {
    // Initialize SessionService for reading session data
    const sessionService = new SessionService();
    
    // Use SessionService to read credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.isPasswordChanged) {
      throw new Error('❌ Widget test and change password test must run first');
    }

    const userID = sessionData.UserID;
    const password = sessionData.Password;
    
    console.log('📖 Reading credentials from session.json via SessionService for Upload Documents test');
    
    await loginPage.login(userID, password);
    await uploadDocumentsPage.completeDocumentUploadFlow(testData.documents);
    console.log('✅ Upload Documents Test completed successfully');
  });

  test('should handle agreement checkbox and submit button correctly', async ({ page }) => {
    // Initialize SessionService for reading session data
    const sessionService = new SessionService();
    
    // Use SessionService to read credentials from session.json
    const sessionData = await sessionService.getSession();
    if (!sessionData || !sessionData.UserID || !sessionData.isPasswordChanged) {
      throw new Error('❌ Widget test and change password test must run first');
    }

    const userID = sessionData.UserID;
    const password = sessionData.Password;
    
    console.log('📖 Reading credentials from session.json via SessionService for Agreement test');
    
    await loginPage.login(userID, password);
    await uploadDocumentsPage.completeAgreementAndSubmission();
    console.log('✅ Agreement and Submission Test completed successfully');
  });
}); 