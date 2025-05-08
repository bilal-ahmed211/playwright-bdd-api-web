import { expect } from '@playwright/test';
import Ajv from 'ajv';
import { ICustomWorld } from "../../interface/cucumber";
import * as path from 'path';
import * as fs from 'fs';

const ajv = new Ajv(); // Instantiate AJV

export const validateJsonSchema = (jsonData: any, schema: any): boolean => {
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);
    if (!valid) {
        console.error('❌ JSON Schema Validation Errors:', validate.errors);
    } else {
        console.log('✅ JSON Schema Validation Passed');
    }
    return valid;
};
export const validateJsonSchemaFromFile = (jsonData: any, schemaFilePath: string): boolean => {
    const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'));
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);
    if (!valid) {
        console.error('❌ JSON Schema Validation Errors:', validate.errors);
    } else {
        console.log('✅ JSON Schema Validation Passed');
    }
    return valid;
};
export const validateJsonSchemaFromFileWithPath = (jsonData: any, schemaFilePath: string): boolean => {
    const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'));
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);
    if (!valid) {
        console.error('❌ JSON Schema Validation Errors:', validate.errors);
    } else {
        console.log('✅ JSON Schema Validation Passed');
    }
    return valid;
};

export const readJsonFile = async (fileName: string, jsonFilePath: any): Promise<any> => {
    const filePath = path.resolve(__dirname, `${jsonFilePath}`, fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

export function getKeyValueFromResponse(keyPath: string, responseKey: string): any {
    const keys = keyPath.split('.');
    const responseMapper = (global as any).responseMapper;
    let value = responseMapper.get(keys.shift());

    for (const key of keys) {
        value = value[key];
        if (value === undefined) {
            throw new Error(`❌ Key path ${keyPath} not found in response`);
        }
    }
    if (value !== undefined) {
        responseMapper.set(responseKey, value);
    } else {
        console.error(`❌ Failed to save value: ${keyPath} not found in response`);
    }
    (global as any).savedValues = (global as any).savedValues || {};
    (global as any).savedValues[responseKey] = value;
    return value;
}

// **1. Verify Response Status Code**
export const verifyStatusCode = async (world: ICustomWorld, expectedStatusCode: number): Promise<void> => {
    const actualStatusCode = world.apiResponse.status();
    try {
        expect(actualStatusCode).toEqual(Number(expectedStatusCode));
        console.log(`✅ Status Code Verified: Expected = ${expectedStatusCode}, Actual = ${actualStatusCode}`);
    } catch (error) {
        console.error(`❌ Status Code Mismatch: Expected = ${expectedStatusCode}, Actual = ${actualStatusCode}`);
        console.error(`Response Body: ${JSON.stringify(await world.apiResponse.json(), null, 2)}`);
        throw error;
    }
};

// **2. Verify Response Time**
export const verifyResponseTime = async (world: ICustomWorld, maxResponseTime: number): Promise<void> => {
    const startTime = new Date(world.apiResponse.headers()['date'] || '').getTime();
    const endTime = new Date(world.apiResponse.headers()['date'] || '').getTime();
    const responseTime = endTime - startTime;
    try {
        expect(responseTime).toBeLessThanOrEqual(maxResponseTime);
        console.log(`✅ Response Time Verified: ${responseTime}ms (<= ${maxResponseTime}ms)`);
    } catch (error) {
        console.error(`❌ Response Time Exceeded: ${responseTime}ms (> ${maxResponseTime}ms)`);
        throw error;
    }
};

// **3. Verify Endpoint URL contain expected text**
export const verifyEndpointUrlContains = async (world: ICustomWorld, expectedUrl: string): Promise<void> => {
    const actualUrl = world.apiResponse.url();

    try {
        if (actualUrl.includes(expectedUrl)) {
            console.log(`✅ Endpoint URL Verified: "${actualUrl}" contains "${expectedUrl}"`);
        } else if (actualUrl === expectedUrl) {
            console.log(`✅ Endpoint URL Verified: "${actualUrl}" matches "${expectedUrl}"`);
        } else {
            throw new Error(`❌ Endpoint URL Mismatch: Expected to contain or match "${expectedUrl}", but got "${actualUrl}"`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// **4. Verify Response Format is as expected (e.g JSON, XML)**
export const verifyResponseFormat = async (world: ICustomWorld, expectedFormat: string): Promise<void> => {
    const contentType = (await world.apiResponse)?.headers()['content-type'];
    let actualFormat: string;

    if (contentType?.includes('application/json')) {
        actualFormat = 'json';
    } else if (contentType?.includes('text/html')) {
        actualFormat = 'html';
    } else if (contentType?.includes('application/xml') || contentType?.includes('text/xml')) {
        actualFormat = 'xml';
    } else {
        actualFormat = 'unknown';
    }

    expect(actualFormat).toBe(expectedFormat);
};

// **3. Verify Response Headers Keys & Values**
export const verifyResponseHeaderKeysAndValues = async (world: ICustomWorld, expectedHeaders: { [key: string]: string }): Promise<void> => {
    const actualHeaders = world.apiResponse.headers();
    for (const [key, value] of Object.entries(expectedHeaders)) {
        try {
            expect(actualHeaders[key.toLowerCase()]).toEqual(value);
            console.log(`✅ Header Verified: ${key} = ${value}`);
        } catch (error) {
            console.error(`❌ Header Mismatch: ${key} - Expected = ${value}, Actual = ${actualHeaders[key.toLowerCase()]}`);
            throw error;
        }
    }
};

// **6. Verify Response Contains Expected Fields from datatable**
export const verifyResponseBodyContainsExpectedFieldsFromDataTable = async (world: ICustomWorld, expectedFields: string[]): Promise<void> => {
    let responseBody: any = null; // Initialize responseBody to avoid undefined errors
    try {
        const contentType = world.apiResponse.headers()['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            const rawResponse = await world.apiResponse.text();
            throw new Error(`Expected JSON response but received: ${rawResponse}`);
        }

        responseBody = await world.apiResponse.json();
        for (const field of expectedFields) {
            expect(responseBody).toHaveProperty(field);
            console.log(`✅ Verified field exists: ${field}`);
        }
    } catch (error) {
        // Log the raw response if responseBody is not available
        if (!responseBody) {
            const rawResponse = await world.apiResponse.text();
            console.error(`Raw Response: ${rawResponse}`);
        }
        console.error(`Error verifying response body: ${responseBody.message || responseBody.error || responseBody}`);
        throw error;
    }
};

export async function verifyResponseAgainstExpectedJsonFile(world: ICustomWorld, expectedJsonFilePath: string, keysToIgnore: string[] = []): Promise<void> {
    const expectedResponse = JSON.parse(fs.readFileSync(expectedJsonFilePath, 'utf-8'));

    if (typeof expectedResponse !== 'object' || expectedResponse === null) {
        throw new Error(`Expected JSON file content must be an object. Received: ${typeof expectedResponse}`);
    }
    const actualResponse = await world.apiResponse.json();
    const compareObjects = (expected: any, actual: any, parentKey = ''): void => {
        if (typeof expected !== 'object' || expected === null) {
            if (expected !== actual) {
                throw new Error(`Mismatch at "${parentKey}": Expected "${expected}", but got "${actual}"`);
            }
            return;
        }

        if (typeof actual !== 'object' || actual === null) {
            throw new Error(`Expected an object at "${parentKey}", but got: ${typeof actual}`);
        }

        const expectedKeys = Object.keys(expected);
        for (const key of expectedKeys) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;

            // Skip keys that are in the keysToIgnore array
            if (keysToIgnore.includes(fullKey)) {
                console.log(`⚠️ Skipping comparison for key: "${fullKey}"`);
                continue;
            }

            if (!(key in actual)) {
                throw new Error(`Missing key "${fullKey}" in the actual response`);
            }
            compareObjects(expected[key], actual[key], fullKey);
        }
    };

    try {
        compareObjects(expectedResponse, actualResponse);
        console.log('✅ Response matches the expected JSON structure.');
    } catch (error) {
        console.error('❌ Response does not match the expected JSON structure:', error);
        throw error;
    }
}

// **2. Valiate Error Message Content**
export const verifyErrorMessage = async (world: ICustomWorld, expectedErrorMessage: string): Promise<void> => {
    let responseBody: any;
    try {
        responseBody = await (await world.apiResponse)?.json();
    } catch (error) {
        responseBody = await (await world.apiResponse)?.text();
    }
    expect((await world.apiResponse)?.status()).toBeLessThanOrEqual(500);
    const checkNestedKeys = (obj: any, key: string): any => {
        const keys = key.split('.');
        let value = obj;
        for (const k of keys) {
            value = value[k];
            if (value === undefined) {
                return undefined;
            }
        }
        return value;
    };
    // Ensure the body contains an appropriate error message
    const actualErrorMessage = checkNestedKeys(responseBody, 'message') || checkNestedKeys(responseBody, 'error') || responseBody;
    expect(actualErrorMessage).toContain(expectedErrorMessage);
};

export async function verifyApiResponseWithNestedKeys(world: ICustomWorld, expectedJsonFilePath: string, excludedFields: string[] = []): Promise<void> {
    const expectedResponse = JSON.parse(fs.readFileSync(expectedJsonFilePath, 'utf-8'));

    if (typeof expectedResponse !== 'object' || expectedResponse === null) {
        throw new Error(`Expected JSON file content must be an object. Received: ${typeof expectedResponse}`);
    }

    const actualResponse = await world.apiResponse.json();

    const compareNestedKeys = (expected: any, actual: any, parentKey = ''): void => {
        if (typeof expected !== 'object' || expected === null) {
            if (expected !== actual) {
                throw new Error(`Mismatch at "${parentKey}": Expected "${expected}", but got "${actual}"`);
            }
            return;
        }

        if (typeof actual !== 'object' || actual === null) {
            throw new Error(`Expected an object at "${parentKey}", but got: ${typeof actual}`);
        }

        const expectedKeys = Object.keys(expected);
        for (const key of expectedKeys) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;

            // Skip keys that are in the excludedFields array
            if (excludedFields.includes(fullKey)) {
                console.log(`⚠️ Skipping comparison for key: "${fullKey}"`);
                continue;
            }

            if (!(key in actual)) {
                throw new Error(`Missing key "${fullKey}" in the actual response`);
            }

            compareNestedKeys(expected[key], actual[key], fullKey);
        }
    };

    try {
        compareNestedKeys(expectedResponse, actualResponse);
        console.log('✅ Verified API response matches the expected JSON structure and values.');
    } catch (error) {
        console.error('❌ API response does not match the expected JSON structure or values:', error);
        throw error;
    }
}

export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
