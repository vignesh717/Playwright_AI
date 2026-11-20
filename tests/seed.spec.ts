import { test, expect } from '@playwright/test';

test.describe('Test group', () => {

  test('seed', async ({ page }) => {
    // generate code here.
    const usernameInput = page.getByPlaceholder('email@example.com');
    const passwordInput = page.getByPlaceholder('enter your passsword');
    const loginButton = page.getByRole('button', { name: 'Login' });
    const username = 'Test@RSA.com';
    const password = 'Test@RSA123';

    await page.goto('https://rahulshettyacademy.com/client/');
    await usernameInput.waitFor({ state: 'visible' });
    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await loginButton.click();
    await page.waitForURL(/.*dashboard.*/);
  });
});
