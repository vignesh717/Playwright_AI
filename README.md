# Playwright AI Test Automation Framework

## 1. Project Overview

This repository is an enterprise-grade automated testing framework built with **Playwright** and **TypeScript** for web UI and REST API test automation, targeting the e-commerce client application at [rahulshettyacademy.com/client](https://rahulshettyacademy.com/client/).

### Key Capabilities
- **Page Object Model (POM)**: Centralized `PageManager` orchestrating modular page objects (`LoginPage`, `DashboardPage`, `CartPage`, `CheckoutPage`, `ConfirmationPage`).
- **Hybrid Session Authentication**: Authenticates via REST API (`AuthService`) and persists storage state (`auth/state.json`) to bypass repetitive UI logins in subsequent tests.
- **REST API Testing**: Standalone API services (`AuthService`, `ProductService`, `OrderService`) for programmatic catalog inspection and order placement.
- **AI / MCP Integration**: Preconfigured Model Context Protocol (MCP) servers and subagent personas (`planner`, `generator`, `healer`) for autonomous test planning, generation, and self-healing.
- **Dual Reporting**: Out-of-the-box support for Playwright HTML reports and Allure Playwright reports with screenshots and execution traces.

---

## 2. Tech Stack

Derived directly from `package.json` and project configuration:

- **Language & Runtime**: Node.js, TypeScript (`^7.0.2`)
- **Testing Core**: `@playwright/test` (`^1.65.1`), `playwright` (`^1.65.0`)
- **Reporting**: `allure-playwright` (`^3.12.2`), Playwright HTML Reporter
- **Typings**: `@types/node` (`^25.9.1`)
- **Browser Channel**: Microsoft Edge / Chromium

---

## 3. Project Structure

```text
Playwright_AI/
├── .agents/                    # Agent personas, skills, and MCP configurations
│   ├── agents/                 # Agent specifications (planner, generator, healer)
│   ├── skills/playwright-test/ # Playwright test execution and authoring skill
│   └── mcp_config.json         # MCP server definition (@playwright/mcp@latest)
├── .mcp.json                   # Project-level MCP config (playwright run-test-mcp-server)
├── api/                        # API client services and TypeScript interfaces
│   ├── AuthService.ts          # Authentication and session state saver
│   ├── OrderService.ts         # Order creation and retrieval endpoints
│   └── ProductService.ts       # Catalog search and retrieval endpoints
├── auth/                       # Cached authentication data
│   ├── session-token.json      # Saved API tokens and user info
│   └── state.json              # Playwright browser storageState (cookies & localStorage)
├── pages/                      # Page Object Model (POM) classes
│   ├── CartPage.ts             # Cart item verification and checkout navigation
│   ├── CheckoutPage.ts         # Dynamic country selection and order submission
│   ├── ConfirmationPage.ts     # Order confirmation banner and Order ID extraction
│   ├── DashboardPage.ts        # Product grid interactions, toast handling, cart link
│   ├── HomePage.ts             # Legacy homepage class
│   ├── LoginPage.ts            # Login form filling and navigation
│   └── PageManager.ts          # Central facade instantiating all page classes
├── specs/                      # Test plan specifications and markdown requirement docs
│   └── README.md               # Test plan guidelines and template
├── tests/                      # Playwright test spec files
│   ├── api-order.spec.ts       # API test suite with token caching
│   ├── hybrid-session.spec.ts  # UI test bypassing login with saved storageState
│   ├── orderProduct.spec.ts    # Full E2E checkout workflow
│   ├── RSClient.spec.ts        # Product catalog and cart verification UI tests
│   └── seed.spec.ts            # Baseline seed template for new tests
├── package.json                # Project dependencies and npm scripts
├── playwright.config.js        # Playwright runner configuration (Edge, timeouts, reporters)
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 4. Prerequisites

- **Node.js**: `v18.x` or `v20.x` LTS
- **npm**: `v9.x` or higher
- **Microsoft Edge**: Required by default (`channel: 'msedge'` in `playwright.config.js`)
- **Allure CLI** (Optional, for Allure report rendering):
  ```bash
  npm install -g allure-commandline --save-dev
  ```

---

## 5. Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Playwright_AI
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install msedge chromium
   ```

---

## 6. Running Tests

Commands use the `scripts` defined in `package.json` and the standard Playwright CLI:

### Run All Tests (Headless)
```bash
npm test
```
*Equivalent to: `npx playwright test`*

### Run Tests with Browser UI (Headed)
```bash
npm run test:headed
```
*Equivalent to: `npx playwright test --headed`*

### Run a Specific Test File
```bash
npx playwright test tests/orderProduct.spec.ts
```

### Run with Custom Retries
```bash
npx playwright test --retries 2
```

### Run by Tags
Tests are tagged with metadata (`@ui`, `@api`, `@smoke`, `@regression`, `@hybrid`). Filter with `--grep`:
```bash
# Run only UI tests
npx playwright test --grep @ui

# Run only API tests
npx playwright test --grep @api

# Run only Smoke tests
npx playwright test --grep @smoke
```

### Run in Debug Mode
Step through tests using the Playwright Inspector:
```bash
npx playwright test tests/orderProduct.spec.ts --debug
```

---

## 7. Reporting

The test framework produces two types of reports configured in `playwright.config.js`:

### Playwright HTML Report
Reports are written to the `playwright-report/` directory after execution.
- **Open the report**:
  ```bash
  npx playwright show-report
  ```

### Allure Report
Raw result files are output to `allure-results/` via `allure-playwright`.
- **Generate and serve Allure report in browser**:
  ```bash
  allure serve allure-results
  ```
- **Generate static HTML report into a folder**:
  ```bash
  allure generate allure-results --clean -o allure-report
  ```
- **Open generated static Allure report**:
  ```bash
  allure open allure-report
  ```
- **Clean previous Allure results**:
  - *PowerShell (Windows)*:
    ```powershell
    if (Test-Path allure-results) { Remove-Item -Recurse -Force allure-results }
    ```
  - *Bash (macOS/Linux)*:
    ```bash
    rm -rf allure-results allure-report
    ```

---

## 8. AI / MCP Workflow

This repository includes configuration for AI agent integration via the **Model Context Protocol (MCP)**:

### MCP Server Configuration
- **`.mcp.json`**: Configures the local Playwright test MCP server:
  ```json
  {
    "mcpServers": {
      "playwright-test": {
        "command": "cmd",
        "args": ["/c", "npx", "playwright", "run-test-mcp-server"]
      }
    }
  }
  ```
- **`.agents/mcp_config.json`**: Configures `@playwright/mcp@latest` allowing agents to inspect the live accessibility tree, capture snapshots, click elements, and navigate pages.

### Subagent Personas (`.agents/agents/`)
- **`playwright-test-planner`**: Navigates the target web application using browser tools, analyzes user flows, and writes structured test plans into `specs/`.
- **`playwright-test-generator`**: Reads test plans and writes robust TypeScript specs into `tests/` following the Page Object Model pattern.
- **`playwright-test-healer`**: Evaluates failed test runs, inspects updated page DOM/locators via MCP, and updates page objects or assertions to heal broken tests.
