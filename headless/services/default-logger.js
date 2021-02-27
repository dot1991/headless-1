"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const logger_1 = require("./logger");
const stringUtils = __importStar(require("./string-utils"));
/**
 * The default logger used by the CLI.
 */
class DefaultLogger {
    constructor(minLevel = logger_1.LogLevel.Info) {
        this.minLevel = minLevel;
    }
    log(sender, message, level) {
        if (level < this.minLevel) {
            return;
        }
        const senderString = (`[${stringUtils.getTime()} | ${sender}]`);
        let printString = stringUtils.pad(senderString, 30) + message;
        switch (level) {
            case logger_1.LogLevel.Debug:
            case logger_1.LogLevel.Info:
                printString = chalk_1.default.gray(printString);
                break;
            case logger_1.LogLevel.Warning:
                printString = chalk_1.default.yellow(printString);
                break;
            case logger_1.LogLevel.Error:
                printString = chalk_1.default.red(printString);
                break;
            case logger_1.LogLevel.Success:
                printString = chalk_1.default.green(printString);
                break;
        }
        // tslint:disable-next-line: no-console
        console.log(printString);
    }
}
exports.DefaultLogger = DefaultLogger;
