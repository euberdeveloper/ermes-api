import CONFIG from '@/config';
import { Config, ErrorCode, ErrorLog } from '@/types';
import { Collection, MongoClient } from 'mongodb';

export class DatabaseService {
    private getDefaultConfig(id: string): Config {
        const now = new Date();
        return {
            id,
            paused: false,
            resolution: 2,
            pxFormat: 'PXFORMAT_JPEG',
            lastModified: now,
            lastPinged: now
        };
    }

    private async getConnection(): Promise<MongoClient> {
        return await MongoClient.connect(CONFIG.MONGODB.URL);
    }

    private async getCollection<Type>(collection: string): Promise<Collection<Type>> {
        const connection = await this.getConnection();
        const db = connection.db(CONFIG.MONGODB.DB);
        return db.collection(collection);
    }

    public async tryConnection(): Promise<void> {
        await this.getConnection();
    }

    public async getConfig(id: string, initialConnection: boolean): Promise<Config | null> {
        const collection = await this.getCollection<Config>('configs');

        if (initialConnection) {
            const config = this.getDefaultConfig(id);
            await collection.insertOne(config);
            return config;
        }
        
        const result = await collection.findOne({ id });
        return result ?? null;
    }

    public async postDefaultConfig(id: string): Promise<Config | null> {
        const collection = await this.getCollection<Config>('configs');
        const result = await collection.findOne({ id });
        return result ?? null;
    }

    public async postErrorLog(id: string, error: ErrorCode): Promise<void> {
        const collection = await this.getCollection<ErrorLog>('errorLogs');
        await collection.insertOne({ id, error });
    }
}

export default new DatabaseService();
