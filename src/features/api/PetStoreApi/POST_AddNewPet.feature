@POSTRequestTests
@APITests
Feature: API Tests for Add New Pet - POST Request
    This feature file tests the POST API endpoint "addNewPet" with various scenarios, including:
    - Valid payloads for successful pet creation
    - Missing, invalid, or malformed payloads
    - Payloads with missing, extra, blank, null, long, or special character values
    - Payloads with injection attacks (SQL, JavaScript, server command)
    - Missing or malformed headers
    - Edge cases like emojis and extra header keys

    @AddNewPet_Positive
    #Scenario 1: POST Request with valid payload data
    Scenario: Add New Pet with valid payload data
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json"
        Then Verify the API response status code is "200"
        Then Verify the API response time is within "1000" milliseconds
        Then Verify the API response is in the expected "json" format
        Then Verify the API response headers contains the following fields & values:
            | Content-Type | application/json |
        Then Verify the API response body contains the following keys:
            | id | category | name | photoUrls | tags | status |
        Then Verify the API response matches the expected JSON file "AddNewPetExpectedResponse.json" excluding excluding fields:
            | id          |
            | category.id |
        Then I save api response as "successfulPetCreationResponse"
        Then I save the key value from response path "successfulPetCreationResponse.id" as "petId"


    # # Scenario 2: POST Request with Missing/Without payload
    Scenario: Add New Pet without passing payload
        Given I make a POST request to "addNewPet" endpoint without payload
        Then Verify the API response status code is "405"
        Then Verify error message is received:
            | expectedErrorMessage |
            | no data              |
        Then I save api response as "ErrorWithoutPayloadResponse"

    # # Scenario 3: POST Request with Invalid JSON Format
    Scenario: Add New Pet with Invalid pyaload JSON Format
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and invalid JSON format
        Then Verify the API response status code is "200"
        # Then Verify error message is received:
        #     | expectedErrorMessage   |
        #     | something bad happened |
        Then I save api response as "ErrorInvalidJSONResponse"

    # # Scenario 4: POST Request with Missing Required Fields
    Scenario: Add New Pet with Missing Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and missing required fields:
            | id | category | name | photoUrls | tags |
        Then Verify the API response status code is "200"
        Then I save api response as "ErrorMissingRequiredFieldsResponse"

    ## Scenario 5: POST Request with Extra Fields in the payload
    Scenario: Add New Pet with Extra Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and extra fields in payload:
            | extraField1 | extraField2 | customNote     |
            | ExtraValue1 | ExtraValue2 | This is a note |
        Then Verify the API response status code is "200"
        Then I save api response as "ErrorExtraFieldsResponse"

    ## Scenario 6: POST Request with special characters in the payload
    Scenario: Add New Pet with Special Characters for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and special characters for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorSpecialCharactersResponse"

    # # Scenario 7: POST Request with Blank Values For Required Fields
    Scenario: Add New Pet with Blank Values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and blank values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorBlankValuesForRequiredFieldsResponse"

    ## Scenario 8: POST Request with NULL values in payload for specific fields
    Scenario: Add New Pet with NULL values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and null values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "200"
        Then I save api response as "ErrorNullValuesResponse"

    ## Scenario 9: POST Request with Long values for fields in the payload
    Scenario: Add New Pet with Long Values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and long values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorLongValuesResponse"

    ## Scenario 10: POST Request with Emojis values for fields in the payload
    Scenario: Add New Pet with Emoji values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and emoji values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorEmojiValuesResponse"

    ## Scenario 11: POST Request with SQL injection values for fields in the payload
    Scenario: Add New Pet with SQL injection values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and SQL injection values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorSQLInjectionResponse"

    ## Scenario 12: POST Request with JavaScript injection values for fields in the payload
    Scenario: Add New Pet with JavaScript injection values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and JavaScript injection values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorJavaScriptInjectionResponse"

    ## Scenario 13: POST Request with Server Command Injection values for fields in the payload
    Scenario: Add New Pet with Server Command Injection values for Required Fields in the payload
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and server command injection values for fields:
            | category | name | photoUrls | tags | status |
        Then Verify the API response status code is "500"
        Then I save api response as "ErrorServerCommandInjectionResponse"

    ## Scenario 14: POST Request with missing required headers
    Scenario: Add New Pet with Missing Required Headers
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and without required headers:
            |  |  |
        Then Verify the API response status code is "200"
        Then I save api response as "ErrorMissingHeadersResponse"

    ## Scenario 15: POST Request with blank values for specific headers
    Scenario: Add New Pet with Blank Values for Required Headers
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and blank values for headers:
            | Content-Type |  |
        Then Verify the API response status code is "200"
        Then I save api response as "ErrorBlankHeadersResponse"

    ## Scenario 16: POST Request with Extra Keys in Headers
    Scenario: Add New Pet with Extra Keys in Headers
        Given I make a POST request to "addNewPet" endpoint with payload "addNewPet.json" and extra keys in headers:
            | Content-Type   |  |
            | Authorization  |  |
            | ExtraHeaderKey |  |
        Then Verify the API response status code is "200"
        Then I save api response as "ErrorExtraKeysInHeadersResponse"

