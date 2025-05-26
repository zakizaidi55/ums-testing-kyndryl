const BasePage = require('./BasePage');
const { faker } = require('@faker-js/faker');

class WidgetPage extends BasePage {
  constructor(page) {
    super(page);
    this.url = 'https://landing.qa.umsglobal.net/';
  }

  async navigate() {
    await this.page.goto(this.url);
  }

  async openWidget() {
    await this.page.getByRole('button', { name: 'APPLY NOW' }).click();
  }

  async getWidgetFrame() {
    const widgetFrameElement = await this.page.locator('iframe').first();
    await widgetFrameElement.scrollIntoViewIfNeeded();
    return await widgetFrameElement.contentFrame();
  }

  async fillEmailAndGetOTP(frame, email) {
    // Fill Email
    await frame.getByPlaceholder('Email').fill(email);
    
    // Click Get OTP button
    await frame.getByRole('button', { name: /get otp/i }).click();
  }

  async handleOTP(frame, otp) {
    // Fill OTP
    await frame.getByPlaceholder('Enter OTP').fill(otp);
    
    // Click Verify button
    await frame.getByRole('button', { name: /verify/i }).click();
    
    // Wait for verification to complete
   // await frame.waitForSelector('input[formcontrolname="name"]', { state: 'visible' });
  }

  async fillRemainingDetails(frame) {
    // Fill Name
    const nameInput = frame.locator('input[formcontrolname="name"]');
    await nameInput.click();
    await nameInput.fill(this.getRandomName());

    // Fill Mobile Number
    await frame.getByPlaceholder('Enter 10 Digit Mobile Number').fill(this.getRandomPhone());

    // Select Program
    await frame.locator('#mat-select-value-3').click();
    await frame.locator('mat-option').first().click();

    // Select Elective
    await frame.getByRole('combobox', { name: /elective/i }).click();
    await frame.getByRole('option').first().click();

    // Select State
    await frame.getByRole('combobox', { name: /state/i }).click();
    await frame.getByRole('option').first().click();

    // Select City
   // await frame.locator('//div[@id="mat-select-value-11"]').waitFor({ state: 'visible' });
    await frame.locator('//div[@id="mat-select-value-11"]').click();
    await frame.locator('mat-option').first().click();

    // Check consent
    await frame.getByRole('checkbox').check();
  }

  async submitApplication(frame) {
    const applyNowBtn = frame.getByRole('button', { name: /apply now/i });
    //await applyNowBtn.waitFor({ state: 'enabled' });
    await applyNowBtn.click();
  }

  getRandomName() {
    let rawName = "test" + faker.person.fullName().replace(/[^a-zA-Z\s]/g, '');
    return rawName.trim();
  }

  getRandomPhone() {
    let rawPhone = faker.phone.number().replace(/^.{2}/, "90").replace(/\D/g, '');
    return rawPhone.trim();
  }
}

module.exports = WidgetPage; 