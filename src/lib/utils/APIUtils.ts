import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { getTestCaseData } from './GetTestCaseData';
import { ICustomWorld } from '../interface/cucumber';
import { isEmpty } from './Utilities';
import { Helpers } from './Helpers';
import _ from 'lodash';
require('dotenv').config();

export class APIUtils {
    private baseURL: string;
    private endpointURL: string;
    private completeURL: string;
    private headers: any;
    private helpers: Helpers;

    constructor() {
        this.baseURL = '';
        this.endpointURL = '';
        this.completeURL = '';
        this.headers = {};
        this.helpers = new Helpers();
    }

    public async getToken(clientSecret: any, clientId: any): Promise<any> {
        return Promise.resolve({});
    }

    public async getRequestHeaders(
        isAuthRequired: boolean,
        additionalHeaders?: { [key: string]: string }
    ): Promise<{ [key: string]: string }> {
        const commonHeaders = await this.generateHeaders(isAuthRequired);
        return this.mergeHeaders(commonHeaders, additionalHeaders);
    }

    public async getBaseURL(endpoint: any): Promise<string> {
        if (endpoint.includes('/v2/pet')) {
            return (this.baseURL = process.env.PETSTORE_BASE_API_URL);
        } else {
            return (this.baseURL = process.env.BASE_API_URL);
        }
    }

    public async getCompleteUrl(endpoint: string): Promise<string> {
        this.baseURL = await this.getBaseURL(endpoint);
        this.endpointURL = this.helpers.findFileAndGetValue('resource.properties', endpoint);
        this.completeURL = `${this.baseURL}${this.endpointURL}`;
        return this.completeURL;
    }

    public async generateHeaders(isAuthRequired: boolean): Promise<{ [key: string]: string }> {
        this.headers = {
            'Content-Type': 'application/json',
        };
        return this.headers;
    }

    public mergeHeaders(
        commonHeaders: { [key: string]: string },
        additionalHeaders?: { [key: string]: string }
    ): { [key: string]: string } {
        if (additionalHeaders && typeof additionalHeaders === 'object') {
            return { ...commonHeaders, ...additionalHeaders };
        }
        return commonHeaders;
    }

    public async get(apiContext: APIRequestContext, endpoint: string, dataTable?: any): Promise<any> {
        this.baseURL = await this.getBaseURL(endpoint);
        this.endpointURL = this.helpers.findFileAndGetValue('resource.properties', endpoint);
        const headers = await this.getRequestHeaders(true);
        let completeURL: string;

        if (dataTable && Array.isArray(dataTable.rawTable)) {
            const paramsMap = new Map<string, string>();
            dataTable.rawTable.forEach(row => {
                let [key, value] = row;
                if (value.includes('<') && value.includes('>')) {
                    value = getTestCaseData(`${value.replace('<', '').replace('>', '')}`);
                } else if (value.includes(':')) {
                    let jsonPath = value.split(':')[1];
                    let jsonObjName = value.split(':')[0];
                    let setData = getTestCaseData(`${jsonObjName}`);
                    let jsonValue = _.get(setData, jsonPath);
                    console.log(`Json Value ::>> ${jsonValue}`);
                    value = jsonValue;
                }
                paramsMap.set(key, value);
            });
            const queryParams = Array.from(paramsMap.entries())
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            completeURL = `${this.baseURL}${this.endpointURL}?${queryParams}`;
        } else {
            completeURL = `${this.baseURL}${this.endpointURL}`;
        }

        const { response } = await this.sendRequest(apiContext, 'get', completeURL, undefined, headers, undefined);
        return response;
    }

