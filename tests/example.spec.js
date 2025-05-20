// @ts-check
import { test, expect } from '@playwright/test';
 
test.describe('UMS Global Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('https://ui.qa.umsglobal.net/#/login');
  });
 
  // test('should display login page elements', async ({ page }) => {
  //   // Verify essential elements are present
  //   await expect(page.getByRole('heading', { name: 'login' })).toBeVisible();
  //   await expect(page.getByRole('textbox', { name: 'Email / User name' })).toBeVisible();
  //   await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  //   await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  // });
 

 
  // test('should show validation for invalid username format', async ({ page }) => {
  //   // Enter invalid username format
  //   await page.getByRole('textbox', { name: 'Email / User name' }).fill('bvsakjbvjks@');
  //   await page.getByRole('textbox', { name: 'Password' }).fill('snsjdvbn!');
  //   await page.getByRole('button', { name: 'login'}).click();
    
  //   // Verify validation message
  //   await expect(page.getByText('')).toBeVisible();
  // });
 
  // test('should show error for invalid credentials', async ({ page }) => {
  //   // Enter invalid credentials
  //   await page.getByRole('textbox', { name: 'Email / User name' }).fill('sharda0000000888');
  //   await page.getByRole('textbox', { name: 'Password' }).fill('afsnbajkls!');
  //   await page.getByRole('button', { name: 'login'}).click();
    
  //   // Verify error message
  //   await expect(page.getByText('')).toBeVisible();
  // });
 
  
 
  test('should handle successful login', async ({ page }) => {
    // Enter valid credentials (these should be configured via environment variables in practice)
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000890');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    

    // Verify successful login (adjust these assertions based on the actual application behavior)
    await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
    await expect(page.getByText("Greetings")).toBeVisible();


    await page.getByLabel('Name as per 10th marksheet').fill('tempmail');
    const emailInput = await page.locator('[id="student||.email"]').innerText;
    console.log("emailInput", emailInput);
    await page.getByLabel('Alternate phone number').fill('9876543210');

    // Category dropdown
    await page.locator('label:has-text("Category")').click();
    await page.getByRole('option', { name: 'General' }).click(); // adjust option name if needed

    await page.locator('label:has-text("Country of residence")').click();
    await page.getByRole('option', { name: 'India' }).click();

    await page.locator('label:has-text("State")').click();
    await page.getByRole('option', { name: 'Maharashtra' }).click();

    await page.getByLabel('City').fill('Mumbai');

    // Scholarship eligibility
    await page.getByLabel('Are you physically challenged?').getByLabel('No').click();
    await page.getByLabel('Are you eligible for a military scholarship?').getByLabel('No').click();
    await page.getByLabel('Are you eligible for any other scholarship?').getByLabel('No').click();

    // --- ACADEMIC DETAILS ---
    await page.locator('label:has-text("Highest educational qualification")').click();
    await page.getByRole('option', { name: 'Graduation' }).click(); // adjust as needed

    await page.locator('label:has-text("Country of highest education completion")').click();
    await page.getByRole('option', { name: 'India' }).click();

    await page.locator('label:has-text("Current college")').click();
    await page.getByRole('option', { name: 'Other' }).click();

    await page.locator('label:has-text("Location of current college")').click();
    await page.getByRole('option', { name: 'Mumbai' }).click();

    await page.locator('label:has-text("Current educational qualification")').click();
    await page.getByRole('option', { name: 'Graduation' }).click(); // adjust as needed

    await page.getByLabel('Percentage/CGPA in highest examination attempted').fill('84');

    // Education loan
    await page.getByText('Do you need an educational loan?').locator('text=No').click();

    // Agree to terms
    await page.getByRole('checkbox', { name: 'I Agree' }).check();

    // Click Save
    await page.getByRole('button', { name: 'SAVE' }).click();

    // Optional: Add assertion
    await expect(page.getByText('Saved successfully')).toBeVisible();
  });

// test('Auto-fill or verify Jain Online form', async ({ page }) => {

//   // Utility to fill or verify a field
//   const handleInput = async (selector, value = 'TestValue') => {
//     const el = await page.locator(selector);
//     const currentValue = await el.inputValue();

//     if (currentValue.trim()) {
//       console.log(`Verified: ${selector} is prefilled with "${currentValue}"`);
//     } 
//     else {
//       await el.fill(value);
//       console.log(`Filled: ${selector} with "${value}"`);
//     }
//   };

//   const handleDropdown = async (selector, value = 'Option1') => {
//     const el = page.locator(selector);
//     const selectedValue = await el.inputValue();

//     if (selectedValue.trim()) {
//       console.log(`Verified dropdown: ${selector} = "${selectedValue}"`);
//     } 
//     else {
//       await el.selectOption({ label: value });
//       console.log(`Selected dropdown: ${selector} -> "${value}"`);
//     }
//   };

//   const handleRadio = async (yesSelector, noSelector) => {
//     const yesChecked = await page.locator(yesSelector).isChecked();
//     const noChecked = await page.locator(noSelector).isChecked();

//     if (!yesChecked && !noChecked) {
//       await page.locator(yesSelector).check();
//       console.log(`Checked radio: ${yesSelector}`);
//     } 
//     else {
//       console.log(`Radio already selected: ${yesSelector} or ${noSelector}`);
//     }
//   };

//   // -- Program Details --
//   await handleInput('input[formcontrolname="program"]', 'MCOM');
//   await handleDropdown('select[formcontrolname="elective"]', 'Economics');

//   // -- Residence --
//   await handleDropdown('select[formcontrolname="nationality"]', 'Indian');
//   await handleDropdown('select[formcontrolname="currentLocation"]', 'Mumbai');

//   // -- Educational Identities --
//   await handleInput('input[formcontrolname="abcId"]', 'ABC123456');
//   await handleInput('input[formcontrolname="debId"]', 'DEB123456');

//   // -- Details as per DEB ID --
//   await handleInput('input[formcontrolname="nameAsPerDebId"]', 'John Doe');
//   await handleInput('input[formcontrolname="emailAsPerDebId"]', 'john@example.com');
//   await handleInput('input[formcontrolname="phoneAsPerDebId"]', '9876543210');
//   await handleDropdown('select[formcontrolname="gender"]', 'Male');
//   await handleInput('input[formcontrolname="dob"]', '2000-01-01');

//   // -- Personal Details --
//   await handleInput('input[formcontrolname="nameAsPerTenth"]', 'John Doe');
//   await handleInput('input[formcontrolname="email"]', 'qatemp1@yopmail.com');
//   await handleInput('input[formcontrolname="phone"]', '9848901347');
//   await handleInput('input[formcontrolname="altPhone"]', '9812345678');
//   await handleDropdown('select[formcontrolname="category"]', 'General');
//   await handleDropdown('select[formcontrolname="state"]', 'Maharashtra');
//   await handleInput('input[formcontrolname="city"]', 'Mumbai');

//   // -- Scholarship Eligibility --
//   await handleRadio('input#physicallyYes', 'input#physicallyNo');
//   await handleRadio('input#militaryYes', 'input#militaryNo');
//   await handleRadio('input#otherScholarshipYes', 'input#otherScholarshipNo');
//   await handleInput('textarea[formcontrolname="scholarshipNote"]', 'Applied via sports quota');

//   console.log('Form processed successfully.');
// });

});



 