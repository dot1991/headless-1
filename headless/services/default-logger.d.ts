import { LogLevel, LogProvider } from './logger';
/**
 * The default logger used by the CLI.
 */
export declare class DefaultLogger implements LogProvider {
    private minLevel;
    constructor(minLevel?: LogLevel);
    log(sender: string, message: string, level: LogLevel): void;
}
