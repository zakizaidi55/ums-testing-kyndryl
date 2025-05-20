const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://ui.qa.umsglobal.net/#/Login');

  // Login
  await page.getByRole('textbox', { name: 'Email / User name' }).fill('sharda0000000890');
  await page.getByRole('textbox', { name: 'Password' }).fill('User@2001');
  await page.getByRole('button', { name: 'login' }).click();

  // Wait for navigation after login
  await page.waitForURL(/MyApplication/);
  await page.waitForSelector('text=Greetings');

  // Helper functions
  const handleInput = async (selector, value = 'TestValue') => {
    const el = await page.locator(selector);
    const currentValue = await el.inputValue();
    if (!currentValue.trim()) {
      await el.fill(value);
    }
  };

  const handleDropdown = async (selector, value = 'Option1') => {
    const el = page.locator(selector);
    const selectedValue = await el.inputValue();
    if (!selectedValue.trim()) {
      await el.selectOption({ label: value });
    }
  };

  const handleRadio = async (yesSelector, noSelector) => {
    const yesChecked = await page.locator(yesSelector).isChecked();
    const noChecked = await page.locator(noSelector).isChecked();
    if (!yesChecked && !noChecked) {
      await page.locator(yesSelector).check();
    }
  };

  // -- Program Details --
  await handleDropdown('select[formcontrolname="elective"]', 'MCOM');
  await handleDropdown('select[formcontrolname="elective"]', 'Public Accounting');

  // -- Residence --
  await handleDropdown('select[formcontrolname="nationality"]', 'Indian');
  await handleDropdown('select[formcontrolname="currentLocation"]', 'Mumbai');

  // -- Educational Identities --
  await handleInput('input[formcontrolname="abcId"]', 'ABC123456');
  await handleInput('input[formcontrolname="debId"]', 'DEB123456');

  // -- Details as per DEB ID --
  await handleInput('input[formcontrolname="nameAsPerDebId"]', 'John Doe');
  await handleInput('input[formcontrolname="emailAsPerDebId"]', 'john@example.com');
  await handleInput('input[formcontrolname="phoneAsPerDebId"]', '9876543210');
  await handleDropdown('select[formcontrolname="gender"]', 'Male');
  await handleInput('input[formcontrolname="dob"]', '2000-01-01');

  // -- Personal Details --
  await handleInput('input[formcontrolname="nameAsPerTenth"]', 'John Doe');
  await handleInput('input[formcontrolname="email"]', 'qatemp1@yopmail.com');
  await handleInput('input[formcontrolname="phone"]', '9848901347');
  await handleInput('input[formcontrolname="altPhone"]', '9812345678');
  await handleDropdown('select[formcontrolname="category"]', 'General');
  await handleDropdown('select[formcontrolname="state"]', 'Maharashtra');
  await handleInput('input[formcontrolname="city"]', 'Mumbai');

  // -- Scholarship Eligibility --
  await handleRadio('input#physicallyYes', 'input#physicallyNo');
  await handleRadio('input#militaryYes', 'input#militaryNo');
  await handleRadio('input#otherScholarshipYes', 'input#otherScholarshipNo');
  await handleInput('textarea[formcontrolname="scholarshipNote"]', 'Applied via sports quota');

  console.log('Form processed successfully.');
  await browser.close();
})(); 