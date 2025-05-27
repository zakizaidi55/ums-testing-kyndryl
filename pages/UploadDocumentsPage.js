const BasePage = require('./BasePage');

class UploadDocumentsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Document Upload Locators - keeping exact same locators as original
    this.passportPhotoUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.passportPhoto"]');
    this.proofOfDOBUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.proofOfDOB"]');
    this.class10MarkSheetUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.x_MarkSheet"]');
    this.class12MarkSheetUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.xii_MarkSheet"]');
    this.kycDocumentUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.kycDocument"]');
    this.abcIdCardUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.abcIdCard"]');
    this.degreeCertificateUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.degreeCertificate"]');
    this.consolidatedMarkSheetUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.consolidateMarkSheet"]');
    this.casteCertificateUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.casteCertificate"]');
    this.otherSupportingDocumentUpload = this.page.locator('[id="sfu-button-student\\.documentInfo\\.otherSupportingDocument"]');
    
    // Buttons
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.submitButton = this.page.getByRole('button', { name: 'Submit' }).last();
    
    // Agreement
    this.agreementCheckbox = this.page.getByRole('checkbox', { name: 'controlled' });
    
    // Verification Elements
    this.greetingsText = this.page.getByText("Greetings");
  }

  async verifyUploadPageAccess() {
    const currentURL = this.page.url();
    const hasMyApplication = currentURL.includes('MyApplication');
    const isGreetingsVisible = await this.isElementVisible(this.greetingsText);
    
    return hasMyApplication && isGreetingsVisible;
  }

  async uploadDocument(labelLocator, filePath) {
    await this.uploadFile(labelLocator, filePath);
  }

  async uploadAllDocuments(documentsData) {
    await this.uploadDocument(this.passportPhotoUpload, documentsData.passportPhoto);
    await this.uploadDocument(this.proofOfDOBUpload, documentsData.proofOfDOB);
    await this.uploadDocument(this.class10MarkSheetUpload, documentsData.class10MarkSheet);
    await this.uploadDocument(this.class12MarkSheetUpload, documentsData.class12MarkSheet);
    await this.uploadDocument(this.kycDocumentUpload, documentsData.kycDocument);
    await this.uploadDocument(this.abcIdCardUpload, documentsData.abcIdCard);
    await this.uploadDocument(this.degreeCertificateUpload, documentsData.degreeCertificate);
    await this.uploadDocument(this.consolidatedMarkSheetUpload, documentsData.consolidatedMarkSheet);
    await this.uploadDocument(this.casteCertificateUpload, documentsData.casteCertificate);
    await this.uploadDocument(this.otherSupportingDocumentUpload, documentsData.otherSupportingDocument);
  }

  async saveDocuments() {
    await this.clickElement(this.saveButton);
  }

  async submitApplication() {
    await this.clickElement(this.submitButton);
  }

  async handleAgreementCheckbox() {
    await this.waitForNetworkIdle();
    
    // Wait for the checkbox to be visible
    await this.waitForElement(this.agreementCheckbox);
    
    // Check if it's already checked
    const isChecked = await this.agreementCheckbox.isChecked();
    console.log(`Agreement checkbox current state: ${isChecked ? 'checked' : 'unchecked'}`);
    
    if (!isChecked) {
      console.log('Checking the agreement checkbox...');
      await this.checkCheckbox(this.agreementCheckbox);
      
      // Verify it was checked
      await this.waitForTimeout(500);
      const isNowChecked = await this.agreementCheckbox.isChecked();
      console.log(`Agreement checkbox after clicking: ${isNowChecked ? 'checked' : 'unchecked'}`);
      
      if (!isNowChecked) {
        // Try clicking directly if checkCheckbox didn't work
        await this.clickElement(this.agreementCheckbox);
        await this.waitForTimeout(500);
      }
    } else {
      console.log('Agreement checkbox is already checked');
    }
    
    await this.waitForNetworkIdle();
  }

  async completeDocumentUploadFlow(documentsData) {
    // First try to navigate to the Upload Documents page
    await this.navigateToUploadDocumentsPage();
    
    const isAccessible = await this.verifyUploadPageAccess();
    if (!isAccessible) {
      console.log('Upload documents page is not accessible, checking if previous steps need to be completed...');
      // Try to wait a bit and check again
      await this.waitForTimeout(2000);
      const isAccessibleAfterWait = await this.verifyUploadPageAccess();
      if (!isAccessibleAfterWait) {
        throw new Error('Upload documents page is not accessible or user not properly logged in. Previous steps (Personal Details, Payment, KYC, Education) might need to be completed first.');
      }
    }
    
    await this.uploadAllDocuments(documentsData);
    await this.saveDocuments();
    await this.submitApplication();
  }

  async navigateToUploadDocumentsPage() {
    try {
      // Try to click on Upload documents button if it exists and is enabled
      const uploadButton = this.page.getByRole('button', { name: 'Upload documents' });
      const isUploadButtonVisible = await this.isElementVisible(uploadButton, 3000);
      
      if (isUploadButtonVisible) {
        const isEnabled = await uploadButton.isEnabled();
        if (isEnabled) {
          await this.clickElement(uploadButton);
          await this.waitForNetworkIdle();
        } else {
          console.log('Upload documents button is not enabled yet');
        }
      } else {
        console.log('Upload documents button not found, user might already be on the page');
      }
    } catch (error) {
      console.log('Could not navigate to Upload documents page:', error.message);
    }
  }

  async completeAgreementAndSubmission() {
    // First try to navigate to the Upload Documents page
    await this.navigateToUploadDocumentsPage();
    
    // Verify we can access the page
    const isAccessible = await this.verifyUploadPageAccess();
    if (!isAccessible) {
      console.log('Upload documents page is not accessible, checking if previous steps need to be completed...');
      // Try to wait a bit and check again
      await this.waitForTimeout(2000);
      const isAccessibleAfterWait = await this.verifyUploadPageAccess();
      if (!isAccessibleAfterWait) {
        throw new Error('Upload documents page is not accessible or user not properly logged in. Previous steps might need to be completed first.');
      }
    }
    
    // Handle the agreement checkbox
    await this.handleAgreementCheckbox();
    
    // Save the documents
    await this.saveDocuments();
    
    // Submit the application
    await this.submitApplication();
  }
}

module.exports = UploadDocumentsPage; 