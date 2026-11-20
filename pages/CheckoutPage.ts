import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly countryInput: Locator;
    readonly countryDropdownResults: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.countryInput = page.getByPlaceholder('Select Country');
        this.countryDropdownResults = page.locator('.ta-results button');
        this.placeOrderButton = page.locator('a.action__submit');
    }

    async selectCountry(countryName: string): Promise<void> {
        await this.countryInput.waitFor({ state: 'visible' });
        await this.countryInput.pressSequentially(countryName.substring(0, 3), { delay: 150 });
        
        await this.countryDropdownResults.first().waitFor({ state: 'visible' });
        
        // Find and click exact matching option
        const targetOption = this.countryDropdownResults.filter({
            hasText: new RegExp(`^\\s*${countryName}\\s*$`, 'i')
        });
        if (await targetOption.count() > 0) {
            await targetOption.first().click();
        } else {
            await this.countryDropdownResults.filter({ hasText: countryName }).first().click();
        }
    }

    async placeOrder(): Promise<void> {
        await this.placeOrderButton.waitFor({ state: 'visible' });
        await this.placeOrderButton.click();
        await this.page.waitForURL(/.*thanks.*/);
    }
}
