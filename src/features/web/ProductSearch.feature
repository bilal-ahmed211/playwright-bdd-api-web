@ui @ProductSearchTest
Feature: Web - TestCaseD_Search_Product_And_Verify_Results

    Background: Page Navigations
    Given user navigate to Home page

    @TestCaseD_SearchNoResultsFound
    Scenario Outline: Verify product search for invalid product name
        When user enter the product name in search box
        Then Wait for "3000" milli-seconds
        Then Verify the error message is displayed for no search results found

    @TestCaseD_SearchValidProduct
    Scenario: Verify product search for a valid product name
        When user searches for a valid product name "Laptop"
        Then search results should display products related to "Laptop"

    @TestCaseD_SearchSpecialCharacters
    Scenario: Verify search with special characters
        When user searches for a product name with special characters "!@#$%"
        Then Verify the error message is displayed for no search results found

    @TestCaseD_SearchPartialMatch
    Scenario: Verify product search with a partial match
        When user searches for a partial product name "Lap"
        Then search results should display products related to "Lap"

    @TestCaseD_SearchCaseInsensitive
    Scenario: Verify product search is case insensitive
        When user searches for a valid product name "laptop" in lowercase
        Then search results should display products related to "Laptop"
