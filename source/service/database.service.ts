import CONFIG from '@/config';
import { Config, ConfigBody, ErrorBody, ErrorCode, ErrorLog } from '@/types';
import { Collection, MongoClient } from 'mongodb';

export class DatabaseService {
    private getDefaultConfig(id: string): Config {
        const now = new Date();
        return {
            id,
            paused: false,
            resolution: 2,
            pxFormat: 'PXFORMAT_JPEG',
            hours: ['12:00'],
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

        const result = await collection.findOne({ id });
        if (result) {
            return result;
        }

        if (initialConnection) {
            const config = this.getDefaultConfig(id);
            await collection.insertOne(config);
            return config;
        }

        return null;
    }

    public async postConfig(id: string, config: ConfigBody): Promise<void> {
        const configBody: Partial<Config> = {
            id,
            paused: config.paused,
            pxFormat: config.pxFormat,
            resolution: config.resolution,
            lastModified: new Date()
        };

        const collection = await this.getCollection<Config>('configs');
        await collection.updateOne({ id }, { $set: configBody });
    }

    public async postErrorLog(id: string, error: ErrorBody): Promise<void> {
        const collection = await this.getCollection<ErrorLog>('errorLogs');
        await collection.insertOne({ id, error: error.errorCode });
    }
}

export default new DatabaseService();
