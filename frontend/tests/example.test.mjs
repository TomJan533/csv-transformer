import { test, expect } from '@playwright/test';
import axios from 'axios';

test.beforeAll(async () => {
  let appRunning = false;
  while (!appRunning) {
    try {
      await axios.get('http://localhost:3000');
      appRunning = true;
    } catch (error) {
      console.log('Waiting for the app to start...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    }
  }
});


test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForSelector('.Home');
  await expect(page).toHaveTitle('Home - CSV Transformer', { timeout: 5000 });
});

