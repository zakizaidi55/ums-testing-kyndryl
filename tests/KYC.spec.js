// @ts-check
import { test, expect } from '@playwright/test';
 
// Helper to get a timestamp string
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

test.describe('UMS Global KYC Page Tests', () => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    // Start tracing before each test
    await context.tracing.start({ screenshots: true, snapshots: true });
    // Navigate to the KYC page before each test
    await page.goto('https://ui.qa.umsglobal.net/#/login');
  });

  test.afterEach(async ({ context }, testInfo) => {
    // Stop tracing and export it with a timestamp in the filename
    const timestamp = getTimestamp();
    const tracePath = `traces/trace-${testInfo.title.replace(/\s+/g, '_')}-${timestamp}.zip`;
    await context.tracing.stop({ path: tracePath });
  });

  test('should show required field errors on empty form submission', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000890');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    

    // Verify successful login (adjust these assertions based on the actual application behavior)
    await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
    await expect(page.getByText("Greetings")).toBeVisible();
    await page.getByRole('button', { name: /NEXT\s*:EDUCATION & WORK/i }).click();
    // const KYCPage = await page.locator('div').filter({ hasText: /^3KYC$/ });

    // if(!KYCPage.isVisible()) {
        //future validation scope
    // }

    await expect(page.getByRole('paragraph').filter({ hasText: 'Aadhaar number is required.' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Name as on Aadhaar card is Required' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Mother tongue is required.' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Marital status is Required' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Blood group is required.' }).locator('span')).toBeVisible();


    await expect(page.getByRole('paragraph').filter({ hasText: 'Father name is required.' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Father occupation is required.' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Mother name is required.' }).locator('span')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Mother occupation is required.' }).locator('span')).toBeVisible();
    await expect(page.getByText('Address line 1 is required.').nth(2)).toBeVisible();
    await expect(page.getByText('Address line 2 is required.').nth(2)).toBeVisible();
    await expect(page.getByText('Pincode is required.').nth(2)).toBeVisible();
    
    const isPermanentAddressVisible = await page.getByRole('heading', { name: 'Permanent address' }).isVisible();
  
    if (isPermanentAddressVisible) {
        await expect(page.getByText('Address line 1 is required.').nth(3)).toBeVisible();
        await expect(page.getByText('Address line 2 is required.').nth(3)).toBeVisible();
        await expect(page.getByRole('paragraph').filter({ hasText: 'Country is required.' }).locator('span')).toBeVisible();
        await expect(page.getByRole('paragraph').filter({ hasText: 'State is required.' }).locator('span')).toBeVisible();
        await expect(page.getByRole('paragraph').filter({ hasText: 'State is required.' }).locator('span')).toBeVisible();
        await expect(page.getByText('Pincode is required. ').nth(3)).toBeVisible();
    }
  });

  test('Positive KYC flow', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000899');
    await (page.getByRole('textbox', { name: 'Password' })).fill('Hello123!');
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

    // await page.getByRole('button', { name: 'NEXT :Education & Work' }).click();
    
  });


  test('should show required field errors on empty form submission on Education page', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000890');
    await (page.getByRole('textbox', { name: 'Password' })).fill('User@2001');
    await page.getByRole('button', { name: 'login' }).click();
    

    // Verify successful login (adjust these assertions based on the actual application behavior)
    await expect(page).toHaveURL(/MyApplication/); // Assuming redirect to dashboard
    await expect(page.getByText("Greetings")).toBeVisible();
    await page.getByRole('button', { name: 'NEXT :Upload documents' }).click();

    await expect(page.getByText('School name is required.').nth(2)).toBeVisible();
    await expect(page.getByText('Board is required.').nth(2)).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Year of passing must be greater than or equal to' }).locator('span')).toBeVisible();
    await expect(page.getByText('Marking scheme is required.').nth(2)).toBeVisible();
    await expect(page.getByText('Aggregate percentage/CGPA is').nth(2)).toBeVisible();
    await expect(page.getByText('Board is required.').nth(3)).toBeVisible();
    await expect(page.getByText('Board is required.').nth(3)).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Year of passing must be greater than 0' }).locator('span')).toBeVisible();
    await expect(page.getByText('Marking scheme is required.').nth(3)).toBeVisible();
    await expect(page.getByText('Aggregate percentage/CGPA is').nth(3)).toBeVisible();
  });


  test('Validate Happy flow on Education page', async ({ page }) => {
    await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000890');
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

    await page.getByRole('button', { name: 'NEXT :Upload documents' }).click();
  });

});



 