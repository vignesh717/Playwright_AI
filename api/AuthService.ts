import { APIRequestContext, request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface LoginResponse {
    token: string;
    userId: string;
    message: string;
}

export class AuthService {
    private requestContext: APIRequestContext;
    private baseURL: string = 'https://rahulshettyacademy.com';

    constructor(requestContext: APIRequestContext) {
        this.requestContext = requestContext;
    }

    async login(userEmail: string = 'Test@RSA.com', userPassword: string = 'Test@RSA123'): Promise<LoginResponse> {
        const response = await this.requestContext.post(`${this.baseURL}/api/ecom/auth/login`, {
            data: { userEmail, userPassword },
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok()) {
            throw new Error(`Login failed with status ${response.status()}: ${await response.text()}`);
        }

        const data: LoginResponse = await response.json();
        return data;
    }

    async saveSessionState(loginData: LoginResponse, authDir: string = 'auth'): Promise<{ tokenPath: string; statePath: string }> {
        const fullAuthDir = path.resolve(authDir);
        if (!fs.existsSync(fullAuthDir)) {
            fs.mkdirSync(fullAuthDir, { recursive: true });
        }

        // 1. Save raw API session payload (token, userId, email)
        const tokenPath = path.join(fullAuthDir, 'session-token.json');
        fs.writeFileSync(tokenPath, JSON.stringify(loginData, null, 2), 'utf-8');

        // 2. Save Playwright browser storageState format for UI reuse
        const statePath = path.join(fullAuthDir, 'state.json');
        const storageState = {
            cookies: [],
            origins: [
                {
                    origin: 'https://rahulshettyacademy.com',
                    localStorage: [
                        {
                            name: 'token',
                            value: loginData.token
                        }
                    ]
                }
            ]
        };
        fs.writeFileSync(statePath, JSON.stringify(storageState, null, 2), 'utf-8');

        return { tokenPath, statePath };
    }

    static loadSessionToken(authDir: string = 'auth'): LoginResponse {
        const tokenPath = path.join(path.resolve(authDir), 'session-token.json');
        if (!fs.existsSync(tokenPath)) {
            throw new Error(`Session file not found at ${tokenPath}. Please run login first.`);
        }
        return JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    }
}
