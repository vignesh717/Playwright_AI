import {Page, Locator, expect} from '@playwright/test';

export class HomePage{
    readonly homePage: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly cartButton: Locator;

    constructor(page: Page){
        this.homePage = page;
        this.usernameInput = page.getByPlaceholder('email@example.com');
        this.passwordInput = page.getByPlaceholder('enter your passsword');
        this.loginButton = page.getByRole('button', {name:'login'});
        this.cartButton = page.locator('li button[routerlink="/dashboard/cart"]');
        

    }

    async launchHomePage(){
        await this.homePage.goto('https://rahulshettyacademy.com/client/');
        await this.homePage.waitForLoadState();
    }

    async loginWithCreds(){
        await this.usernameInput.waitFor({state:'visible'});
        await this.usernameInput.fill('Test@RSA.com');
        await this.passwordInput.fill('Test@RSA123');
        await this.loginButton.click();
        expect(this.homePage.url().includes('https://rahulshettyacademy.com/client/#/dashboard/dash'));
    }

    async gotoCartPage(){
        await this.cartButton.waitFor({state:'visible'});
        await this.cartButton.click();
        expect(await this.homePage.url().includes('https://rahulshettyacademy.com/client/#/dashboard/cart'));
    }    
}