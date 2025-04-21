import { Given } from "@cucumber/cucumber";
import { ICustomWorld } from "../../lib/interface/cucumber";
import { APIUtils } from "../../lib/utils/APIUtils";
// import { parseApiResponse } from "../../lib/utils/StepUtils";

const apiUtils = new APIUtils();

Given('I make a GET request to {string} endpoint', async function (this: ICustomWorld, endpoint: string) {
    this.apiResponse = await apiUtils.get(this.apiContext, `${endpoint}`);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

Given('I make a GET request to {string} endpoint with path parameter:', async function (this: ICustomWorld, endpoint: string, dataTable: any) {
    const rawTable = dataTable.rawTable;
    const pathParam = rawTable[1][0]; // Assuming the first row and first column contains the path parameter
    console.log(`Path Parameter: ${pathParam}`);
    this.apiResponse = await apiUtils.getWithPathParam(this.apiContext, `${endpoint}`, pathParam);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

Given('I make a GET request to {string} endpoint with query parameter:', async function (this: ICustomWorld, endpoint: string, dataTable: any) {
    const rawTable = dataTable.rawTable;
    const queryParams = rawTable.reduce((acc: any, [key, value]: [string, string]) => {
        acc[key] = value;
        return acc;
    }, {});
    console.log(`Query Parameters: ${JSON.stringify(queryParams)}`);
    this.apiResponse = await apiUtils.getWithQueryParam(this.apiContext, endpoint, queryParams);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

Given('I make a GET request to non-existing endpoint {string}', async function (this: ICustomWorld, endpoint: string) {
    this.apiResponse = await apiUtils.get(this.apiContext, `${endpoint}`);
    this.apiResponseBody = await apiUtils.parseApiResponse(this.apiResponse);
});

Given('I wait for {int} milliseconds', async function (milliseconds: number) {
    console.log(`Waiting for ${milliseconds} milliseconds...`);
    await new Promise(resolve => setTimeout(resolve, milliseconds));
});