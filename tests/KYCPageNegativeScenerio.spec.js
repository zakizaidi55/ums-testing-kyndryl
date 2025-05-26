import { test, expect } from '@playwright/test';
const SessionService = require('../services/SessionService');
 
async function getCrede() {
  const sessionService = new SessionService()
  const creds =  await sessionService.getSession();
  return creds;
}

test.describe("UMS End to end application Tests", async() => {
    test.describe.configure({ retries: 1 });
  
    test.beforeEach(async ({ page, context }, testInfo) => {
        // Start tracing before each test
        await context.tracing.start({ screenshots: true, snapshots: true });
        // Navigate to the KYC page before each test
        await page.goto('https://ui.qa.umsglobal.net/#/login');
    });

    test.beforeAll(async (browser) => {
    const creds = await getCrede();
    console.log('Creds Testing:====>', creds, creds.UserID, creds.Password);

    const userID = creds.UserID;
    const changePassword = creds.Password;
    const password = 'Pass@123';

    // You might want to store these in global or a custom fixture
    global._userID = userID;
    global._originalPassword = changePassword;
    global._newPassword = password;
    });

    test('should show required field errors on empty form submission', async ({ page }) => {
        await (page.getByRole('textbox', { name: 'Email / User name' })).fill(global._userID);
        await (page.getByRole('textbox', { name: 'Password' })).fill(global._newPassword);
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
})