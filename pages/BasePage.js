<<<<<<< HEAD
const EnvironmentConfig = require('../config/environment');
=======
const { expect } = require('@playwright/test');
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14

class BasePage {
  constructor(page) {
    this.page = page;
<<<<<<< HEAD
    this.envConfig = new EnvironmentConfig();
  }

  async navigate(path = '') {
    const url = this.envConfig.getBaseURL() + path;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator, options = {}) {
    const defaultOptions = { 
      state: 'visible', 
      timeout: this.envConfig.getTimeout() 
    };
    await locator.waitFor({ ...defaultOptions, ...options });
  }

  async clickElement(locator, options = {}) {
    await this.waitForElement(locator);
    await locator.click(options);
  }

  async fillElement(locator, value, options = {}) {
    await this.waitForElement(locator);
    await locator.fill(value, options);
  }

  async selectOption(comboboxLocator, optionName, exact = false) {
    await this.waitForElement(comboboxLocator);
    await comboboxLocator.click();
    const optionLocator = this.page.getByRole('option', { name: optionName, exact });
    await this.waitForElement(optionLocator);
    await optionLocator.click();
  }

  async selectFirstOption(comboboxLocator) {
    await this.waitForElement(comboboxLocator);
    
    // Check if the combobox already has a value
    try {
      const currentValue = await comboboxLocator.inputValue();
      if (currentValue && currentValue.trim() !== '') {
        console.log(`Dropdown already has value: ${currentValue}, skipping selection`);
        return;
      }
    } catch (error) {
      // If inputValue fails, continue with selection
      console.log('Could not check current value, proceeding with selection');
    }
    
    await comboboxLocator.click();
    
    // Wait for options to load and select the first one
    try {
      const firstOption = this.page.getByRole('option').first();
      await this.waitForElement(firstOption, { timeout: 10000 });
      await firstOption.click();
    } catch (error) {
      console.log('Could not select first option, dropdown might already be populated');
      // Press Escape to close the dropdown if it's open
      await this.page.keyboard.press('Escape');
    }
  }

  async selectRadioButton(radioLocator) {
    await this.waitForElement(radioLocator);
    await radioLocator.click();
    await this.page.waitForTimeout(100);
  }

  async checkCheckbox(checkboxLocator) {
    await this.waitForElement(checkboxLocator);
    const isChecked = await checkboxLocator.isChecked();
    if (!isChecked) {
      await checkboxLocator.check();
    }
=======
  }

  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickButton(name) {
    await this.page.getByRole('button', { name }).click();
  }

  async fillInput(name, value) {
    await this.page.getByRole('textbox', { name, exact: true}).fill(value);
  }

  async selectDropdown(name, option) {
    const dropdown = this.page.getByRole('combobox', { name , exact: true});
    await dropdown.click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
  }

  async uploadFile(labelLocator, filePath) {
    const fileInput = labelLocator.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
<<<<<<< HEAD
    
    const uploadButton = this.page.getByRole('button', { name: 'Click to Upload' }).first();
    await this.waitForElement(uploadButton);
    await uploadButton.click();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async getElementText(locator) {
    await this.waitForElement(locator);
    return await locator.textContent();
  }

  async isElementVisible(locator, timeout = 5000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isElementEnabled(locator, timeout = 5000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return await locator.isEnabled();
    } catch {
      return false;
    }
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async reloadPage() {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }
=======
    const uploadButton = this.page.getByRole('button', { name: 'Click to Upload' }).first();
    await uploadButton.waitFor({ state: 'visible' });
    await uploadButton.click();
  }
>>>>>>> 6fc6f92cfcf6eb69c6f6297890a265b63416dc14
}

module.exports = BasePage; 