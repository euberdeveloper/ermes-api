import { Router } from 'express';
import * as Joi from 'joi';

import asyncHandler from '@/utils/asyncHandler';
import logger from '@/utils/logger';
import databaseService from '@/service/database.service';
import { ConfigBody, ErrorBody, InfoResult } from '@/types';
import { InvalidPathParamError, NotFoundError } from '@/errors';
import { InvalidBodyError } from '@/errors/client/InvalidBodyError';
import upload from '@/utils/uploader';

import CONFIG from '@/config';
import filesystemService from '@/service/filesystem.service';

function checkPathParam(value: any, name: string): void {
    if (!value || typeof value !== 'string') {
        throw new InvalidPathParamError('Invalid path parameter', {
            name,
            value
        });
    }
}

function validateConfigBody(body: ConfigBody): ConfigBody {
    const schema = Joi.object({
        paused: Joi.bool().required(),
        resolution: Joi.number().min(0).max(63).required(),
        hours: Joi.array().items(Joi.string()).required(),
        pxFormat: Joi.string().required()
    });

    const result = schema.validate(body);

    if (result.error) {
        logger.warning('Validation error', result.error.message);
        throw new InvalidBodyError(undefined, result.error.message);
    }

    return result.value;
}

function validateErrorBody(body: ErrorBody): ErrorBody {
    const schema = Joi.object({
        errorCode: Joi.number().integer().required()
    });

    const result = schema.validate(body);

    if (result.error) {
        logger.warning('Validation error', result.error.message);
        throw new InvalidBodyError(undefined, result.error.message);
    }

    return result.value;
}

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
            hours: config.hours,
            timestamp: '' + timestamp
        };

        res.json(result);
    }));

    router.post('/:id', asyncHandler(async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        checkPathParam(id, 'id');
        const validatedBody = validateConfigBody(body);

        await databaseService.postConfig(id, validatedBody);

        res.json();
    }));

    router.post('/:id/errors', asyncHandler(async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        checkPathParam(id, 'id');
        const validatedBody = validateErrorBody(body);

        await databaseService.postErrorLog(id, validatedBody);

        res.json();
    }));

    router.post('/:id/errors', asyncHandler(async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        checkPathParam(id, 'id');
        const validatedBody = validateErrorBody(body);

        await databaseService.postErrorLog(id, validatedBody);

        res.json();
    }));

    router.put('/:id/image', upload(CONFIG.TEMP.PATH, 'image'), asyncHandler(async (req, res) => {
        const id = req.params.id;
        checkPathParam(id, 'id');

        const filePath = req.file?.path ?? '';
        filesystemService.moveToStored(filePath, `${id}/${new Date().toISOString()}.jpg`);

        res.json();
    }));


    return router;
}
