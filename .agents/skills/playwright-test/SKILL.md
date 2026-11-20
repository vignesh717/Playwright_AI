---
name: playwright-test
description: Run, debug, and author Playwright tests in this project.
---

# Playwright Test Skill

## Commands
- **Run all tests**: `npx playwright test`
- **Run a single test file**: `npx playwright test tests/<filename>.spec.ts`
- **Run in headed mode**: `npx playwright test --headed`
- **Run in debug mode**: `npx playwright test --debug`
- **View HTML report**: `npx playwright show-report`

## Best Practices
- Place reusable Page Objects under `pages/`.
- Keep test specifications under `tests/`.
- Ensure locators use accessibility role/label attributes wherever possible (`getByRole`, `getByLabel`).
