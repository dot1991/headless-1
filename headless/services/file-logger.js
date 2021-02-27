"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const stringUtils = __importStar(require("./string-utils"));
/**
 * A logger which writes log messages to a `WriteStream`.
 */
class FileLogger {
    constructor(logStream) {
        this.logStream = logStream;
    }
    log(sender, message, level) {
        const senderString = (`[${stringUtils.getTime()} | ${sender}]`);
        const printString = stringUtils.pad(senderString, 30) + message;
        let levelString = logger_1.LogLevel[level];
        if (!levelString) {
            levelString = 'custom';
        }
        this.logStream.write(stringUtils.pad(levelString.toUpperCase(), 8) + printString + '\n');
    }
}
exports.FileLogger = FileLogger;
