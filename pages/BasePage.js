const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
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
  }

  async uploadFile(labelLocator, filePath) {
    const fileInput = labelLocator.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    const uploadButton = this.page.getByRole('button', { name: 'Click to Upload' }).first();
    await uploadButton.waitFor({ state: 'visible' });
    await uploadButton.click();
  }
}

module.exports = BasePage; 