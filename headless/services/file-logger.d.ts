/// <reference types="node" />
import { WriteStream } from 'fs';
import { LogLevel, LogProvider } from './logger';
/**
 * A logger which writes log messages to a `WriteStream`.
 */
export declare class FileLogger implements LogProvider {
    private logStream;
    constructor(logStream: WriteStream);
    log(sender: string, message: string, level: LogLevel): void;
}
