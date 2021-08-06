export enum ErrorCode {
    SD_NOT_FOUND = 10,
    GENERIC_ERROR = 1000
}

export interface Config {
    id: string;
    paused: boolean;
    resolution: number;
    pxFormat: string;
    lastModified: Date;
    lastPinged: Date;
}

export interface ErrorLog {
    id: string;
    error: ErrorCode;
}

export type InfoResult = Pick<Config, 'paused' | 'pxFormat' | 'resolution'> & {
    timestamp: string;
};

export type ConfigBody = Pick<Config, 'paused' | 'resolution' | 'pxFormat'>;

export type ErrorBody = { errorCode: ErrorCode };