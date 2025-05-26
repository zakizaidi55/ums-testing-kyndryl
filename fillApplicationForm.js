const { chromium } = require('playwright');

async function fillApplicationForm({
  nationality = 'Indian',
  currentLocation = 'Mumbai',
  category = 'General',
  state = 'Maharashtra',
  city = 'Mumbai',
  elective1 = 'MCOM',
  elective2 = 'Public Accounting',
  abcId = 'ABC123456',
  debId = 'DEB123456',
  nameAsPerDebId = 'John Doe',
  emailAsPerDebId = 'john@example.com',
  phoneAsPerDebId = '9876543210',
  gender = 'Male',
  dob = '2000-01-01',
  nameAsPerTenth = 'John Doe',
  email = 'qatemp1@yopmail.com',
  phone = '9848901347',
  altPhone = '9812345678',
  scholarshipNote = 'Applied via sports quota',
  physicallyChallenged = true,
  militaryBackground = false,
  otherScholarship = false
}) {
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

  const handleRadio = async (yesSelector, noSelector, value) => {
    const yesRadio = page.locator(yesSelector);
    const noRadio = page.locator(noSelector);

    if (value === true) {
      await yesRadio.check();
    } else if (value === false) {
      await noRadio.check();
    }
  };

  // -- Program Details --
  await handleDropdown('select[formcontrolname="elective"]', elective1);
  await handleDropdown('select[formcontrolname="elective"]', elective2);

  // -- Residence --
  await handleDropdown('select[formcontrolname="nationality"]', nationality);
  await handleDropdown('select[formcontrolname="currentLocation"]', currentLocation);

  // -- Educational Identities --
  await handleInput('input[formcontrolname="abcId"]', abcId);
  await handleInput('input[formcontrolname="debId"]', debId);

  // -- Details as per DEB ID --
  await handleInput('input[formcontrolname="nameAsPerDebId"]', nameAsPerDebId);
  await handleInput('input[formcontrolname="emailAsPerDebId"]', emailAsPerDebId);
  await handleInput('input[formcontrolname="phoneAsPerDebId"]', phoneAsPerDebId);
  await handleDropdown('select[formcontrolname="gender"]', gender);
  await handleInput('input[formcontrolname="dob"]', dob);

  // -- Personal Details --
  await handleInput('input[formcontrolname="nameAsPerTenth"]', nameAsPerTenth);
  await handleInput('input[formcontrolname="email"]', email);
  await handleInput('input[formcontrolname="phone"]', phone);
  await handleInput('input[formcontrolname="altPhone"]', altPhone);
  await handleDropdown('select[formcontrolname="category"]', category);
  await handleDropdown('select[formcontrolname="state"]', state);
  await handleInput('input[formcontrolname="city"]', city);

  // -- Scholarship Eligibility --
  await handleRadio('input#physicallyYes', 'input#physicallyNo', physicallyChallenged);
  await handleRadio('input#militaryYes', 'input#militaryNo', militaryBackground);
  await handleRadio('input#otherScholarshipYes', 'input#otherScholarshipNo', otherScholarship);
  await handleInput('textarea[formcontrolname="scholarshipNote"]', scholarshipNote);

  console.log('Form processed successfully.');
  await browser.close();
}

// Example usage (you can remove this section if you plan to import and use the function elsewhere)
// (async () => {
//   await fillApplicationForm({
//     nationality: 'Indian',
//     category: 'General',
//     // ... other values
//   });
// })();

module.exports = { fillApplicationForm }; 