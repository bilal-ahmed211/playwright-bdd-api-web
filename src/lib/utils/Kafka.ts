import { Page } from "@playwright/test";
import { generateKafkaEvent } from "./EventBroker";
import { ICustomWorld } from "../interface/cucumber";

export class Kafka{
    public page: Page;
    public dataSource: any;

    public constructor(self: ICustomWorld){
        const {page, dataSource} = self;
        // this.page = page; // To be fixed
        this.dataSource = dataSource;
    }

    public async triggerkafkaEvent(key: string): Promise<void>{
        await generateKafkaEvent(this.dataSource[key]);
        await this.page.waitForTimeout(10000);
    }
}