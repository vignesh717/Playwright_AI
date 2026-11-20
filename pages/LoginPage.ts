import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('email@example.com');
        this.passwordInput = page.getByPlaceholder('enter your passsword');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    async navigate(): Promise<void> {
        await this.page.goto('https://rahulshettyacademy.com/client/');
        await this.usernameInput.waitFor({ state: 'visible' });
    }

    async login(username: string = 'Test@RSA.com', password: string = 'Test@RSA123'): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL(/.*dashboard.*/);
    }
}
