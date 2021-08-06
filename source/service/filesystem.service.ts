import * as path from 'path';

import { mkdir, move } from '@/utils/fsAsync';
import logger from '@/utils/logger';
import CONFIG from '@/config';

export class FileSystemService {
    public async moveToStored(tempPath: string, fileName: string, subpath = ''): Promise<string> {
        try {
            const toDir = path.join(CONFIG.STORED.PATH, subpath);
            const toPath = path.join(toDir, fileName);
            await mkdir(toDir, { recursive: true });
            await move(tempPath, toPath);
            return toPath;
        } catch (error) {
            logger.warning('File system error', error);
            throw error;
        }
    }
}

export default new FileSystemService();
