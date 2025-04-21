import { Collection, MongoClient } from 'mongodb';
import { env } from '../../../env';
import {ICustomWorld} from '../interface/cucumber'

let db: any;
export class DBConnector {
    public apiDataSource: any;
    public DbClient: any;
    public database: any;

    public constructor (self: ICustomWorld, connectionString: any = env.db.connectionString){
        const {apiDataSource} = self;
        this.apiDataSource = apiDataSource;
        this.DbClient = new MongoClient(connectionString);
    }

    public async connect (dbName: string = env.db.name): Promise<void> {
        await this.DbClient.connect();
        this.database = this.DbClient.db(dbName);
    }

    public async select (
        collection: string,
        where: any,
        order: any,
        limit: number
    ): Promise<any> {
        const result = await db.collection(collection).find(where).sort(order).limit(limit).toArray();
        return result;
    }
}
