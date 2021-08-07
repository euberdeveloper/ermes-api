import * as path from 'path';
import * as dree from 'dree';

import { mkdir, move, writeFile } from '@/utils/fsAsync';
import logger from '@/utils/logger';
import CONFIG from '@/config';

export class FileSystemService {
    private async save(basepath: string, data: string, fileName: string, subpath = ''): Promise<string> {
        const dirPath = path.join(basepath, subpath);
        const filePath = path.resolve(dirPath, fileName);

        try {
            await mkdir(dirPath, { recursive: true });
            await writeFile(filePath, data);
        } catch (error) {
            logger.warning('File system error', error);
            throw error;
        }

        return filePath;
    }

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

    public async saveStored(data: string, fileName: string, subpath = ''): Promise<string> {
        return this.save(CONFIG.STORED.PATH, data, fileName, subpath);
    }

    public listImages(subpath = ''): string[] {
        const dirPath = path.join(CONFIG.STORED.PATH, subpath);
        const images: string[] = [];
        dree.scan(dirPath, { extensions: ['jpg'] }, file => images.push(file.relativePath));
        return images;
    }
}

export default new FileSystemService();
