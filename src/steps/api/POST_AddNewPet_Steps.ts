import { Given } from "@cucumber/cucumber";
import { ICustomWorld } from "../../lib/interface/cucumber";
import { APIUtils } from "../../lib/utils/APIUtils";
import { readJsonFile } from "../../lib/scripts/api/ApiTestHelpers";
import { APIResponse } from "@playwright/test";
import * as path from "path";

const apiUtils = new APIUtils();
const folderName = 'PetStoreApi';
const payloadFilePath = path.resolve(__dirname, `../../data/api/${folderName}`);

//Reads and prepares the payload with a dynamic ID.
export async function preparePayload(payloadFileName: string, modifications?: (payload: any) => void): Promise<any> {
    const payload = await readJsonFile(payloadFileName, payloadFilePath);
    const dynamicId = new Date().getTime();
    payload.id = dynamicId; // Add dynamic ID to the payload
    console.log(`Dynamic ID generated: ${dynamicId}`);
    if (modifications) {
        modifications(payload);
    }
    console.log('Modified payload:', JSON.stringify(payload, null, 2));
    return payload;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< POST REQUEST STEP DEFINITIONS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// --- Step Definition to make POST Request with valida data [payload, headers, Auth]  ---
Given('I make a POST request to {string} endpoint with payload {string}', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string) {
    const payload = await readJsonFile(payloadFileName, payloadFilePath);
    const dynamicId = new Date().getTime();
    payload.id = dynamicId; // Add dynamic ID to the payload
    console.log(`Dynamic ID generated: ${dynamicId}`);
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

// --- Step Definition to make POST Request without passing payload  ---
Given('I make a POST request to {string} endpoint without payload',
    async function (this: ICustomWorld, endpoint: string) {
        this.apiResponse = await apiUtils.post(this.apiContext, endpoint); // No payload
        this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request with Blank/Empty payload  ---
Given('I make a POST request to {string} endpoint with an empty payload',
    async function (this: ICustomWorld, endpoint: string) {
        let payload: any;
        this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload); // Empty payload
        this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request with Invalid JSON Format in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and invalid JSON format', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string) {
        const invalidPayload = '{ "invalidJson": }'; // Invalid JSON
        console.log('Sending invalid JSON payload:', invalidPayload);
        this.apiResponse = await apiUtils.post(this.apiContext, endpoint, { data: invalidPayload });
        this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request with Missing Fields in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and missing required fields:', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
    const fieldsToRemove = dataTable.raw()[0];
    const payload = await preparePayload(payloadFileName, (payload) => {
        fieldsToRemove.forEach(async field => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                delete payload[field];
                console.log(`Removed key "${field}" from the payload.`);
            } else {
                await apiUtils.logMissingKeyWarning(field);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

// --- Step Definition to make POST Request with Extra/Additional fields in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and extra fields in payload:', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
    const rawData: string[][] = dataTable.raw();
    const fields = rawData[0];
    const values = rawData[1];
    const extraFields: Record<string, any> = {};
    fields.forEach((field, index) => {
        extraFields[field] = values[index];
    });
    const payload = await preparePayload(payloadFileName, (payload) => {
        Object.assign(payload, extraFields);
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

// --- Step Definition to make POST Request with special characters for field values in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and special characters for fields:', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
    const keysToReplace: string[] = dataTable.raw()[0];
    const specialChars = '@#$%^&*()';
    const payload = await preparePayload(payloadFileName, (payload) => {
        keysToReplace.forEach(async (key) => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                payload[key] = specialChars;
            } else {
                await apiUtils.logMissingKeyWarning(key);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

// --- Step Definition to make POST Request with Blank values for field values in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and blank values for fields:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable) {
        const keysToBlank: string[] = dataTable.raw()[0];
    const payload = await preparePayload(payloadFileName, (payload) => {
        keysToBlank.forEach(async (key) => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                payload[key] = "";
            } else {
                await apiUtils.logMissingKeyWarning(key);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request with NULL values in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and null values for fields:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable) {
        const fieldsToNull: string[] = dataTable.raw()[0];
    const payload = await preparePayload(payloadFileName, (payload) => {
        fieldsToNull.forEach(async (field) => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                payload[field] = null;
            } else {
                await apiUtils.logMissingKeyWarning(field);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request with Long values for fields in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and long values for fields:', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
    const keysToAssignLongValues: string[] = dataTable.raw()[0];
    const payload = await preparePayload(payloadFileName, (payload) => {
        keysToAssignLongValues.forEach(async (key) => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                payload[key] = 'a'.repeat(200); // Generate a string with 200 'a' characters
            } else {
                await apiUtils.logMissingKeyWarning(key);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

Given('I make a POST request to {string} endpoint with payload {string} and emoji values for fields:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
        const keysToReplaceWithEmojis: string[] = dataTable.raw()[0];
    const emojiValue = '😊🚀🌟🔥'; // Example emoji string
    const payload = await preparePayload(payloadFileName, (payload) => {
        keysToReplaceWithEmojis.forEach(async (key) => {
            if (Object.prototype.hasOwnProperty.call(payload, key)) {
                payload[key] = emojiValue;
            } else {
                await apiUtils.logMissingKeyWarning(key);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    }
);

// --- Step Definition to make POST Request with SQL injection values for fields in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and SQL injection values for fields:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable) {
        const fieldsToInject: string[] = dataTable.raw()[0];
    const sqlInjectionValue = "'; DROP TABLE users; --"; // Example SQL injection string
    const payload = await preparePayload(payloadFileName, (payload) => {
        fieldsToInject.forEach(async (field) => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                payload[field] = sqlInjectionValue;
            } else {
                await apiUtils.logMissingKeyWarning(field);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request with JavaScript injection values for fields in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and JavaScript injection values for fields:', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
    const fieldsToInject: string[] = dataTable.raw()[0];
    const jsInjectionValue = "<script>alert('Injected!');</script>"; // Example JavaScript injection string
    const payload = await preparePayload(payloadFileName, (payload) => {
        fieldsToInject.forEach(async (field) => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                payload[field] = jsInjectionValue;
            } else {
                await apiUtils.logMissingKeyWarning(field);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

// --- Step Definition to make POST Request with Server commands injection values for fields in the payload  ---
Given('I make a POST request to {string} endpoint with payload {string} and server command injection values for fields:', 
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable: any) {
    const fieldsToInject: string[] = dataTable.raw()[0];
    const serverCommandInjectionValue = "&& rm -rf /"; // Example server command injection string
    const payload = await preparePayload(payloadFileName, (payload) => {
        fieldsToInject.forEach(async (field) => {
            if (Object.prototype.hasOwnProperty.call(payload, field)) {
                payload[field] = serverCommandInjectionValue;
            } else {
                await apiUtils.logMissingKeyWarning(field);
            }
        });
    });
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, payload);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

// --- Step Definition to make POST Request Without Required Headers  ---
Given('I make a POST request to {string} endpoint with payload {string} and without required headers:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable) {
        const headerModifications = dataTable.rowsHash();
    const payload = await preparePayload(payloadFileName);
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    for (const key in headerModifications) {
        if (headerModifications[key] === "") {
            delete headers[key];
        } else {
            headers[key] = headerModifications[key];
        }
    }
    console.log("Final headers for request:", headers);
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, { data: payload, headers });
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request With blank values for Headers  ---
Given('I make a POST request to {string} endpoint with payload {string} and blank values for headers:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable) {
        const headers: Record<string, string> = dataTable.rowsHash();
    const payload = await preparePayload(payloadFileName);
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, { data: payload, headers });
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });

// --- Step Definition to make POST Request With Extra Keys In Headers  ---
Given('I make a POST request to {string} endpoint with payload {string} and extra keys in headers:',
    async function (this: ICustomWorld, endpoint: string, payloadFileName: string, dataTable) {
        const additionalHeaders: Record<string, string> = dataTable.rowsHash();
    const payload = await preparePayload(payloadFileName);
    this.apiResponse = await apiUtils.post(this.apiContext, endpoint, { data: payload, headers: additionalHeaders });
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
    });
