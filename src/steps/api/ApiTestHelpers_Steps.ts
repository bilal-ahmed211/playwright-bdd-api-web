import { Then } from "@cucumber/cucumber";
import { APIResponse } from "@playwright/test";
import { ICustomWorld } from "../../lib/interface/cucumber";
import { APIUtils } from "../../lib/utils/APIUtils";
import * as path from "path";
import * as fs from "fs";

import {
    verifyStatusCode,
    verifyResponseFormat,
    verifyResponseBodyContainsExpectedFieldsFromDataTable,
    verifyEndpointUrlContains,
    verifyResponseHeaderKeysAndValues,
    verifyResponseTime,
    getKeyValueFromResponse,
    verifyResponseAgainstExpectedJsonFile,
    verifyApiResponseWithNestedKeys,
    verifyErrorMessage,
} from "../../lib/scripts/api/ApiTestHelpers";

const folderName = 'PetStoreApi'; // Change this value as needed
let payloadFilePath = path.resolve(__dirname, `../../data/api/${folderName}`);
const expectedResponseJson = (fileName: string): any => {
    const filePath = path.resolve(payloadFilePath, `ExpectedResponses/${fileName}`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Expected response file not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

let responseBody: any;

// <<<<<<<<< STEP DEFINITIONS FOR SAVING API RESPONSE & Verify ERROR MESSAGES >>>>>>>>

// --- Step Definition to save API response ---
Then('I save api response as {string}', async function (apiResponse: string) {
    if (!(global as any).responseMapper) {
        (global as any).responseMapper = new Map<string, any>();
    }

    // Check if the response body exists
    if (!this.apiResponse) {
        console.error('API Response is undefined. Ensure the API call was successful.');
        throw new Error('API Response is undefined.');
    }
    const contentType = this.apiResponse.headers()['content-type'] || '';
    console.log(`Content-Type of the response: ${contentType}`);

    // Parse the response body based on the content type
    try {
        if (contentType.includes('application/json')) {
            responseBody = await this.apiResponse.json();
        } else {
            responseBody = await this.apiResponse.text();
        }
    } catch (error) {
        console.error('Error parsing the response body:', error);
        throw new Error('Failed to parse the response body.');
    }

    // Check if the response body is still undefined
    if (!responseBody) {
        console.error('Response body is undefined after parsing.');
        throw new Error('Response body is undefined.');
    }

    // Save the response body in the global response mapper
    (global as any).responseMapper.set(apiResponse, responseBody);
    console.log(`Response saved with key "${apiResponse}":`, JSON.stringify(responseBody, null, 2));
});

// --- Step Definition to save key value from response ---
Then('I save the key value from response path {string} as {string}', async function (this: ICustomWorld, keyPath: string, alias: string) {
    const value = await getKeyValueFromResponse(keyPath, alias);
    console.log(`Key Value Saved: ${alias} = ${value}`);
});

// --- Step Definition to verify response contains expected error message  ---
Then('Verify error message is received:', async function (this: ICustomWorld, dataTable: any) {
    const rawTable = dataTable.rawTable;
    const expectedErrorMessage = rawTable[1][0]; // Assuming the first row and first column contains the error message
    await verifyErrorMessage(this, expectedErrorMessage);
});

Then('Verify the API response contains the following keys and values:', async function (this: ICustomWorld, dataTable: any) {
    if (!this.apiResponse) {
        throw new Error('API response is undefined. Ensure the API call was made successfully.');
    }
    let responseBody: any;
    try {
        responseBody = await this.apiResponse.json();
    } catch (error) {
        responseBody = await this.apiResponse.text();
        throw new Error(`Failed to parse response body as JSON. Response: ${responseBody}`);
    }
    const keyValuePairs = dataTable.rowsHash(); // Converts the data table into a key-value object
    // Verify each key and its value
    for (const [key, expectedValue] of Object.entries(keyValuePairs)) {
        if (!Object.prototype.hasOwnProperty.call(responseBody, key)) {
            throw new Error(`Key "${key}" is missing in the API response.`);
        }

        const actualValue = responseBody[key];
        if (actualValue.toString() !== expectedValue) {
            throw new Error(`Value mismatch for key "${key}": Expected "${expectedValue}", but got "${actualValue}".`);
        }
        console.log(`✅ Verified key "${key}" exists with the expected value: "${expectedValue}".`);
    }
});

// --- Step Definition for Verifying Response Status Code ---
Then('Verify the API response status code is {string}', async function (this: ICustomWorld, expectedStatusCode: any) {
    await verifyStatusCode(this, expectedStatusCode);
});

// --- Step Definition for Verifying Response Time ---
Then('Verify the API response time is within {string} milliseconds', async function (this: ICustomWorld, maxResponseTime: number) {
    await verifyResponseTime(this, Number(maxResponseTime));
});

// --- Step Definition for Verifying Endpoint URL contains expected text ---
Then('Verify the API endpoint URL contains {string}', async function (this: ICustomWorld, expectedUrl: string) {
    await verifyEndpointUrlContains(this, expectedUrl);
});

// --- Step Definition for Verifying Response expected format (e.g. JSON, XML) ---
Then('Verify the API response is in the expected {string} format', async function (this: ICustomWorld, expectedFormat: string) {
    await verifyResponseFormat(this, expectedFormat);
});

// --- Step Definition for Verifying Response Contains Fields ---
Then('Verify the API response body contains the following keys:', async function (this: ICustomWorld, dataTable: any) {
    const expectedFields = dataTable.rawTable.map(row => row[0]); // Extract field names from the data table
    await verifyResponseBodyContainsExpectedFieldsFromDataTable(this, expectedFields);
});

Then('Verify the API response body contains the following keys from {string}', async function (this: ICustomWorld, expectedpayloadFilePath: string) {
    const fileName = expectedResponseJson(expectedpayloadFilePath);
    await verifyResponseAgainstExpectedJsonFile(this, fileName);
});

// --- Step Definition for Verifying Response Headers ---
Then('Verify the API response headers contains the following fields & values:', async function (this: ICustomWorld, dataTable: any) {
    const expectedHeaders = dataTable.rowsHash(); // Read expected headers from data table
    await verifyResponseHeaderKeysAndValues(this, expectedHeaders);
});

Then('Verify the API response matches the expected JSON file {string} excluding excluding fields:', async function (this: ICustomWorld, fileName: string, dataTable: any) {
    const excludedFields = dataTable.raw().flat(); // Extract excluded fields from the data table
    const expectedJsonFilePath = path.resolve(__dirname, `../../data/api/${folderName}/ExpectedResponses/${fileName}`);
    if (!fs.existsSync(expectedJsonFilePath)) {
        throw new Error(`Expected JSON file not found: ${expectedJsonFilePath}`);
    }
    await verifyApiResponseWithNestedKeys(this, expectedJsonFilePath, excludedFields);
});



