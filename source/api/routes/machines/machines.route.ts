import { Router } from 'express';

import asyncHandler from '@/utils/asyncHandler';
import { InvalidPathParamError, NotFoundError } from '@/errors';
import databaseService from '@/service/database.service';
import { Config } from '@/types';

function checkPathParam(value: any, name: string): void {
    if (!value || typeof value !== 'string') {
        throw new InvalidPathParamError('Invalid path parameter', {
            name,
            value
        });
    }
}

type InfoResult = Pick<Config, 'paused' | 'pxFormat' | 'resolution'> & {
    timestamp: number;
};

export default function (): Router {
    const router = Router();

    router.get('/:id', asyncHandler(async (req, res) => {
        const id = req.params.id;
        const initialConnection = req.query.initialConnection;

        checkPathParam(id, 'id');

        const config = await databaseService.getConfig(id, !!initialConnection);

        if (!config) {
            throw new NotFoundError(`Machine with id "${id}" not found`);
        }

        const timestamp = Date.now();
        const result: InfoResult = {
            paused: config.paused,
            pxFormat: config.pxFormat,
            resolution: config.resolution,
            timestamp
        };

        res.json(result);
    }));

    

    return router;
}
