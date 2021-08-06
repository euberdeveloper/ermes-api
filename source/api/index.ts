import { Router } from 'express';
import logger from '@/utils/logger';

import machinesRouter from './routes/machines/machines.route';
import versionRouter from './routes/version/version.route';

export default function (): Router {
    const router = Router();

    logger.debug('/machines');
    router.use('/machines', machinesRouter());

    logger.debug('/version');
    router.use('/version', versionRouter());

    return router;
}
