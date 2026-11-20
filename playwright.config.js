import { defineConfig } from '@playwright/test';
import { expect } from 'playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60000,
    fullyParallel:true,
    retries: 1,
    expect:{
        timeout: 5000,
    },
    reporter:[
        ['html'],
        ['allure-playwright'],
    ],
    projects: [
        {
            name: 'Playwright_AI',
            use: {
                browserName: 'chromium',
                channel: 'msedge',
                headless: false,
                screenshot: 'only-on-failure',
                trace: 'on',
            },
        },
    ],
})