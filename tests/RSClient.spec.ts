import {test, expect, Locator} from '@playwright/test';
import { PageManager } from '../pages/PageManager'


test('Get all home page products', { tag: ['@ui', '@smoke', '@severity:normal'] }, async({page})=>{
    const pageManager: PageManager = new PageManager(page);
    await pageManager.homePage.launchHomePage();
    await pageManager.homePage.loginWithCreds();
    const allProductNames: string[] = await page.locator('div[class="card-body"] b').allTextContents();
    expect(allProductNames.length>0);
    console.log('Product names are below:\n', allProductNames);
})

test('View and add product to cart', { tag: ['@ui', '@regression', '@severity:normal'] }, async({page})=>{
    const targetProduct: string = 'iphone 13 pro';
    const pageManager: PageManager = new PageManager(page);
    await pageManager.homePage.launchHomePage();
    await pageManager.homePage.loginWithCreds();
    const allProductNames: string[] = await page.locator('div[class="card-body"] b').allTextContents();
    expect(allProductNames.length>0);
    console.log('Product names are below:\n', allProductNames);
    const productIndex: number = allProductNames.findIndex(text => text.toLowerCase().includes(targetProduct.toLowerCase()));
    const targetProductCard: Locator = await page.locator('div[class="card-body"]').nth(productIndex);
    await targetProductCard.locator('button', {hasText:'View'}).click();
    await page.waitForLoadState();
    await page.getByText('Add to Cart').click();
    expect(await page.getByText('Product Added To Cart').waitFor({timeout:5000}));
})

test('Verify price, product in stock in cart page', { tag: ['@ui', '@regression', '@severity:normal'] }, async({page})=>
{
    const targetProduct: string = 'iphone 13 pro';
    const pageManager: PageManager = new PageManager(page);
    await pageManager.homePage.launchHomePage();
    await pageManager.homePage.loginWithCreds();
    const targetProductCard = await page.locator('div[class="card-body"]').filter({hasText:targetProduct});
    await targetProductCard.getByText(' Add To Cart').click();
    expect(await page.getByText('Product Added To Cart').waitFor({timeout:5000}));
    await pageManager.homePage.gotoCartPage();
    const cartInfoWrap: Locator = await pageManager.cartPage.allCartItemsInfos.filter({hasText:targetProduct});
    // expect(cartInfoWrap.textContent()).toContain(' In Stock');
    console.log('Cart Info Wrap',await cartInfoWrap.allTextContents());
    // expect(cartInfoWrap.locator('p.stockStatus').textContent()).toContain('In Stock');
    const price = await cartInfoWrap.locator('div.prodTotal.cartSection').textContent();
    console.log(price);
    // expect(price).toContain('$ 55000');
}
)








//Test@RSA123 - pwd
//Test@RSA.com - username