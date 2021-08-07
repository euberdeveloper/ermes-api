export enum ErrorCode {
    SD_NOT_FOUND = 10,
    GENERIC_ERROR = 1000
}

export interface Config {
    id: string;
    paused: boolean;
    backup: boolean;
    resolution: number;
    pxFormat: string;
    hours: string[];
    lastModified: Date;
    lastPinged: Date;
}

export interface ErrorLog {
    id: string;
    error: ErrorCode;
    timestamp: Date;
}

export type InfoResult = Pick<Config, 'paused' | 'backup' | 'pxFormat' | 'resolution' | 'hours'> & {
    timestamp: string;
};

export type ConfigBody = Pick<Config, 'paused' | 'backup' | 'resolution' | 'pxFormat' | 'hours'>;

export type ErrorBody = { errorCode: ErrorCode };