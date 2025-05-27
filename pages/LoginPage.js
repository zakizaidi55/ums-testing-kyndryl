const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators - keeping exact same locators as original
    this.emailTextbox = this.page.getByRole('textbox', { name: 'Email / User name' });
    this.passwordTextbox = this.page.getByRole('textbox', { name: 'Password' });
    this.loginButton = this.page.getByRole('button', { name: 'login' });
    this.newPasswordTextbox = this.page.getByRole('textbox', { name: 'New password' });
    this.confirmPasswordTextbox = this.page.getByRole('textbox', { name: 'Confirm password' });
    this.resetPasswordButton = this.page.getByRole('button', { name: 'Reset password' });
    this.greetingsText = this.page.getByText('Greetings');
    this.personIcon = this.page.getByTestId('PersonIcon').locator('path');
    this.signOutButton = this.page.getByRole('button', { name: 'Sign Out' });
    this.yesButton = this.page.getByRole('button', { name: 'Yes' });
  }

  async navigateToLogin() {
    await this.navigate('/#/login');
  }

  async login(userID, password) {
    await this.fillElement(this.emailTextbox, userID);
    await this.fillElement(this.passwordTextbox, password);
    await this.clickElement(this.loginButton);
    await this.waitForNetworkIdle();
  }

  async changePassword(newPassword) {
    await this.fillElement(this.newPasswordTextbox, newPassword);
    await this.fillElement(this.confirmPasswordTextbox, newPassword);
    await this.clickElement(this.resetPasswordButton);
  }

  async verifyLoginSuccess() {
    await this.waitForElement(this.greetingsText, { timeout: 10000 });
    return await this.isElementVisible(this.greetingsText);
  }

  async signOut() {
    await this.clickElement(this.personIcon);
    await this.clickElement(this.signOutButton);
    await this.clickElement(this.yesButton);
  }

  async verifyURLContains(urlPart) {
    const currentURL = this.page.url();
    return currentURL.includes(urlPart);
  }
}

module.exports = LoginPage; 