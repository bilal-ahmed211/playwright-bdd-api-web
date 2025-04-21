@ui @UserLoginTest
Feature: Web - User Login Functionality Test

Background: Navigate to Home & Login Page
    Given user navigate to Home page
    Given user navigate to Login page

    Scenario: user cannot login with empty credentials
        When user click on signin button
        Then Wait for "3000" milli-seconds
        Then Verify error message is displayed indicating Fields are required
        Then Verify user is not logged in and remains on the login page

    Scenario: user can login with valid credentials
        When user enter valid credentials and click on signin button
        Then Wait for "3000" milli-seconds
        Then Verify user is logged in successfully and redirected to my account page



