/**
 * An object which can be used to provide logging or output.
 */
export interface LogProvider {
    log(sender: string, message: string, level: LogLevel): void;
}
/**
 * A static singleton class used to expose the logging mechanism.
 *
 * Logging is provided through the use of a logging chain. When `log`
 * is called, the logger iterates over each logger in the chain calling
 * `log` on each individual logger.
 */
export declare class Logger {
    static loggers: LogProvider[];
    /**
     * Adds a new logger to the end of the logging chain.
     */
    static addLogger(logger: LogProvider): void;
    /**
     * Clears the logging chain.
     */
    static resetLoggers(): void;
    /**
     * Logs a message using each logger in the chain.
     * @param sender The sender of the message.
     * @param message The message.
     * @param level The level of the message.
     */
    static log(sender: string, message: string, level?: LogLevel): void;
}
/**
 * A description of the nature of a log message.
 * Since the levels also represent values (`Debug` is `0`, and `Success` is `5`), they may be
 * used to filter out messages before logging.
 * @example
 * if (level < LogLevel.Message) return; // ignore Debug and Info.
 */
export declare enum LogLevel {
    /**
     * For debug purposes, and probably
     * only needs to be logged when running in a debug environment.
     */
    Debug = 0,
    /**
     * Used to log progress of a long running task, or the state of
     * a system.
     */
    Info = 1,
    /**
     * The standard level of output. Similar to `console.log`.
     */
    Message = 2,
    /**
     * Used when an error has occurred which is not fatal.
     */
    Warning = 3,
    /**
     * Used when a fatal error has occurred that prevents some
     * part of the program from functioning correctly.
     */
    Error = 4,
    /**
     * Used when an operation has completed successfully.
     */
    Success = 5
}
