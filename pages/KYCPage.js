const BasePage = require('./BasePage');

class KYCPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Personal Information Locators - keeping exact same locators as original
    this.aadhaarNumberField = this.page.getByLabel('Aadhaar number');
    this.nameAsPerAadhaarField = this.page.getByLabel('Name as on Aadhaar card');
    this.motherTongueCombo = this.page.getByRole('combobox', { name: 'Mother tongue *' });
    this.maritalStatusCombo = this.page.getByRole('combobox', { name: 'Marital status *' });
    this.bloodGroupCombo = this.page.getByRole('combobox', { name: 'Blood group *' });
    
    // Parent/Guardian Details Locators
    this.fatherNameField = this.page.getByLabel('Father name');
    this.fatherOccupationField = this.page.getByLabel('Father occupation');
    this.motherNameField = this.page.getByLabel('Mother name');
    this.motherOccupationField = this.page.getByLabel('Mother occupation');
    this.guardianNameField = this.page.getByLabel('Guardian name');
    this.guardianPhoneField = this.page.locator('input[type="tel"]');
    
    // Address Details Locators
    this.correspondenceAddressLine1 = this.page.locator('[id="student\\.kycInfo\\.addressInfo\\.correspondenceAddress\\.addressLine1"]');
    this.correspondenceAddressLine2 = this.page.locator('[id="student\\.kycInfo\\.addressInfo\\.correspondenceAddress\\.addressLine2"]');
    this.correspondencePincode = this.page.locator('[id="student\\.kycInfo\\.addressInfo\\.correspondenceAddress\\.pincode"]');
    this.sameAsPermanentRadio = this.page.getByRole('radio', { name: 'Yes' });
    
    // Permanent Address Locators
    this.permanentAddressHeading = this.page.getByRole('heading', { name: 'Permanent Address' });
    this.permanentAddressLine1 = this.page.locator('[id="student\\.kycInfo\\.addressInfo\\.permanentAddress\\.addressLine1"]');
    this.permanentAddressLine2 = this.page.locator('[id="student\\.kycInfo\\.addressInfo\\.permanentAddress\\.addressLine2"]');
    this.permanentCountryCombo = this.page.getByRole('combobox', { name: 'Country *' });
    this.permanentStateCombo = this.page.getByRole('combobox', { name: 'State *' });
    this.permanentCityCombo = this.page.getByRole('combobox', { name: 'City *' });
    this.permanentPincode = this.page.locator('[id="student\\.kycInfo\\.addressInfo\\.permanentAddress\\.pincode"]');
    
    // Buttons
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.nextEducationButton = this.page.getByRole('button', { name: 'NEXT :Education & Work' });
  }

  async fillPersonalInformation(data) {
    await this.fillElement(this.aadhaarNumberField, data.aadhaarNumber);
    await this.fillElement(this.nameAsPerAadhaarField, data.nameAsPerAadhaar);
    await this.selectFirstOption(this.motherTongueCombo);
    await this.selectFirstOption(this.maritalStatusCombo);
    await this.selectFirstOption(this.bloodGroupCombo);
  }

  async fillParentGuardianDetails(data) {
    await this.fillElement(this.fatherNameField, data.fatherName);
    await this.fillElement(this.fatherOccupationField, data.fatherOccupation);
    await this.fillElement(this.motherNameField, data.motherName);
    await this.fillElement(this.motherOccupationField, data.motherOccupation);
    await this.fillElement(this.guardianNameField, data.guardianName);
    await this.fillElement(this.guardianPhoneField, data.guardianPhone);
  }

  async fillCorrespondenceAddress(addressData) {
    await this.fillElement(this.correspondenceAddressLine1, addressData.addressLine1);
    await this.fillElement(this.correspondenceAddressLine2, addressData.addressLine2);
    await this.fillElement(this.correspondencePincode, addressData.pincode);
  }

  async handlePermanentAddress(addressData) {
    await this.selectRadioButton(this.sameAsPermanentRadio);
    
    if (await this.isElementVisible(this.permanentAddressHeading)) {
      await this.fillElement(this.permanentAddressLine1, addressData.addressLine1);
      await this.fillElement(this.permanentAddressLine2, addressData.addressLine2);
      await this.selectFirstOption(this.permanentCountryCombo);
      await this.selectFirstOption(this.permanentStateCombo);
      await this.selectFirstOption(this.permanentCityCombo);
      await this.fillElement(this.permanentPincode, addressData.pincode);
    }
  }

  async fillCompleteKYCForm(data) {
    await this.fillPersonalInformation(data);
    await this.fillParentGuardianDetails(data);
    await this.fillCorrespondenceAddress(data.correspondenceAddress);
    await this.handlePermanentAddress(data.permanentAddress);
  }

  async saveKYCForm() {
    await this.clickElement(this.saveButton);
  }

  async proceedToEducation() {
    await this.clickElement(this.nextEducationButton);
  }

  async completeKYCFlow(data) {
    await this.fillCompleteKYCForm(data);
    await this.saveKYCForm();
    await this.proceedToEducation();
  }
}

module.exports = KYCPage; 