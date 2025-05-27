const BasePage = require('./BasePage');

class EducationPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Class 10 Education Locators - keeping exact same locators as original
    this.class10SchoolName = this.page.locator('[id="student\\.educationInfo\\.x_SchoolName"]');
    this.class10Board = this.page.getByRole('combobox', { name: 'Board *' }).first();
    this.class10YearOfPassing = this.page.locator('[id="student\\.educationInfo\\.x_YearOfPassing"]');
    this.class10MarkingScheme = this.page.getByRole('combobox', { name: 'Marking scheme *' }).first();
    this.class10Percentage = this.page.locator('[id="student\\.educationInfo\\.x_AggregatePercentage"]');
    
    // Class 12 Education Locators
    this.class12SchoolName = this.page.locator('[id="student\\.educationInfo\\.xii_SchoolName"]');
    this.class12Board = this.page.getByRole('combobox', { name: 'Board *' }).nth(1);
    this.class12YearOfPassing = this.page.locator('[id="student\\.educationInfo\\.xii_YearOfPassing"]');
    this.class12MarkingScheme = this.page.getByRole('combobox', { name: 'Marking scheme *' }).nth(1);
    this.class12Percentage = this.page.locator('[id="student\\.educationInfo\\.xii_AggregatePercentage"]');
    
    // Undergraduate Education Locators
    this.ugResultStatus = this.page.getByRole('combobox', { name: 'UG result status' });
    this.collegeName = this.page.getByRole('textbox', { name: 'College name' });
    this.university = this.page.getByRole('textbox', { name: 'University' });
    this.degree = this.page.getByRole('combobox', { name: 'Degree' });
    this.ugYearOfPassing = this.page.getByLabel('Year of passing', { exact: true });
    this.ugPercentage = this.page.getByRole('spinbutton', { name: 'Percentage/CGPA' });
    
    // Work Experience
    this.workExperienceYes = this.page.getByRole('radio', { name: 'Yes' });
    
    // Buttons
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.nextUploadButton = this.page.getByRole('button', { name: 'NEXT :Upload documents' });
    
    // Verification Elements
    this.greetingsText = this.page.getByText("Greetings");
  }

  async verifyEducationPageAccess() {
    const currentURL = this.page.url();
    const hasMyApplication = currentURL.includes('MyApplication');
    const isGreetingsVisible = await this.isElementVisible(this.greetingsText);
    
    return hasMyApplication && isGreetingsVisible;
  }

  async fillClass10Details(class10Data) {
    await this.fillElement(this.class10SchoolName, class10Data.schoolName);
    await this.selectFirstOption(this.class10Board);
    await this.fillElement(this.class10YearOfPassing, class10Data.yearOfPassing);
    await this.selectFirstOption(this.class10MarkingScheme);
    await this.fillElement(this.class10Percentage, class10Data.percentage);
  }

  async fillClass12Details(class12Data) {
    await this.fillElement(this.class12SchoolName, class12Data.schoolName);
    await this.selectFirstOption(this.class12Board);
    await this.fillElement(this.class12YearOfPassing, class12Data.yearOfPassing);
    await this.selectFirstOption(this.class12MarkingScheme);
    await this.fillElement(this.class12YearOfPassing, class12Data.yearOfPassing);
    await this.fillElement(this.class12Percentage, class12Data.percentage);
  }

  async fillUndergraduateDetails(ugData) {
    await this.selectFirstOption(this.ugResultStatus);
    await this.fillElement(this.collegeName, ugData.collegeName);
    await this.fillElement(this.university, ugData.university);
    await this.selectFirstOption(this.degree);
    await this.fillElement(this.ugYearOfPassing, ugData.yearOfPassing);
    await this.fillElement(this.ugPercentage, ugData.percentage);
  }

  async selectWorkExperience() {
    await this.selectRadioButton(this.workExperienceYes);
  }

  async fillCompleteEducationForm(educationData) {
    await this.fillClass10Details(educationData.class10);
    await this.fillClass12Details(educationData.class12);
    await this.fillUndergraduateDetails(educationData.undergraduate);
    await this.selectWorkExperience();
  }

  async saveEducationForm() {
    await this.clickElement(this.saveButton);
  }

  async proceedToUploadDocuments() {
    await this.clickElement(this.nextUploadButton);
  }

  async completeEducationFlow(educationData) {
    // First try to navigate to the Education page
    await this.navigateToEducationPage();
    
    const isAccessible = await this.verifyEducationPageAccess();
    if (!isAccessible) {
      console.log('Education page is not accessible, checking if previous steps need to be completed...');
      // Try to wait a bit and check again
      await this.waitForTimeout(2000);
      const isAccessibleAfterWait = await this.verifyEducationPageAccess();
      if (!isAccessibleAfterWait) {
        throw new Error('Education page is not accessible or user not properly logged in. Previous steps (Personal Details, Payment, KYC) might need to be completed first.');
      }
    }
    
    await this.fillCompleteEducationForm(educationData);
    await this.saveEducationForm();
    await this.proceedToUploadDocuments();
  }

  async navigateToEducationPage() {
    try {
      // Try to click on Education & Work button if it exists and is enabled
      const educationButton = this.page.getByRole('button', { name: 'Education & Work' });
      const isEducationButtonVisible = await this.isElementVisible(educationButton, 3000);
      
      if (isEducationButtonVisible) {
        const isEnabled = await educationButton.isEnabled();
        if (isEnabled) {
          await this.clickElement(educationButton);
          await this.waitForNetworkIdle();
        } else {
          console.log('Education & Work button is not enabled yet');
        }
      } else {
        console.log('Education & Work button not found, user might already be on the page');
      }
    } catch (error) {
      console.log('Could not navigate to Education page:', error.message);
    }
  }
}

module.exports = EducationPage; 