    public async getWithPathParam(apiContext: APIRequestContext, endpoint: string, pathParam: string): Promise<any> {
        this.baseURL = await this.getBaseURL(endpoint);
        this.endpointURL = this.helpers.findFileAndGetValue('resource.properties', endpoint);
        const headers = await this.getRequestHeaders(true);

        if (pathParam.includes('<')) {
            const keyToReplace = pathParam.match(/<(\w+)>/)?.[1];
            const savedValue = (global as any).responseMapper.get(keyToReplace);
            if (savedValue) {
                pathParam = pathParam.replace(`<${keyToReplace}>`, savedValue);
            } else {
                throw new Error(`${keyToReplace} not found in response mapper.`);
            }
        }

        const pathParamKey = this.endpointURL.match(/{(\w+)}/)?.[1];
        if (pathParamKey) {
            this.endpointURL = this.endpointURL.replace(`{${pathParamKey}}`, pathParam.replace(/"/g, ''));
        }

        this.completeURL = `${this.baseURL}${this.endpointURL}`;
        const { response } = await this.sendRequest(apiContext, 'get', this.completeURL, undefined, headers, undefined);
        return response;
    }

    public async getWithQueryParam(
        apiContext: APIRequestContext,
        endpoint: string,
        queryParams: { [key: string]: string },
        world?: ICustomWorld
    ): Promise<APIResponse> {
        this.baseURL = await this.getBaseURL(endpoint);
        this.endpointURL = this.helpers.findFileAndGetValue('resource.properties', endpoint);
        const headers = await this.getRequestHeaders(true);
        const queryParamsString = new URLSearchParams(queryParams).toString();
        const endpointWithQueryParams = queryParamsString ? `${this.endpointURL}?${queryParamsString}` : this.endpointURL;
        this.completeURL = `${this.baseURL}${endpointWithQueryParams}`;
    
        // Destructure and return only the response object
        const { response } = await this.sendRequest(
            apiContext,
            'get',
            this.completeURL,
            undefined,
            headers,
            undefined,
            world
        );
    
        return response;
    }

    public async post(apiContext: APIRequestContext, endpoint: string, payload?: object): Promise<any> {
        const url = await this.getCompleteUrl(endpoint);
        const headers = await this.getRequestHeaders(true);
        const { response } = await this.sendRequest(apiContext, 'post', url, payload, headers, undefined, undefined);
        return response;
    }

    public async put(apiContext: APIRequestContext, endpoint: string, payload?: object): Promise<any> {
        const url = await this.getCompleteUrl(endpoint);
        const { response } = await this.sendRequest(apiContext, 'put', url, payload, undefined, undefined, undefined);
        return response;
    }

    public async delete(apiContext: APIRequestContext, endpoint: string): Promise<any> {
        const url = await this.getCompleteUrl(endpoint);
        const { response } = await this.sendRequest(apiContext, 'delete', url, undefined, undefined, undefined, undefined);
        return response;
    }

    //Parses the API response body.
public async parseApiResponse(apiResponse: APIResponse): Promise<any> {
    try {
        return await apiResponse.json();
    } catch (error) {
        return await apiResponse.text();
    }
}

//Logs a warning for missing keys.
public async logMissingKeyWarning(key: string): Promise<any> {
    console.warn(`Key "${key}" not found in the payload.`);
}

    public async sendRequest(
        apiContext: APIRequestContext,
        method: string,
        url: string,
        payload?: object,
        header?: { [key: string]: string },
        additionalHeaders?: any,
        world?: ICustomWorld
    ): Promise<any> {
        const isAuthRequired: boolean = isEmpty(header?.Authorization);
        const commonHeaders = await this.generateHeaders(isAuthRequired);
        const mergedHeaders = this.mergeHeaders(commonHeaders, additionalHeaders);
        const requestHeader = { ...commonHeaders, ...mergedHeaders };

        let curlCommand = `curl -X ${method.toUpperCase()} "${url}"`;
        for (const [key, value] of Object.entries(requestHeader)) {
            curlCommand += ` -H "${key}: ${value}"`;
        }
        if (payload) {
            curlCommand += ` -d '${JSON.stringify(payload)}'`;
        }

        console.log(`cURL Command: ${curlCommand}`);

        let response: APIResponse;
        let responseBody: any;
        try {
            switch (method) {
                case 'get':
                    response = await apiContext.get(url, { headers: requestHeader });
                    break;
                case 'post':
                    response = await apiContext.post(url, { headers: requestHeader, data: payload });
                    break;
                case 'put':
                    response = await apiContext.put(url, { headers: requestHeader, data: payload });
                    break;
                case 'delete':
                    response = await apiContext.delete(url, { headers: requestHeader });
                    break;
                default:
                    throw new Error(`❌ Unsupported HTTP method: ${method}`);
            }

            try {
                responseBody = await response.json();
            } catch (error) {
                responseBody = await response.text();
            }

            console.log(`Response Status: ${response.status()}`);
            console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

            if (world) {
                world.curlCommand = curlCommand;
                world.apiResponseDetails = {
                    status: response.status(),
                    headers: response.headers(),
                    body: responseBody,
                };
                world.apiResponse = response;
            }
            return { response, responseBody };
        } catch (error) {
            console.error(`❌ Error during API call: ${error}`);
            throw error;
        }
    }
}