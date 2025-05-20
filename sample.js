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
        

        await uploadFileAndClickButton(
            page.locator('[id="sfu-button-student\\.documentInfo\\.passportPhoto"]'),
            './documents/photograph.pdf',
            page.getByRole('button', { name: 'Click to Upload' })
        );
        await uploadFileAndClickButton(
            page.locator('[id="sfu-button-student\\.documentInfo\\.proofOfDOB"]'),
            './documents/dob.pdf',
            page.getByRole('button', { name: 'Click to Upload' })
        );


      });
    
});