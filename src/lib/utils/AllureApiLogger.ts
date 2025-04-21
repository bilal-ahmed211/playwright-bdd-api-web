import { APIResponse, request } from '@playwright/test';
import { ICustomWorld } from '../interface/cucumber';

export class AllureApiLogger {
    /**
     * Generates cURL command from request details
     */
    public static generateCurlCommand(
        method: string,
        url: string,
        headers: Record<string, string>,
        payload?: any
    ): string {
        let curl = `curl -X ${method.toUpperCase()} "${url}"`;
        
        // Add headers
        for (const [key, value] of Object.entries(headers)) {
            curl += ` -H "${key}: ${value}"`;
        }
        
        // Add payload if exists
        if (payload) {
            curl += ` -d '${JSON.stringify(payload)}'`;
        }
        
        return curl;
    }

    /**
     * Formats response details for logging
     */
    public static async getResponseDetails(response: APIResponse): Promise<any> {
        let body: any;
        try {
            body = await response.json();
        } catch {
            body = await response.text();
        }

        return {
            status: response.status(),
            headers: Object.fromEntries(Object.entries(response.headers())),
            body,
            // duration: response.timing().requestDuration
        };
    }

    /**
     * Attaches API call details to Allure report
     */
    public static async attachApiCallDetails(
        worldInstance: ICustomWorld,
        method: string,
        url: string,
        headers: Record<string, string>,
        payload?: any,
        response?: APIResponse
    ): Promise<void> {
        if (!worldInstance?.allure) return;

        try {
            // Generate cURL command
            const curlCommand = this.generateCurlCommand(method, url, headers, payload);
            
            // Get response details
            const responseDetails = await this.getResponseDetails(response);

            // Create combined report
            const report = {
                request: {
                    method,
                    url,
                    curl: curlCommand,
                    headers,
                    body: payload
                },
                response: responseDetails
            };

            // Attach to Allure
            await worldInstance.allure.attachment(
                'API Request/Response',
                JSON.stringify(report, null, 2),
                'application/json'
            );
        } catch (error) {
            console.error('Failed to attach API details to Allure:', error);
        }
    }

    /**
     * Logs API call details into the world instance for later use
     */
    public static async logApiCallDetails(
        worldInstance: ICustomWorld,
        method: string,
        url: string,
        headers: Record<string, string>,
        payload: any,
        response: APIResponse
    ): Promise<void> {
        try {
            // Generate cURL command
            const curlCommand = this.generateCurlCommand(method, url, headers, payload);

            // Get response details
            const responseDetails = await this.getResponseDetails(response);

            // Store in world instance
            worldInstance.curlCommand = curlCommand;
            worldInstance.apiResponse = responseDetails;
        } catch (error) {
            console.error('Failed to log API details:', error);
        }
    }
}