# playwright-bdd-api-web

# Project Structure

This project is organized as follows:

```
├── src
│   ├── data
│   └── api
│   │   └── BookingApi
│   │       └── createBooking.json
│   ├── features
│   │   ├── api
│   │   │   └── CommonApiCalls.feature
│   │   └── web
│   │       └──PageActionExamples.feature
│   ├── lib
│   │   ├── interface
│   │   │   └── cucumber.ts
│   │   ├── scripts
│   │   │   ├── api api
│   │   │   │    └── ApiTestHelpers.ts
│   │   │   └── web
│   │   │       └──PageElements.ts
│   │   │       └──PageActionsHelper.ts
│   │   └── utils
│   │       └── Hooks.ts
│   │       └── APIUtils.ts
│   │       └── TestDataGenerator.ts
│   │       └── PlaywrightUtils.ts
│   │       └── ExcelFileReader.ts
│   │       └── DbConnector.ts
│   │       └── GetTestCaseData.ts
│   │       └── Helpers.ts
│   │       └── Utilities.ts
│   ├── steps
│   │    ├── api
│   │    │   └── CommonApiSteps.ts
│   │    └── web
│   │         └──UtilSteps.ts
│   │         └──PageActionsHelperSteps.ts
├── resource.properties
└── package.json
```

## Directories and Files

- **src**: Contains the source code for step definitions, feature files, and utilities.
- **data**: Contains JSON files with data used in tests.
  - **api**: Contains API-related data.
  - **features**: Contains the feature files for Cucumber.
    - **api**: Contains API-related feature files.
      - `CommonApiCalls.feature`: Feature file for common API calls.
    - **web**: Contains Web/UI-related feature files.
  - **lib**: Contains libraries and utilities.
    - **interface**: Contains TypeScript interfaces.
      - `cucumber.ts`: Interface for Cucumber.
    - **scripts**: Contains scripts for API testing.
      - **api**: Contains API test scripts.
        - `ApiTestHelpers.ts`: Helper functions for Common API Test Cases.
      - **web**: Contains Web/UI test scripts.
        - `PageElements.ts`: Contains page element locators as key value. Pages segrated as objects like 
            {Page1:{elelment1: Locator, elelment2: Locator}, Page2: {element: Locator, elelment2: Locator}}
        - `PageActionsHelper.ts`: Helper functions for Web/UI. 
    - **utils**: Contains utility functions.
      - `APIUtils.ts`: Utility functions for API requests.
      - `Database.ts`: Utility functions for database operations.
      - `DbConnector.ts`: Utility functions for database connection.
      - `GetTestCaseData.ts`: Utility functions for getting test case data.
      - `Utilities.ts`: General utility functions.
  - **steps**: Contains the step definitions for API & Web tests.
    - **api**: Contains API-related step definitions.
      - `CommonApiSteps.ts`: Step definitions for common API calls.
     - **web**: Contains Web/UI-related step definitions.
        - `UtilSteps.ts`: Step definitions for common steps like reading excel data.
        - `PageActionsHelperSteps.ts`: Step definitions for Page Action Helpes.

- **resource.properties**: Contains endpoint mappings for API requests.

- **package.json**: Contains the project dependencies and scripts.

## Getting Started

To get started with this project, follow these steps after cloning repo:

1. Install dependencies:
   ```sh
   npm install
   ```

2. Run the web/ui tests:
   ```sh
   npm run test:ui
   ```

3. Run the Api tests:
   ```sh
   npm run test:api
   ```

4. Run all tests:
   ```sh
   npm run test:all
   ```
5. Run specific test via Tags:
   ```sh
   npm run test:ui OR npm run test:api - Make sure to put the desired tag in package-scripts.js file
   ``` 

6. Run tests in headless:
   ```sh
   IS_HEADLESS_MODE_ENABLED to be true in .env file
   ``` 

7. Run tests in GitHub CI:
   ```sh
   EXECUTE_TYPE key to be CI in .env file
   ```

8. Run tests in Parallel:
   ```sh
   WORKERS key to be updated as per the needs
   ```

9. Open Allure report to see the test results:
   ```sh
   npm run allure:serve
   ```
## Additional Information
