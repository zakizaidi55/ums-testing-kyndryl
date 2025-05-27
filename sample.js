import { test, expect } from '@playwright/test';
 
// Helper to get a timestamp string
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

test.describe("UMS Global Upload Document Page Tests", async() => {
    test.beforeEach(async ({ page, context }, testInfo) => {
        // Start tracing before each test
        await context.tracing.start({ screenshots: true, snapshots: true });
        // Navigate to the KYC page before each test
        await page.goto('https://ui.qa.umsglobal.net/#/login');
    });

    test('should show required field errors on empty form submission on Upload document page', async ({ page }) => {
        await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000890');
        await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
        await page.getByRole('button', { name: 'login' }).click();
        
    
        // Verify successful login (adjust these assertions based on the actual application behavior)
        await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
        await expect(page.getByText("Greetings")).toBeVisible();
        

        await page.setInputFiles('input[type="file"]', './documents/photograph.pdf');
        await page.setInputFiles('input[type="file"]', './documents/dob.pdf');


      });
    
});



// =====




import { test, expect } from '@playwright/test';
 
// Helper to get a timestamp string
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

/**
 * Uploads a file using a label locator that contains a hidden input[type="file"],
 * then clicks the provided upload button.
 * @param {import('@playwright/test').Locator} labelLocator - Locator for the label containing the input[type="file"].
 * @param {string} filePath - Path to the file to upload.
 * @param {import('@playwright/test').Locator} uploadButtonLocator - Locator for the "Click to Upload" button.
 */
async function uploadFileAndClickButton(labelLocator, filePath, uploadButtonLocator) {
  // Find the input[type="file"] inside the label
  const fileInput = labelLocator.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  // Click the upload button
  await uploadButtonLocator.click();
}

test.describe("UMS Global Upload Document Page Tests", async() => {
    test.beforeEach(async ({ page, context }, testInfo) => {
        // Start tracing before each test
        await context.tracing.start({ screenshots: true, snapshots: true });
        // Navigate to the KYC page before each test
        await page.goto('https://ui.qa.umsglobal.net/#/login');
    });

    test('should show required field errors on empty form submission on Upload document page', async ({ page }) => {
        await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000890');
        await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
        await page.getByRole('button', { name: 'login' }).click();
        
    
        // Verify successful login (adjust these assertions based on the actual application behavior)
        await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
        await expect(page.getByText("Greetings")).toBeVisible();
        

        await uploadFileInsideLabel(
            page.locator('[id="sfu-button-student\\.documentInfo\\.passportPhoto"]'),
            './documents/photograph.pdf'
        );
        await uploadFileInsideLabel(
            page.locator('[id="sfu-button-student\\.documentInfo\\.proofOfDOB"]'),
            './documents/dob.pdf'
        );


      });
    
});


import { test, expect } from '@playwright/test';
 
