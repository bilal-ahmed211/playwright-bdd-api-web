import {APIUtils} from './APIUtils';
import { env } from "../../../env";
let apiContext
const apiUtils = new APIUtils();

export const generateKafkaEvent = async (eventData: any): Promise<any> =>{
    const response = await apiUtils.sendRequest(apiContext,
        'post',
        `${env.playwright.baseApiUrl}`,//To be fix for valid url
        {},
        eventData
    );
    return response.status();
}
