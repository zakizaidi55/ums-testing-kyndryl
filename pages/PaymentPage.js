const BasePage = require('./BasePage');

class PaymentPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Payment Page Locators - keeping exact same locators as original
    this.paymentOptionsText = this.page.getByText('Payment Options');
    this.feePrefDropdown = this.page.getByRole('combobox', { name: 'Fee preference *' });
    this.payNowButton = this.page.getByRole('button', { name: 'Pay Now' });
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.serverErrorText = this.page.getByText('Server error');
    
    // Payment iframe locators
    this.paymentIframe = this.page.locator('iframe[name="Easebuzz-Checkout"]').first();
  }

  async waitForPaymentPage() {
    await this.waitForNetworkIdle();
    await this.page.waitForSelector('text=Payment', { timeout: 30000 });
    await this.waitForElement(this.paymentOptionsText, { timeout: 30000 });
  }

  async selectFeePreference() {
    await this.selectFirstOption(this.feePrefDropdown);
  }

  async clickPayNow() {
    await this.waitForElement(this.payNowButton);
    await this.clickElement(this.payNowButton);
  }

  async getPaymentFrame() {
    await this.waitForElement(this.paymentIframe, { timeout: 10000 });
    const frameElement = await this.paymentIframe.elementHandle();
    if (!frameElement) throw new Error('Could not get element handle for iframe!');
    
    const frame = await frameElement.contentFrame();
    if (!frame) throw new Error('Could not get content frame from iframe!');
    
    return frame;
  }

  async processWalletPayment() {
    const frame = await this.getPaymentFrame();
    
    if (frame) {
      await frame.getByText('CancelPowered By').click();
      await frame.getByText('Wallets').click();
      await frame.locator('.sc-1fr5ab1-0 > .d-flex').click();
      
      const page2Promise = this.page.waitForEvent('popup');
      await frame.getByRole('button', { name: /Pay ₹/ }).click();
      
      return await page2Promise;
    }
    
    throw new Error('Payment frame not available');
  }

  async handleOTPPayment(paymentPage) {
    const generateOtpButton = paymentPage.getByRole('button', { name: 'Generate OTP' });
    await generateOtpButton.click();
    
    const otp = await paymentPage.locator('#random-number').textContent();
    if (!otp || !/^[0-9]{4}$/.test(otp.trim())) {
      throw new Error('OTP not found or not 4 digits!');
    }
    
    // Fill the OTP digits
    await paymentPage.locator('#digit1').fill(otp[0]);
    await paymentPage.locator('#digit2').fill(otp[1]);
    await paymentPage.locator('#digit3').fill(otp[2]);
    await paymentPage.locator('#digit4').fill(otp[3]);
    
    // Click the success button
    await paymentPage.getByRole('button', { name: 'Success', exact: true }).click();
  }

  async completePaymentFlow() {
    await this.selectFeePreference();
    await this.clickPayNow();
    
    const paymentPage = await this.processWalletPayment();
    await this.handleOTPPayment(paymentPage);
    
    // Refresh the page after payment
    await this.reloadPage();
  }

  async handleServerError() {
    if (await this.isElementVisible(this.serverErrorText)) {
      const personIcon = this.page.getByTestId('PersonIcon').locator('path');
      const signOutButton = this.page.getByRole('button', { name: 'Sign Out' });
      const yesButton = this.page.getByRole('button', { name: 'Yes' });
      
      await this.clickElement(personIcon);
      await this.clickElement(signOutButton);
      await this.clickElement(yesButton);
      
      return true;
    }
    return false;
  }

  async savePayment() {
    await this.clickElement(this.saveButton);
  }

  async processPaymentWithErrorHandling() {
    try {
      await this.completePaymentFlow();
      
      const hasServerError = await this.handleServerError();
      if (!hasServerError) {
        await this.savePayment();
      }
      
      return !hasServerError;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
}

module.exports = PaymentPage; 