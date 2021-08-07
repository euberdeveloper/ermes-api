import * as express from 'express';
import * as path from 'path';
import logger from '@/utils/logger';

export default function loadStatic(app: express.Express): void {
    logger.debug('Load static');
    app.use('/stored', express.static(path.join(process.cwd(), 'stored')));
}
