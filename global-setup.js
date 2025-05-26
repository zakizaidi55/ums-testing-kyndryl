// @ts-check
import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup() {
  console.log('Starting global setup...');
  
  // Clean up traces directory
  const tracesDir = path.join(process.cwd(), 'test-results', 'traces');
  if (fs.existsSync(tracesDir)) {
    console.log('Cleaning up previous traces...');
    fs.readdirSync(tracesDir).forEach(file => {
      const filePath = path.join(tracesDir, file);
      fs.unlinkSync(filePath);
    });
  }

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 // Add slight delay between actions
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to login page...');
    await page.goto('https://ui.qa.umsglobal.net/#/Login');
    await page.waitForLoadState('networkidle');
    
    console.log('Filling login credentials...');
    await page.getByRole('textbox', { name: 'Email / User name' }).fill('sharda0000000930');
    await page.getByRole('textbox', { name: 'Password' }).fill('User@2001');
    
    console.log('Clicking login button...');
    await page.getByRole('button', { name: 'login' }).click();
    
    console.log('Waiting for navigation...');
    await page.waitForURL('**/MyApplication');
    await page.waitForLoadState('networkidle');
    
    console.log('Verifying login success...');
    await page.waitForSelector('text=Greetings', { timeout: 10000 });
    
    console.log('Saving state to state.json...');
    await context.storageState({ path: 'state.json' });
    
    // Verify state.json was created
    if (fs.existsSync('state.json')) {
      console.log('state.json successfully created!');
      const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
      console.log('State contains:', Object.keys(state));
    } else {
      throw new Error('state.json was not created!');
    }
    
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 