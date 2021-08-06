import * as dotenv from 'dotenv';
import * as path from 'path';

const packageJson = require(path.join(process.cwd(), 'package.json'));

declare const process: {
    env: Record<string, string>;
    cwd: () => string;
};

dotenv.config({
    path: path.join(process.cwd(), '.env')
});

const CONFIG = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    SERVER: {
        PORT: process.env.SERVER_PORT || 3000,
        URL: process.env.SERVER_URL
    },
    MONGODB: {
        URL: process.env.MONGODB_URL,
        DB: process.env.MONGODB_DB,
    },
    LOGGER: {
        DEBUG: process.env.LOGGER_DEBUG === 'true'
    },
    UPLOAD: {
        SIZE_LIMIT: +process.env.UPLOAD_SIZE_LIMIT
    },
    TEMP: {
        PATH: process.env.TEMP_PATH
    },
    STORED: {
        PATH: process.env.STORED_PATH
    },
    API_VERSION: packageJson.version
};

export default CONFIG;