test.describe("UMS End to end application Tests", async() => {
  test.describe.configure({ retries: 1 });
  test.beforeEach(async ({ page, context }, testInfo) => {
      // Start tracing before each test
      await context.tracing.start({ screenshots: true, snapshots: true });
      // Navigate to the KYC page before each test
      await page.goto('https://ui.qa.umsglobal.net/#/login');
  });
 
  /**
* Uploads a file using a label locator that contains a hidden input[type="file"],
* then clicks the first visible "Click to Upload" button on the page.
* @param {import('@playwright/test').Page} page - The Playwright page object.
* @param {import('@playwright/test').Locator} labelLocator - Locator for the label containing the input[type="file"].
* @param {string} filePath - Path to the file to upload.
*/
  async function uploadFileAndClickButton(page, labelLocator, filePath) {
    const fileInput = labelLocator.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    // Wait for the "Click to Upload" button to appear and be enabled
    const uploadButton = page.getByRole('button', { name: 'Click to Upload' }).first();
    await uploadButton.waitFor({ state: 'visible' });
    await uploadButton.click();
  }
 
 
  test('happy flow: fill details, pay registration, and proceed to KYC', async ({ page }) => {
    let paymentPage;
    // Go to personal details page with proper navigation
    await page.waitForLoadState('networkidle');
  
    // Login
    await page.getByRole('textbox', { name: 'Email / User name' }).fill('sharda0000000921');
    await page.getByRole('textbox', { name: 'Password' }).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    await page.waitForLoadState('networkidle');
  
    // // Verify we're logged in
    // await expect(page.getByText('Greetings')).toBeVisible({ timeout: 10000 });
  
    // Wait for Program details section
    // await page.getByText('Program details').waitFor({ state: 'visible', timeout: 1000 });
  
    // Fill all required fields (use valid demo data)
    const programCombo = page.getByRole('combobox', { name: 'Program *' });
    await programCombo.click();
    await page.getByRole('option', { name: 'MCOM' }).click();
  
    const electiveCombo = page.getByRole('combobox', { name: 'Elective *' });
    await electiveCombo.click();
    await page.getByRole('option', { name: 'Public Accounting' }).click();
 
    
  
    const nationalityCombo = page.getByRole('combobox', { name: 'Nationality *' });
    await nationalityCombo.click();
    await page.getByRole('option', { name: 'Indian' }).click();
  
    const locationCombo = page.getByRole('combobox', { name: 'Current location *' });
    await locationCombo.click();
    await page.getByRole('option', { name: 'India', exact: true }).click();
    const categoryCombo = page.getByRole('combobox', { name: 'Category *' });
    await categoryCombo.click();
    await page.getByRole('option', { name: 'General' }).click();
  
    const residenceCombo = page.getByRole('combobox', { name: 'Country of residence *' });
    await expect(residenceCombo).toBeVisible({ timeout: 5000 });
    await expect(residenceCombo).toBeEnabled({ timeout: 5000 });
    await residenceCombo.click();
    await page.getByRole('option', { name: 'India', exact: true }).click();
  
    const stateCombo = page.getByRole('combobox', { name: 'State *' });
    await expect(stateCombo).toBeVisible({ timeout: 5000 });
    await expect(stateCombo).toBeEnabled({ timeout: 5000 });
    await stateCombo.click();
    await page.getByRole('option', { name: 'Meghalaya' }).click();
  
    const cityCombo = page.getByRole('combobox', { name: 'City *' });
    await expect(cityCombo).toBeVisible({ timeout: 5000 });
    await expect(cityCombo).toBeEnabled({ timeout: 5000 });
    await cityCombo.click();
    await page.getByRole('option', { name: 'East Garo Hills' }).click();
 
  
    const highestEduCombo = page.getByRole('combobox', { name: 'Highest educational qualification *' });
    await highestEduCombo.click();
    await page.getByRole('option', { name: 'B.A',exact: true }).click();
  
    const countryEduCombo = page.getByRole('combobox', { name: 'Country of highest education completion *' });
    await countryEduCombo.click();
    await page.getByRole('option', { name: 'India', exact: true }).click();
  
    const locationCollegeCombo = page.getByRole('combobox', { name: 'Location of current college *' });
    await locationCollegeCombo.click();
    await page.getByRole('option', { name: 'Delhi', exact: true }).click();
    
    const currentEduCombo = page.getByRole('combobox', { name: 'Current educational qualification *' });
    await currentEduCombo.click();
    await page.getByRole('option', { name: 'UG', exact: true }).click();
    
    await page.getByRole('textbox', { name: 'Percentage/CGPA in highest' }).fill('75');
    
    const currentCollegeDropdown = page.getByRole('combobox', { name: 'Current college *', exact: true });
    await currentCollegeDropdown.click();
    await page.getByRole('option', { name: 'Others' }).click();
    await expect(currentCollegeDropdown).toHaveValue('Others');
    await page.getByRole('textbox', { name: 'If others, please add a' }).fill('Test College');
  
    // Fill DEB ID details
 
    const abcIdTextbox = page.getByRole('textbox', { name: 'ABC Id' });
    await abcIdTextbox.click();
    await abcIdTextbox.fill('123456789012');
 
    const debIdTextbox = page.getByRole('textbox', { name: 'DEB Id', exact: true });
    await debIdTextbox.click();
    await debIdTextbox.fill('123412341234');
 
    await page.getByRole('textbox', { name: 'Name as per DEB Id' }).fill('Test Name');
    await page.click('body'); // Trigger validation after filling DEB Id fields
    await page.getByRole('textbox', { name: 'Email Id' }).first().fill('test@example.com');
    
    // Gender selection
    const genderDropdown = page.getByRole('combobox', { name: 'Gender *' });
    await genderDropdown.click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    
    // Fill phone number
    const phoneInput = page.locator('input.iti__tel-input[type="tel"]').first();
    if (await phoneInput.isEditable()) {
      await phoneInput.clear();
      await phoneInput.click();
      await phoneInput.fill('9876543210');
    }
  
    // Fill date of birth
    const dobField = page.getByRole('textbox', { name: 'Date of birth' });
    await dobField.click();
    await dobField.fill('01-01-2000');
 
    // Wait for the form to be ready before interacting with radio buttons
    await page.waitForLoadState('networkidle');
 
    try {
 
      const physicallyChallengedNo = page.getByRole('radio', { name: 'No', exact: true }).first();
      await physicallyChallengedNo.click();
      await page.waitForTimeout(100);
 
      // Military scholarship radio buttons
      const militaryScholarshipNo = page.getByRole('radio', { name: 'No', exact: true }).nth(1);
      await militaryScholarshipNo.click();
      await page.waitForTimeout(100);
 
      // Other scholarship radio buttons
      const otherScholarshipYes = page.getByRole('radio', { name: 'Yes', exact: true }).last();
      await otherScholarshipYes.click();
      await page.waitForTimeout(100);
 
      const otherScholarshipNo = page.getByRole('radio', { name: 'No', exact: true }).last();
      await otherScholarshipNo.click();
      await page.waitForTimeout(100);
 
      // Click body to ensure all radio button changes are registered
      await page.click('body');
      await page.waitForTimeout(100);
 
      // Select loan option
      const loanCombo = page.getByRole('combobox', { name: 'Do you need an educational loan?' });
      await loanCombo.waitFor({ state: 'visible' });
      await loanCombo.click();
      await page.waitForTimeout(100);
      
      const loanOption = page.getByRole('option', { name: 'No' });
      await loanOption.waitFor({ state: 'visible' });
      await loanOption.click();
      await page.waitForTimeout(100);
 
      // Wait for payment section
      const submitAgreeCheckbox = page.getByRole('checkbox', { name: 'controlled' });
      await submitAgreeCheckbox.waitFor({ state: 'visible' });
      const isSubmitChecked = await submitAgreeCheckbox.isChecked();
      if (!isSubmitChecked) {
        await submitAgreeCheckbox.check();
      }
      //await page.waitForTimeout(100);
 
      // Verify payment elements are visible
     // await expect(page.getByText('Downpayment fees (non-')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Pay Now' })).toBeVisible();
 
      // Save changes
      const saveButton = page.getByRole('button', { name: 'Save' });
      await saveButton.waitFor({ state: 'visible' });
      await saveButton.click();
      await page.waitForLoadState('networkidle');
 
    } catch (error) {
      console.error('Error during form interaction:', error);
      throw error;
    }
 
    // Handle payment
    const payNowBtn = page.getByRole('button', { name: 'Pay Now' });
    await payNowBtn.click();
    // Handle payment iframe
    const visibleIframe = page.locator('iframe[name="Easebuzz-Checkout"]').first();
    await expect(visibleIframe).toBeVisible({ timeout: 10000 });
    const frameElement = await visibleIframe.elementHandle();
    if (!frameElement) throw new Error('Could not get element handle for iframe!');
    const frame = await frameElement.contentFrame();
    if (!frame) throw new Error('Could not get content frame from iframe!');
  
    // Payment steps
    await frame.getByText('CancelPowered By').click();
    await frame.getByText('Wallets').click();
    await frame.locator('.sc-1fr5ab1-0 > .d-flex').click();
  
    // Handle OTP
    const page2Promise = page.waitForEvent('popup');
    await frame.getByRole('button', { name: /Pay ₹/ }).click();
    paymentPage = await page2Promise;
  
    await paymentPage.getByRole('button', { name: 'Generate OTP' }).click();
    const otp = await paymentPage.locator('#random-number').textContent();
    if (!otp || !/^[0-9]{4}$/.test(otp.trim())) throw new Error('OTP not found or not 4 digits!');
    
    await paymentPage.locator('#digit1').fill(otp[0]);
    await paymentPage.locator('#digit2').fill(otp[1]);
    await paymentPage.locator('#digit3').fill(otp[2]);
    await paymentPage.locator('#digit4').fill(otp[3]);
  
    await paymentPage.getByRole('button', { name: 'Success', exact: true }).click();
  
   
  //  await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Save' }).click();
  //  page.waitForTimeout(1000);
    await expect(page.getByRole('button', { name: 'NEXT :Payment/Loan'})).click();
  });
 
   
  test('should select fee preference and complete payment via wallet', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000921');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();

    // Wait for navigation and network idle
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.waitForSelector('text=Payment', { timeout: 30000 });
  
    // Wait for Payment/Loan step to be visible
    await page.getByText('Payment Options').waitFor({ state: 'visible', timeout: 30000 });
  
    // Select Fee Preference (choose the first available option for demo)
    const feePrefDropdown = page.getByRole('combobox', { name: 'Fee preference *' });
    await expect(feePrefDropdown).toBeVisible();
    await feePrefDropdown.click();
    // Wait for options and select the first one (customize as needed)
    const firstOption = page.getByRole('option').first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();
  
    // Click the Pay Now button
    const payNowBtn = page.getByRole('button', { name: 'Pay Now' });
    await expect(payNowBtn).toBeVisible();
    await payNowBtn.click();
  
    // Wait for the payment modal to appear (Easebuzz)
    // await page.getByText('Select Payment Method', { exact: false }).waitFor({ state: 'visible', timeout: 10000 });
  
    // Wait for the payment iframe to appear
    const visibleIframe = page.locator('iframe[name="Easebuzz-Checkout"]').first();
    // await expect(visibleIframe).toBeVisible({ timeout: 10000 });
    const frameElement = await visibleIframe.elementHandle();
    if (!frameElement) throw new Error('Could not get element handle for iframe!');
    const frame = await frameElement.contentFrame();
    if (!frame) throw new Error('Could not get content frame from iframe!');
  
    // Use the provided locators for actions inside the iframe
    await frame.getByText('CancelPowered By').click();
    await frame.getByText('Wallets').click();
    await frame.locator('.sc-1fr5ab1-0 > .d-flex').click();
  
    // (Optional) Click the final pay button (amount may vary)
    const page2Promise = page.waitForEvent('popup');
    await frame.getByRole('button', { name: /Pay ₹/ }).click();
    const page2 = await page2Promise;
  
    // Get the "Generate OTP" button
    const generateOtpButton = page2.getByRole('button', { name: 'Generate OTP' });
    await generateOtpButton.click();
      const otp = await page2.locator('#random-number').textContent();
    if (!otp || !/^[0-9]{4}$/.test(otp.trim())) throw new Error('OTP not found or not 4 digits!');
    
    // Fill the OTP digits
    await page2.locator('#digit1').fill(otp[0]);
    await page2.locator('#digit2').fill(otp[1]);
    await page2.locator('#digit3').fill(otp[2]);
    await page2.locator('#digit4').fill(otp[3]);
    // Click the success button
    await page2.getByRole('button', { name: 'Success', exact: true }).click();
    // Refresh the page
    await page.reload({ waitUntil: 'domcontentloaded' }); // waits until the DOM is loaded after the refresh
      
    // Assert NEXT :KYC is enabled
    await expect(page.getByText('NEXT :KYC')).toBeEnabled();
      
    // Wait for the button to be enabled and visible
    await page.getByRole('button', { name: 'Save' }).click();
 
    await expect(nextKycButton).toBeEnabled();
    await expect(nextKycButton).toBeVisible();
    await page.getByRole('button', { name: 'Save' }).click();
    page.reload();
    page.waitForTimeout(5000);
    const nextKycButton = page.getByRole('button', { name: 'NEXT :KYC' });
    nextKycButton.click();
  });
  
 
 
 
  test('Positive KYC flow', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000921');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
 
 
    await page.getByLabel('Aadhaar number').fill('397788000234');
    await page.getByLabel('Name as on Aadhaar card').fill('John Doe');
    await page.getByRole('combobox', { name: 'Mother tongue *' }).click();
    await page.getByRole('option', { name: 'Hindi' }).click();
    await page.getByRole('combobox', { name: 'Marital status *' }).click();
    await page.getByRole('option', { name: 'Single' }).click();
    await page.getByRole('combobox', { name: 'Blood group *' }).click();
    await page.getByRole('option', { name: 'A+' }).click();
 
    //parent/guardian details
 
    await page.getByLabel('Father name').fill('Robert Doe');
    await page.getByLabel('Father occupation').fill('Engineer');
    await page.getByLabel('Mother name').fill('Jane Doe');
    await page.getByLabel('Mother occupation').fill('Teacher');
    await page.getByLabel('Guardian name').fill('Uncle Ben');
    await page.locator('input[type="tel"]').fill('9876543210');
 
    //permanent and correspondence details
 
    await page.locator('[id="student\\.kycInfo\\.addressInfo\\.correspondenceAddress\\.addressLine1"]').fill('123 Street');
    await page.locator('[id="student\\.kycInfo\\.addressInfo\\.correspondenceAddress\\.addressLine2"]').fill('Apt 456');
    await page.locator('[id="student\\.kycInfo\\.addressInfo\\.correspondenceAddress\\.pincode"]').fill('560001');
    await page.getByRole('radio', { name: 'Yes' }).click()
 
    if(await page.getByRole('heading', { name: 'Permanent Address' }).isVisible()) {
      await page.locator('[id="student\\.kycInfo\\.addressInfo\\.permanentAddress\\.addressLine1"]').fill('123 Street');
      await page.locator('[id="student\\.kycInfo\\.addressInfo\\.permanentAddress\\.addressLine2"]').fill('Apt 456');
      await page.getByRole('combobox', { name: 'Country *' }).click();
      await page.getByRole('option', { name: 'India', exact: true }).click();
      await page.getByRole('combobox', { name: 'State *' }).click();
      await page.getByRole('option', { name: 'Karnataka' }).click();
      await page.getByRole('combobox', { name: 'City *' }).click();
      await page.getByRole('option', { name: 'Bengaluru' }).click();
      
 
      await page.locator('[id="student\\.kycInfo\\.addressInfo\\.permanentAddress\\.pincode"]').fill('560001');
    }
     await page.getByRole('button', { name: 'Save' }).click();
     await page.getByRole('button', { name: 'NEXT :Education & Work' }).click();
 
    
  });
 
 
  test('Validate Happy flow on Education page', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000921');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    
 
    // Verify successful login (adjust these assertions based on the actual application behavior)
    await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
    await expect(page.getByText("Greetings")).toBeVisible();
 
    await page.locator('[id="student\\.educationInfo\\.x_SchoolName"]').fill("LPU");
    await page.getByRole('combobox', { name: 'Board *' }).first().click();
    await page.getByRole('option', { name: 'Aligarh Muslim University' }).click();
    await (page.locator('[id="student\\.educationInfo\\.x_YearOfPassing"]')).fill("2022");
    await page.getByRole('combobox', { name: 'Marking scheme *' }).first().click();
    await page.getByRole('option', { name: 'Outstanding' }).click();
    await (page.locator('[id="student\\.educationInfo\\.x_AggregatePercentage"]')).fill("90.8");
    await (page.locator('[id="student\\.educationInfo\\.xii_SchoolName"]')).fill("LPPP");
    await page.getByRole('combobox', { name: 'Board *' }).nth(1).click();
    await page.getByRole('option', { name: 'Aligarh Muslim University' }).click();
    await (page.locator('[id="student\\.educationInfo\\.xii_YearOfPassing"]')).fill("2022");
    await page.getByRole('combobox', { name: 'Marking scheme *' }).nth(1).click();
    await page.getByRole('option', { name: 'Outstanding' }).click();
    await (page.locator('[id="student\\.educationInfo\\.xii_YearOfPassing"]')).fill("2024");
    await (page.locator('[id="student\\.educationInfo\\.xii_AggregatePercentage"]')).fill("89.7");
    await page.getByRole('combobox', { name: 'UG result status' }).click();
    await page.getByRole('option', { name: 'Declared' }).click();
    await (page.getByRole('textbox', { name: 'College name' })).fill("DTU");
    await (page.getByRole('textbox', { name: 'University' })).fill("Delhi University");
    await page.getByRole('combobox', { name: 'Degree' }).click();
    await page.getByRole('option', { name: 'B.Com' }).click();
    await (page.getByLabel('Year of passing', { exact: true })).fill("2024");
    await (page.getByRole('spinbutton', { name: 'Percentage/CGPA' })).fill("9.4");
 
    await page.getByRole('radio', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'NEXT :Upload documents' }).click();
 
  });
 
  test('Positive flow submission on Upload document page', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000921');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    
 
    // Verify successful login (adjust these assertions based on the actual application behavior)
    await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
    await expect(page.getByText("Greetings")).toBeVisible();
    
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.passportPhoto"]'),
        './documents/photograph.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.proofOfDOB"]'),
        './documents/dob.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.x_MarkSheet"]'),
        './documents/marksheet10.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.xii_MarkSheet"]'),
        './documents/marksheet12.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.kycDocument"]'),
        './documents/Kyc.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.abcIdCard"]'),
        './documents/ABC id.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.degreeCertificate"]'),
        './documents/degree.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.consolidateMarkSheet"]'),
        './documents/consolidated.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.casteCertificate"]'),
        './documents/caste cert.pdf'
    );
 
    await uploadFileAndClickButton(
        page,
        page.locator('[id="sfu-button-student\\.documentInfo\\.otherSupportingDocument"]'),
        './documents/other supporting.pdf'
    );
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Submit' }).last().click();
 
  });
 
  test('should handle agreement checkbox and submit button correctly', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000921');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
 
    // Check if the agreement checkbox is checked
    const agreementCheckbox = page.getByRole('checkbox', { name: 'controlled' });
    const isChecked = await agreementCheckbox.isChecked();
    
    // Only check the checkbox if it's not already checked
    if (!isChecked) {
      await agreementCheckbox.check();
      // Verify the checkbox is now checked
      await expect(agreementCheckbox).toBeChecked();
    }
 
    // Optional: Add verification that the submission was successful
    // For example, check for a success message or navigation
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Submit' }).last().click();
 
  });
 
});


//data dynamic