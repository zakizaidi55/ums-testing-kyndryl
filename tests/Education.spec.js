import { test, expect } from '@playwright/test';
 
test.describe("UMS Global KYC Page Tests", async() => {
  test.beforeEach(async ({ page, context }, testInfo) => {
    // Start tracing before each test
    await context.tracing.start({ screenshots: true, snapshots: true });
    // Navigate to the KYC page before each test
    await page.goto('https://ui.qa.umsglobal.net/#/login');
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

})