import { test, expect } from '@playwright/test';
const EmailService = require('../services/EmailService');
const SessionService = require('../services/SessionService');
const WidgetPage = require('../pages/WidgetPage');

 
test.describe('Widget Lead Form Tests', () => {
    let widgetPage;
    let emailService;
    let sessionService;
  
    test.beforeEach(async ({ page }) => {
      widgetPage = new WidgetPage(page);
      sessionService = new SessionService();
      emailService = new EmailService();
    });
  
    test('should successfully submit lead form with email verification', async ({ page }) => {
      // Get email and token
      const { email, token } = await emailService.getEmail();
      console.log('Generated email:', email);
  
      // Navigate and open widget
      await widgetPage.navigate();
      await widgetPage.openWidget();
      const frame = await widgetPage.getWidgetFrame();
  
      // Fill email and get OTP
      await widgetPage.fillEmailAndGetOTP(frame, email);
  
      // Get and handle OTP
      const otp = await emailService.getOTP(token);
      await widgetPage.handleOTP(frame, otp);
  
      // Fill remaining details after OTP verification
      await widgetPage.fillRemainingDetails(frame);
  
      // Submit application
      await widgetPage.submitApplication(frame);
  
      await page.waitForTimeout(10000);
  
      // Get credentials from email
      const emailObj = await emailService.getCredentials(token);
      await sessionService.setSession(emailObj);
      // Verify success message
     // await expect(frame.getByText(/application submitted successfully/i)).toBeVisible();
    });
}); 