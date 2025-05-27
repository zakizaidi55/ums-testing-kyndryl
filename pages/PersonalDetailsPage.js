const BasePage = require('./BasePage');

class PersonalDetailsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Program Details Locators - keeping exact same locators as original
    this.programCombo = this.page.getByRole('combobox', { name: 'Program *' });
    this.electiveCombo = this.page.getByRole('combobox', { name: 'Elective *' });
    this.nationalityCombo = this.page.getByRole('combobox', { name: 'Nationality *' });
    this.currentLocationCombo = this.page.getByRole('combobox', { name: 'Current location *' });
    this.categoryCombo = this.page.getByRole('combobox', { name: 'Category *' });
    this.residenceCombo = this.page.getByRole('combobox', { name: 'Country of residence *' });
    this.stateCombo = this.page.getByRole('combobox', { name: 'State *' });
    this.cityCombo = this.page.getByRole('combobox', { name: 'City *' });
    this.highestEduCombo = this.page.getByRole('combobox', { name: 'Highest educational qualification *' });
    this.countryEduCombo = this.page.getByRole('combobox', { name: 'Country of highest education completion *' });
    this.locationCollegeCombo = this.page.getByRole('combobox', { name: 'Location of current college *' });
    this.currentEduCombo = this.page.getByRole('combobox', { name: 'Current educational qualification *' });
    this.percentageTextbox = this.page.getByRole('textbox', { name: 'Percentage/CGPA in highest' });
    this.currentCollegeDropdown = this.page.getByRole('combobox', { name: 'Current college *', exact: true });
    this.customCollegeTextbox = this.page.getByRole('textbox', { name: 'If others, please add a' });
    
    // Personal Details Locators
    this.abcIdTextbox = this.page.getByRole('textbox', { name: 'ABC Id' });
    this.debIdTextbox = this.page.getByRole('textbox', { name: 'DEB Id', exact: true });
    this.nameAsPerDEBTextbox = this.page.getByRole('textbox', { name: 'Name as per DEB Id' });
    this.emailTextbox = this.page.getByRole('textbox', { name: 'Email Id' }).first();
    this.genderDropdown = this.page.getByRole('combobox', { name: 'Gender *' });
    this.phoneInput = this.page.locator('input.iti__tel-input[type="tel"]').first();
    this.dobField = this.page.getByRole('textbox', { name: 'Date of birth' });
    
    // Radio Buttons
    this.physicallyChallengedNo = this.page.getByRole('radio', { name: 'No', exact: true }).first();
    this.militaryScholarshipNo = this.page.getByRole('radio', { name: 'No', exact: true }).nth(1);
    this.otherScholarshipYes = this.page.getByRole('radio', { name: 'Yes', exact: true }).last();
    this.otherScholarshipNo = this.page.getByRole('radio', { name: 'No', exact: true }).last();
    
    // Loan and Agreement
    this.loanCombo = this.page.getByRole('combobox', { name: 'Do you need an educational loan?' });
    this.submitAgreeCheckbox = this.page.getByRole('checkbox', { name: 'controlled' });
    
    // Buttons
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.payNowButton = this.page.getByRole('button', { name: 'Pay Now' });
  }

  async fillProgramDetails(data) {
    await this.selectFirstOption(this.programCombo);
    await this.selectFirstOption(this.electiveCombo);
    await this.selectFirstOption(this.nationalityCombo);
    await this.selectFirstOption(this.currentLocationCombo);
    await this.selectFirstOption(this.categoryCombo);
    
    await this.waitForElement(this.residenceCombo, { timeout: 5000 });
    await this.selectFirstOption(this.residenceCombo);
    
    await this.waitForElement(this.stateCombo, { timeout: 5000 });
    await this.selectFirstOption(this.stateCombo);
    
    await this.waitForElement(this.cityCombo, { timeout: 5000 });
    await this.selectFirstOption(this.cityCombo);
    
    await this.selectFirstOption(this.highestEduCombo);
    await this.selectFirstOption(this.countryEduCombo);
    await this.selectFirstOption(this.locationCollegeCombo);
    await this.selectFirstOption(this.currentEduCombo);
    
    await this.fillElement(this.percentageTextbox, data.percentage);
    
    await this.selectFirstOption(this.currentCollegeDropdown);
  }

  async fillPersonalDetails(data) {
    await this.clickElement(this.abcIdTextbox);
    await this.fillElement(this.abcIdTextbox, data.abcId);
    
    await this.clickElement(this.debIdTextbox);
    await this.fillElement(this.debIdTextbox, data.debId);
    
    await this.fillElement(this.nameAsPerDEBTextbox, data.nameAsPerDEB);
    await this.page.click('body'); // Trigger validation after filling DEB Id fields
    
    await this.fillElement(this.emailTextbox, data.email);
    await this.selectFirstOption(this.genderDropdown);
    
    // Fill phone number
    if (await this.phoneInput.isEditable()) {
      await this.phoneInput.clear();
      await this.clickElement(this.phoneInput);
      await this.fillElement(this.phoneInput, data.phoneNumber);
    }
    
    await this.clickElement(this.dobField);
    await this.fillElement(this.dobField, data.dateOfBirth);
  }

  async fillRadioButtonsAndLoan() {
    await this.waitForNetworkIdle();
    
    try {
      await this.selectRadioButton(this.physicallyChallengedNo);
      await this.selectRadioButton(this.militaryScholarshipNo);
      await this.selectRadioButton(this.otherScholarshipYes);
      await this.selectRadioButton(this.otherScholarshipNo);
      
      await this.page.click('body');
      await this.waitForTimeout(100);
      
      await this.waitForElement(this.loanCombo);
      // Always select "No" for education loan
      await this.selectOption(this.loanCombo, 'No');
      await this.waitForTimeout(100);
      
    } catch (error) {
      console.error('Error during form interaction:', error);
      throw error;
    }
  }

  async handleAgreementAndPayment(data) {
    await this.waitForElement(this.submitAgreeCheckbox);
    await this.checkCheckbox(this.submitAgreeCheckbox);
    
    // Verify payment elements are visible
    await this.waitForElement(this.payNowButton);
    
    // Verify and refill ABC ID and DEB ID if they got cleared
    await this.verifyAndRefillIds(data);
    
    // Save changes
    await this.waitForElement(this.saveButton);
    await this.clickElement(this.saveButton);
    await this.waitForNetworkIdle();
  }

  async verifyAndRefillIds(data) {
    try {
      // Check ABC ID
      const abcIdValue = await this.abcIdTextbox.inputValue();
      if (!abcIdValue || abcIdValue.trim() === '') {
        console.log('ABC ID is empty, refilling...');
        await this.clickElement(this.abcIdTextbox);
        await this.fillElement(this.abcIdTextbox, data.abcId);
      }
      
      // Check DEB ID
      const debIdValue = await this.debIdTextbox.inputValue();
      if (!debIdValue || debIdValue.trim() === '') {
        console.log('DEB ID is empty, refilling...');
        await this.clickElement(this.debIdTextbox);
        await this.fillElement(this.debIdTextbox, data.debId);
      }
      
      // Check Name as per DEB ID
      const nameAsPerDEBValue = await this.nameAsPerDEBTextbox.inputValue();
      if (!nameAsPerDEBValue || nameAsPerDEBValue.trim() === '') {
        console.log('Name as per DEB ID is empty, refilling...');
        await this.fillElement(this.nameAsPerDEBTextbox, data.nameAsPerDEB);
      }
      
      // Trigger validation after refilling
      await this.page.click('body');
      await this.waitForTimeout(500);
      
    } catch (error) {
      console.error('Error verifying/refilling IDs:', error);
    }
  }

  async fillCompletePersonalDetails(data) {
    await this.fillProgramDetails(data);
    await this.fillPersonalDetails(data);
    await this.fillRadioButtonsAndLoan();
    await this.handleAgreementAndPayment(data);
  }

  async clickPayNow() {
    await this.clickElement(this.payNowButton);
  }

  async saveForm() {
    await this.clickElement(this.saveButton);
  }
}

module.exports = PersonalDetailsPage; 