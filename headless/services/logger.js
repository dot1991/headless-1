"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
/**
 * A static singleton class used to expose the logging mechanism.
 *
 * Logging is provided through the use of a logging chain. When `log`
 * is called, the logger iterates over each logger in the chain calling
 * `log` on each individual logger.
 */
class Logger {
    /**
     * Adds a new logger to the end of the logging chain.
     */
    static addLogger(logger) {
        this.loggers.push(logger);
    }
    /**
     * Clears the logging chain.
     */
    static resetLoggers() {
        this.loggers = [];
    }
    /**
     * Logs a message using each logger in the chain.
     * @param sender The sender of the message.
     * @param message The message.
     * @param level The level of the message.
     */
    static log(sender, message, level = LogLevel.Message) {
        for (const logger of this.loggers) {
            try {
                logger.log(sender, message, level);
            }
            catch (error) {
                // console.log is the only reliable logger at this point.
                // tslint:disable: no-console
                console.log(`${chalk_1.default.bgRedBright('ERROR')} while calling log() on the logger class: ${logger.constructor.name}.`);
                console.error(error);
                // tslint:enable: no-console
            }
        }
    }
}
exports.Logger = Logger;
Logger.loggers = [];
/**
 * A description of the nature of a log message.
 * Since the levels also represent values (`Debug` is `0`, and `Success` is `5`), they may be
 * used to filter out messages before logging.
 * @example
 * if (level < LogLevel.Message) return; // ignore Debug and Info.
 */
var LogLevel;
(function (LogLevel) {
    /**
     * For debug purposes, and probably
     * only needs to be logged when running in a debug environment.
     */
    LogLevel[LogLevel["Debug"] = 0] = "Debug";
    /**
     * Used to log progress of a long running task, or the state of
     * a system.
     */
    LogLevel[LogLevel["Info"] = 1] = "Info";
    /**
     * The standard level of output. Similar to `console.log`.
     */
    LogLevel[LogLevel["Message"] = 2] = "Message";
    /**
     * Used when an error has occurred which is not fatal.
     */
    LogLevel[LogLevel["Warning"] = 3] = "Warning";
    /**
     * Used when a fatal error has occurred that prevents some
     * part of the program from functioning correctly.
     */
    LogLevel[LogLevel["Error"] = 4] = "Error";
    /**
     * Used when an operation has completed successfully.
     */
    LogLevel[LogLevel["Success"] = 5] = "Success";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
