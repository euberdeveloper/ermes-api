import { BadRequestError } from './BadRequestError';

export class InvalidBodyError extends BadRequestError {
    protected static readonly defaultMessage: string = 'Invalid path param';

    constructor(message = InvalidBodyError.defaultMessage, details?: any) {
        super(message, details);
        this.name = 'InvalidBodyError';
    }
}
