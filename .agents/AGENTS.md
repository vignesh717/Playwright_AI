# Playwright Agent Guidelines

This workspace is a **Playwright Test Automation** suite written in TypeScript/JavaScript using the Page Object Model (POM) pattern.

## Project Structure
- `tests/`: Spec test files (e.g., `*.spec.ts`, `*.spec.js`).
- `pages/`: Page Object classes encapsulating selectors and page interactions.
- `playwright.config.js`: Main Playwright configuration (Chromium/Edge, Allure reporter, screenshots, traces).
- `.agents/`: Agent instructions, skills, plugins, and MCP configurations.

## Agent Responsibilities & Rules
1. **Writing Tests**:
   - Always follow the Page Object Model (POM) pattern. Reusable actions and locators belong in `pages/`.
   - Prefer user-facing locators (`getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByTestId`) over fragile CSS or XPath selectors.
   - Use web-first assertions (`await expect(locator).toBeVisible()`).
2. **Executing & Debugging Tests**:
   - Run specific tests with: `npx playwright test <path-to-test>`
   - Run headed or debug mode: `npx playwright test --headed` or `npx playwright test --debug`
   - Generate / view test report: `npx playwright show-report`
3. **Playwright MCP Server**:
   - The Playwright Model Context Protocol (MCP) server (`@playwright/mcp@latest`) is configured in `.agents/mcp_config.json` and globally in Antigravity.
   - When active, use MCP tools for live browser navigation, accessibility tree inspection, clicking, filling, and taking snapshots.
