@ui @userRegistration
Feature: Web - TestCaseA_Registration_Flow_And_Login_Validation

    @TestCaseA_RegistrationFlowAndLoginValidation
    Scenario Outline: TestCaseA_Registration_Flow_And_Login_Validation
        Given Read Static Test Data from Excel sheet
            | <fileName> | <sheetName> | <TestCaseName> |
        Given user navigate to Home page
        Given user navigate to Registration page
        When user fill regisration form details from static excel sheet
        When user submit registration form data by clicking create account button
        Then Verify success message is displayed on my account page
        Then Verify contact information is displayed on my account page
        Then user signout from the application
        Given user navigate to Login page
        Then Wait for "3000" milli-seconds
        When user enter newly registered credentials
        And user click on signin button
        Then Wait for "3000" milli-seconds
        Then Verify user is logged in successfully and redirected to my account page

        Examples:
            | fileName      | sheetName      | TestCaseName                                     |
            | ExcelTestData | StaticTestData | TestCaseA_Registration_Flow_And_Login_Validation |

    @StaticExcelTestData
    Scenario Outline: Verify account is created with valid data
        Given Read Static Test Data from Excel sheet
            | <fileName> | <sheetName> | <TestCaseName> |
        Given user navigate to Home page
        Given user navigate to Registration page
        When user fill regisration form details from static excel sheet
        When user submit registration form data by clicking create account button
        Then Verify success message is displayed on my account page

        Examples:
            | fileName      | sheetName      | TestCaseName                              |
            | ExcelTestData | StaticTestData | Verify account is created with valid data |

    @FakersjsDefaultModulesTestData
    Scenario: Fill register user form directly from fakerjs modules
        Given user navigate to Home page
        Given user navigate to Registration page
        When user fill regisration form details from dynamic fakerjs Modules
        When user submit registration form data by clicking create account button
        Then Verify success message is displayed on my account page

    Scenario: Verify account cannot be created with password less than minimum length
        Given user navigate to Home page
        Given user navigate to Registration page
        When user enter password less than minimum length
        When user submit registration form data by clicking create account button
        Then Wait for "3000" milli-seconds
        Then Verify the error message is displayed for password less than minimum length


    Scenario: Verify account cannot be created with mismatched password confirmation
        Given user navigate to Home page
        Given user navigate to Registration page
        When user enter password and confirm password with different values
        When user submit registration form data by clicking create account button
        Then Wait for "3000" milli-seconds
        Then Verify the error message is displayed for mismatched password confirmation


    Scenario: Verify account cannot be created with blank values for required fields
        Given user navigate to Home page
        Given user navigate to Registration page
        When user leave mandatory fields blank
        When user submit registration form data by clicking create account button
        Then Wait for "5000" milli-seconds
        Then Verify the error message is displayed for blank values

    Scenario: Verify account cannot be created with duplicate email address
        Given user navigate to Home page
        Given user navigate to Registration page
        When user fill regisration form details with duplicate email address
        When user submit registration form data by clicking create account button
        Then Verify the error message is displayed for duplicate email address


    Scenario: Verify account cannot be created with invalid email format
        Given user navigate to Home page
        Given user navigate to Registration page
        When user fill regisration form details with invalid email format
        When user submit registration form data by clicking create account button
        Then Wait for "4000" milli-seconds
        Then Verify the error message is displayed for invalid email format


