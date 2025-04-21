import { MongoClient } from 'mongodb';
import { env } from '../../../env';
import { ICustomWorld } from '../interface/cucumber'

let db: any;

export const connect = async (): Promise<any> => {
    const client = new MongoClient(env.db.connectionString);
    await client.connect();
    db = client.db(env.db.name);
}

export const select = async (
    collection: string,
    where: any,
    order: any,
    limit: number
): Promise<any> => {
    const result = await db.collection(collection).find(where).sort(order).limit(limit).toArray();
    return result;
}

if (env.db.enableMongodbConnection) {
    connect();
}