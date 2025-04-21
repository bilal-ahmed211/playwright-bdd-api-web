@GETRequestTests
@APITests
Feature: API Tests for fetching Pet by ID - GET Request
    This feature file tests the GET API endpoint "getPetById" with various scenarios, including:
    - Valid path parameters for successful pet retrieval
    - Invalid path parameters

    @PetStoreApiE2EFlow
    # #Scenario 1: GET Request with valid path parameter
    Scenario: Fetch PetId with valid path parameter
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json"
        Then Verify the API response status code is "200"
        Then I save api response as "successfulPetCreationResponse"
        Then I save the key value from response path "successfulPetCreationResponse.id" as "petId"
        Then Verify the API response matches the expected JSON file "AddNewPetExpectedResponse.json" excluding excluding fields:
            | id          |
            | category.id |
        Given I wait for 17000 milliseconds
        Given I make a GET request to "getPetById" endpoint with path parameter:
            | id      |
            | <petId> |
        Then Verify the API response status code is "200"
        Then Verify the API response time is within "1000" milliseconds
        Then Verify the API endpoint URL contains "/pet/"
        Then Verify the API response is in the expected "json" format
        Then Verify the API response headers contains the following fields & values:
            | Content-Type | application/json |

    # # Scenario 2: GET Request with Invalid path parameter
    Scenario: Fetch PetId with invalid path parameter - Non-existing petId
        Given I make a GET request to "getPetById" endpoint with path parameter:
            | id      |
            | 1321320 |
        Then Verify the API response status code is "404"
        Then Verify error message is received:
            | expectedErrorMessage |
            | Pet not found        |
        Then I save api response as "GETResponseForInvalidPathParamValue"

    # # Scenario 3: GET Request with Special Characters in path parameter
    Scenario: Fetch PetId with special characters in path parameter value
        Given I make a GET request to "getPetById" endpoint with path parameter:
            | id    |
            | #$%^@ |
        Then Verify the API response status code is "405"
        Then I save api response as "GETResponseForSpecialCharPathParamValue"

    # # Scenario 4: GET Request with Blank value for path parameter
    Scenario: Fetch PetId with Blank value for path parameter
        Given I make a GET request to "getPetById" endpoint with path parameter:
            | id |
            |    |
        Then Verify the API response status code is "405"
        Then I save api response as "GETResponseForBlankPathParamValue"
