import { test, expect } from '@playwright/test';
 
// Helper to get a timestamp string
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

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

test.describe("UMS Global Upload Document Page Tests", async() => {
    test.beforeEach(async ({ page, context }, testInfo) => {
        // Start tracing before each test
        await context.tracing.start({ screenshots: true, snapshots: true });
        // Navigate to the KYC page before each test
        await page.goto('https://ui.qa.umsglobal.net/#/login');
    });

    test('Positive flow submission on Upload document page', async ({ page }) => {
        await (page.getByRole('textbox', { name: 'Email / User name' })).fill('sharda0000000902');
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

        //await page.getByRole('button', { name: 'NEXT :Submit' }).click();

      });
    
});